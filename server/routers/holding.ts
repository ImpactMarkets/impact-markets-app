import { z } from 'zod'

import { protectedProcedure } from '../procedures'
import { router } from '../router'

export const holdingRouter = router({
  feed: protectedProcedure
    .input(
      z.object({
        certificateId: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const holdings = await ctx.prisma.holding.findMany({
        orderBy: {
          size: 'desc',
        },
        where: {
          certificateId: input.certificateId,
          size: { gt: 0 },
        },
        select: {
          id: true,
          certificateId: true,
          user: {
            select: {
              id: true,
              name: true,
              paymentUrl: true,
              image: true,
            },
          },
          type: true,
          size: true,
          cost: true,
          valuation: true,
          target: true,
          sellTransactions: { where: { state: 'PENDING' } },
        },
      })

      return holdings
    }),
})
