import { z } from 'zod'

import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createProtectedRouter } from '../create-protected-router'

export const holdingRouter = createProtectedRouter()
  .query('feed', {
    input: z.object({
      certificateId: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      const holdings = await ctx.prisma.holding.findMany({
        orderBy: {
          size: 'desc',
        },
        where: {
          certificateId: input.certificateId,
        },
        select: {
          id: true,
          certificateId: true,
          user: true,
          type: true,
          size: true,
          cost: true,
          valuation: true,
          target: true,
          sellTransactions: { where: { state: 'PENDING' } },
        },
      })

      return holdings
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      valuation: z.instanceof(Prisma.Decimal),
      target: z.instanceof(Prisma.Decimal),
    }),
    async resolve({ input: { id, valuation, target }, ctx }) {
      const one = new Prisma.Decimal(1)
      if (valuation < one) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      await ctx.prisma.holding.update({
        where: {
          id,
        },
        data: {
          valuation,
          target,
        },
      })
    },
  })
