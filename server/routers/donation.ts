import { Context } from 'server/context'
import { z } from 'zod'

import { num } from '@/lib/text'
import { DonationState, Prisma, Project, User } from '@prisma/client'
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
        orderBy: [{ time: 'desc' }, { createdAt: 'desc' }],
        where: {
          projectId: input.projectId,
          userId: input.userId || undefined,
          state: input.state || undefined,
          OR:
            ctx.session?.user.role === 'ADMIN'
              ? undefined
              : [
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
        select: {
          id: true,
          project: true,
          amount: true,
          user: true,
        },
      })

      // We don't wait for the event to emit before continuing.
      emitNewDonationEvent(ctx, donation)

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
  {
    user,
    project,
    amount,
  }: {
    user: User
    project: Project
    id: number
    amount: Prisma.Decimal
  }
) {
  await ctx.prisma.event.create({
    data: {
      type: EventType.DONATION,
      parameters: {
        objectId: project.id,
        objectType: 'project',
        objectTitle: project.title,
        text: `**${user.name}** registered a donation of **$${num(amount)}**`,
      },
      status: EventStatus.PENDING,
      recipient: {
        connect: {
          id: project.authorId,
        },
      },
    },
  })
}
