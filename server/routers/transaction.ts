import { z } from 'zod'

import { Prisma, TransactionState } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createProtectedRouter } from '../create-protected-router'

export const transactionRouter = createProtectedRouter()
  .query('feed', {
    input: z
      .object({
        take: z.number().min(1).max(50).optional(),
        skip: z.number().min(1).optional(),
        userId: z.string(),
        certificateId: z.number().optional(),
        state: z.nativeEnum(TransactionState).optional(),
      })
      .optional(),
    async resolve({ input, ctx }) {
      const take = input?.take ?? 50
      const skip = input?.skip

      const transactions = await ctx.prisma.transaction.findMany({
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          sellingHolding: {
            certificateId: input?.certificateId,
          },
          buyerId: input?.userId,
          state: input?.state,
        },
        select: {
          id: true,
          createdAt: true,
          state: true,
          consume: true,
          size: true,
          cost: true,
        },
      })

      return transactions
    },
  })
  .mutation('add', {
    input: z.object({
      userId: z.string(),
      sellingHolding: z.object({
        id: z.number(),
        certificateId: z.number(),
      }),
      size: z.string(),
      cost: z.string(),
      consume: z.boolean(),
    }),
    async resolve({
      ctx,
      input: { userId, sellingHolding, size: size_, cost: cost_, consume },
    }) {
      const size = new Prisma.Decimal(size_)
      const cost = new Prisma.Decimal(cost_)
      const buyingHolding = await ctx.prisma.holding.upsert({
        where: {
          certificateId_userId_type: {
            certificateId: sellingHolding.certificateId,
            userId: userId,
            type: 'RESERVATION',
          },
        },
        update: { size: { increment: size }, cost: { increment: cost } },
        create: {
          certificateId: sellingHolding.certificateId,
          userId: userId,
          type: 'RESERVATION',
          size,
          cost,
        },
      })
      const transaction = await ctx.prisma.transaction.create({
        data: {
          buyerId: userId,
          sellingHoldingId: sellingHolding.id,
          buyingHoldingId: buyingHolding.id,
          size,
          cost,
          consume,
        },
      })

      return transaction
    },
  })
  .mutation('confirm', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: { id },
        include: {
          sellingHolding: true,
        },
      })

      if (transaction?.sellingHolding.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const [
        _sellingHolding,
        _reservingHolding,
        _buyingHolding,
        _transaction,
        _deletedHoldings,
      ] = await ctx.prisma.$transaction([
        ctx.prisma.holding.update({
          where: { id: transaction.sellingHoldingId },
          data: {
            size: { decrement: transaction.size },
            cost: { decrement: transaction.cost },
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
              userId: transaction.buyerId,
              type: transaction.consume ? 'CONSUMPTION' : 'OWNERSHIP',
            },
          },
          update: {
            size: { increment: transaction.size },
            cost: { increment: transaction.cost },
          },
          create: {
            certificateId: transaction.sellingHolding.certificateId,
            userId: transaction.buyerId,
            type: transaction.consume ? 'CONSUMPTION' : 'OWNERSHIP',
            size: transaction.size,
            cost: transaction.cost,
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
      const transaction = await ctx.prisma.transaction.findUnique({
        where: { id },
        include: {
          sellingHolding: true,
        },
      })

      if (transaction?.sellingHolding.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const [_reservingHolding, _buyingHolding, _deletedHoldings] =
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
