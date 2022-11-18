import { z } from 'zod'

import { BondingCurve } from '@/lib/auction'
import { Prisma, TransactionState } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createProtectedRouter } from '../create-protected-router'

export const transactionRouter = createProtectedRouter()
  .query('feed', {
    input: z.object({
      userId: z.string(),
      certificateId: z.string().optional(),
      state: z.nativeEnum(TransactionState).optional(),
    }),
    async resolve({ input, ctx }) {
      const transactions = await ctx.prisma.transaction.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          OR: [
            {
              sellingHolding: {
                userId: input.userId || undefined,
              },
            },
            {
              buyingHolding: {
                userId: input.userId || undefined,
              },
            },
          ],
          sellingHolding: {
            certificateId: input.certificateId || undefined,
          },
          state: input.state || undefined,
        },
        select: {
          id: true,
          createdAt: true,
          state: true,
          consume: true,
          size: true,
          cost: true,
          sellingHolding: { select: { user: true, certificate: true } },
          buyingHolding: { select: { user: true } },
        },
      })

      return transactions
    },
  })
  .mutation('add', {
    input: (input) => {
      const schema = z.object({
        sellingHolding: z.object({
          id: z.number(),
          certificateId: z.string().min(1),
        }),
        size: z.instanceof(Prisma.Decimal),
        consume: z.boolean(),
      })
      return schema.parse(input)
    },
    async resolve({ ctx, input: { sellingHolding, size, consume } }) {
      const holding = await ctx.prisma.holding.findUniqueOrThrow({
        where: { id: sellingHolding.id },
        include: { sellTransactions: { where: { state: 'PENDING' } } },
      })

      const reservedSize = Prisma.Decimal.sum(
        0,
        ...holding.sellTransactions.map((transaction) => transaction.size)
      )

      const zero = new Prisma.Decimal(0)
      if (size <= zero || size > holding.size.minus(reservedSize)) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const bondingCurve = new BondingCurve(holding.target)
      const cost = bondingCurve
        .costOfSize(holding.valuation, size, reservedSize)
        .toDecimalPlaces(2, Prisma.Decimal.ROUND_UP)
      const valuation = bondingCurve
        .valuationAt(
          bondingCurve
            .fractionAt(holding.valuation)
            .plus(reservedSize)
            .plus(size)
        )
        .toDecimalPlaces(2, Prisma.Decimal.ROUND_UP)

      // This is a bit confusing b/c our model and the database feature are both called tranactions
      const transaction = await ctx.prisma.$transaction(async (prisma) => {
        const buyingHolding = await prisma.holding.upsert({
          where: {
            certificateId_userId_type: {
              certificateId: sellingHolding.certificateId,
              userId: ctx.session!.user.id,
              type: 'RESERVATION',
            },
          },
          update: {
            size: { increment: size },
            cost: { increment: cost },
            valuation,
          },
          create: {
            certificateId: sellingHolding.certificateId,
            userId: ctx.session!.user.id,
            type: 'RESERVATION',
            size,
            cost,
            valuation,
          },
        })
        const transaction = await prisma.transaction.create({
          data: {
            sellingHoldingId: sellingHolding.id,
            buyingHoldingId: buyingHolding.id,
            size,
            cost,
            consume,
          },
        })
        return transaction
      })

      return transaction
    },
  })
  .mutation('confirm', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      const transaction = await ctx.prisma.transaction.findUniqueOrThrow({
        where: { id },
        include: {
          buyingHolding: true,
          sellingHolding: true,
        },
      })

      await ctx.prisma.$transaction([
        // Update the size of the selling holding
        ctx.prisma.holding.update({
          where: { id: transaction.sellingHoldingId },
          data: {
            size: { decrement: transaction.size },
            cost: { decrement: transaction.cost },
          },
        }),
        // Update the valuation of all holdings of the same certificate
        // Not doing this would require issuers to pay attention all the time; doing this when a
        // transaction is created would introduce more complexity around updating and reverting
        // valuations in view of transactions against different holdings of the same certificate.
        ctx.prisma.holding.updateMany({
          where: {
            certificateId: transaction.sellingHolding.certificateId,
            type: 'OWNERSHIP',
          },
          data: {
            valuation: transaction.buyingHolding.valuation,
          },
        }),
        ctx.prisma.holding.update({
          where: { id: transaction.buyingHoldingId },
          data: {
            size: { decrement: transaction.size },
            cost: { decrement: transaction.cost },
          },
        }),
        ctx.prisma.holding.upsert({
          where: {
            certificateId_userId_type: {
              certificateId: transaction.sellingHolding.certificateId,
              userId: transaction.buyingHolding.userId,
              type: transaction.consume ? 'CONSUMPTION' : 'OWNERSHIP',
            },
          },
          update: {
            size: { increment: transaction.size },
            cost: { increment: transaction.cost },
            valuation: transaction.buyingHolding.valuation,
          },
          create: {
            certificateId: transaction.sellingHolding.certificateId,
            userId: transaction.buyingHolding.userId,
            type: transaction.consume ? 'CONSUMPTION' : 'OWNERSHIP',
            size: transaction.size,
            cost: transaction.cost,
            valuation: transaction.buyingHolding.valuation,
          },
        }),
        ctx.prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            state: 'CONFIRMED',
          },
        }),
        ctx.prisma.holding.deleteMany({
          where: { size: 0, type: { in: ['RESERVATION', 'OWNERSHIP'] } },
        }),
      ])

      return id
    },
  })
  .mutation('cancel', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      const transaction = await ctx.prisma.transaction.findUniqueOrThrow({
        where: { id },
        include: {
          buyingHolding: true,
          sellingHolding: true,
        },
      })

      await ctx.prisma.$transaction([
        ctx.prisma.holding.update({
          where: { id: transaction.buyingHoldingId },
          data: {
            size: { decrement: transaction.size },
            cost: { decrement: transaction.cost },
          },
        }),
        ctx.prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            state: 'CONFIRMED',
          },
        }),
        ctx.prisma.holding.deleteMany({
          where: { size: 0, type: { in: ['RESERVATION', 'OWNERSHIP'] } },
        }),
      ])

      return id
    },
  })
