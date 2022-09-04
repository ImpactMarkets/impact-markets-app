import { z } from 'zod'

import { createProtectedRouter } from '../create-protected-router'

export const holdingRouter = createProtectedRouter().query('feed', {
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
      },
    })

    return holdings
  },
})
