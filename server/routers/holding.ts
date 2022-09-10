import { z } from 'zod'

import { Prisma } from '@prisma/client'

import { createProtectedRouter } from '../create-protected-router'

export const holdingRouter = createProtectedRouter()
  .query('feed', {
    input: z.object({
      certificateId: z.number(),
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
        },
      })

      return holdings
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      valuation: z.string(),
    }),
    async resolve({ input: { id, valuation: valuation_ }, ctx }) {
      const valuation = new Prisma.Decimal(valuation_)
      // updateMany only to make the userId condition work – should still always be 0 or 1
      await ctx.prisma.holding.updateMany({
        where: {
          id,
          userId: ctx.session.user.id,
        },
        data: {
          valuation,
        },
      })
    },
  })
