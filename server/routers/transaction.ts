import { z } from 'zod'

import { BondingCurve } from '@/lib/auction'
import { TARGET_FRACTION } from '@/lib/constants'
import { Prisma, TransactionState } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createProtectedRouter } from '../createProtectedRouter'

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
    async resolve({ ctx, input: { sellingHolding, size, consume: consume_ } }) {
      const holding = await ctx.prisma.holding.findUniqueOrThrow({
        where: { id: sellingHolding.id },
        include: {
          sellTransactions: { where: { state: 'PENDING' } },
          certificate: true,
        },
      })

      // Force consumption if the project is active
      // TODO: Once we have investors, they’ll be able to buy even if the project is active
      const isActive = holding.certificate.actionEnd > new Date()
      const consume = isActive || consume_

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
        .valuationAtFraction(
          bondingCurve
            .fractionAtValuation(holding.valuation)
            .plus(reservedSize)
            .plus(size)
        )
        .toDecimalPlaces(2, Prisma.Decimal.ROUND_UP)
      const target = valuation.times(holding.size).times(TARGET_FRACTION)

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
            target,
          },
          create: {
            certificateId: sellingHolding.certificateId,
            userId: ctx.session!.user.id,
            type: 'RESERVATION',
            size,
            cost,
            valuation,
            target,
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

      await ctx.prisma.$transaction(async (tx) => {
        // Update the size of the selling holding
        await tx.holding.update({
          where: { id: transaction.sellingHoldingId },
          data: {
            size: { decrement: transaction.size },
            cost: { decrement: transaction.cost },
          },
        })

        // Update the valuation of all holdings of the same certificate
        // Not doing this would require issuers to pay attention all the time; doing this when a
        // transaction is created would introduce more complexity around updating and reverting
        // valuations in view of transactions against different holdings of the same certificate.
        // https://github.com/prisma/prisma/issues/5761
        // https://stackoverflow.com/questions/72660562/execute-postgresql-function-in-prisma-without-using-queryraw
        await tx.$queryRaw(
          Prisma.sql`
            UPDATE "Holding"
            SET "valuation" = greatest("valuation", ${transaction.buyingHolding.valuation}),
                "target" = greatest("target", ${transaction.buyingHolding.target})
            WHERE "certificateId" = ${transaction.sellingHolding.certificateId}
              AND "type" = 'OWNERSHIP'
        `
        )

        // The buyer might already have a holding, so we can either (1) check whether that’s the
        // case and update the existing holding and delete the reservation holding (if empty) or
        // otherwise flip the reservation holding to an ownership holding, or (2) use the handy
        // upsert method to create/update the ownership holding, and then get rid of the reservation
        // holding (if empty) in both cases. We’re going with option 2 here.
        const nonReservationBuyingHolding = await tx.holding.upsert({
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
            target: transaction.buyingHolding.target,
          },
          create: {
            certificateId: transaction.sellingHolding.certificateId,
            userId: transaction.buyingHolding.userId,
            type: transaction.consume ? 'CONSUMPTION' : 'OWNERSHIP',
            size: transaction.size,
            cost: transaction.cost,
            valuation: transaction.buyingHolding.valuation,
            target: transaction.buyingHolding.target,
          },
        })

        // Remove from the reservation holding what we’ve added to the ownership/consumption holding
        await tx.holding.update({
          where: { id: transaction.buyingHoldingId },
          data: {
            size: { decrement: transaction.size },
            cost: { decrement: transaction.cost },
          },
        })

        // Switch the completed transaction over to the new buying holding
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            buyingHoldingId: nonReservationBuyingHolding.id,
            state: 'CONFIRMED',
          },
        })

        // The old reservation holding might be empty now, so we can get rid of it. But we keep
        // possibly empty selling holdings because they’re associated with transactions we don’t
        // want to lose.
        await tx.holding.deleteMany({
          where: { size: 0, type: 'RESERVATION' },
        })
      })

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
        // There might be several transactions against the same buying holding, see above
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
            state: 'REJECTED',
          },
        }),
      ])

      return id
    },
  })
