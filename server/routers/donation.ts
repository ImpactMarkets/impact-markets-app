import { z } from 'zod'

import { DonationState, Prisma } from '@prisma/client'

import { createProtectedRouter } from '../createProtectedRouter'

export const donationRouter = createProtectedRouter()
  .query('feed', {
    input: z.object({
      projectId: z.string(),
      userId: z.string().optional(),
      state: z.nativeEnum(DonationState).optional(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.donation.findMany({
        orderBy: {
          time: 'desc',
        },
        where: {
          projectId: input.projectId,
          userId: input.userId || undefined,
          state: input.state || undefined,
          OR: [
            { state: 'CONFIRMED' },
            { userId: ctx.session?.user.id },
            { project: { authorId: ctx.session?.user.id } },
          ],
        },
        select: {
          id: true,
          time: true,
          state: true,
          amount: true,
          userId: true,
          projectId: true,
        },
      })
    },
  })
  .mutation('add', {
    input: z.object({
      projectId: z.string().min(1),
      userId: z.string().min(1),
      amount: z.instanceof(Prisma.Decimal),
      time: z.instanceof(Date),
    }),
    async resolve({ ctx, input: { projectId, userId, amount, time } }) {
      return await ctx.prisma.donation.create({
        data: {
          projectId,
          userId,
          amount,
          time,
        },
      })
    },
  })
  .mutation('confirm', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      return await ctx.prisma.donation.update({
        where: { id },
        data: {
          state: 'CONFIRMED',
        },
      })
    },
  })
  .mutation('cancel', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      return await ctx.prisma.donation.update({
        where: { id },
        data: {
          state: 'REJECTED',
        },
      })
    },
  })
