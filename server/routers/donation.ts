import { Context } from 'server/context'
import { z } from 'zod'

import { selects } from '@/lib/notifyemail'
import { DonationState, Prisma } from '@prisma/client'
import { EventStatus, EventType } from '@prisma/client'

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
          user: true,
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
      const donation = await ctx.prisma.donation.create({
        data: {
          projectId,
          userId,
          amount,
          time,
        },
      })

      // We don't wait for the event to emit before continuing.
      emitNewDonationEvent(ctx, projectId, donation.id)

      return donation
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

async function emitNewDonationEvent(
  ctx: Context,
  projectId: string,
  donationId: number
) {
  const project = await ctx.prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: selects.project,
  })

  await ctx.prisma.event.create({
    data: {
      type: EventType.DONATION,
      parameters: {
        objectId: projectId,
        objectType: 'project',
        donationId: donationId,
      },
      status: EventStatus.PENDING || undefined,
      recipient: {
        connect: {
          id: project?.author.id,
        },
      },
    },
  })
}
