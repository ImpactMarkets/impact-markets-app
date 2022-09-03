import { z } from 'zod'
import { createProtectedRouter } from '../create-protected-router'

export const holdingRouter = createProtectedRouter().query('feed', {
  input: z.object({
    take: z.number().min(1).max(50).optional(),
    skip: z.number().min(1).optional(),
    certificateId: z.string().optional(),
  }),
  async resolve({ input, ctx }) {
    const take = input?.take ?? 50
    const skip = input?.skip
    const where = {
      hidden: ctx.isUserAdmin ? undefined : false,
      certificateId: input?.certificateId,
    }
    const holdings = await ctx.prisma.holding.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      where,
      select: {
        id: true,
        certificateId: true,
        user: true,
        type: true,
        size: true,
        cost: true,
      },
    })

    const holdingCount = await ctx.prisma.holding.count({
      where,
    })

    return { holdings, holdingCount }
  },
})
