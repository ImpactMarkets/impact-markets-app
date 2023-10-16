import { Context } from 'server/context'
import { z } from 'zod'

import { DonationState, Prisma, Project, User } from '@prisma/client'
import { EventStatus, EventType } from '@prisma/client'

import { serverEnv } from '@/env/server'
import { num } from '@/lib/text'

import { protectedProcedure } from '../procedures'
import { router } from '../router'

export const donationRouter = router({
  feed: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string().optional(),
        state: z.nativeEnum(DonationState).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
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
    }),
  add: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        userId: z.string().min(1),
        amount: z.instanceof(Prisma.Decimal),
        time: z.instanceof(Date),
      }),
    )
    .mutation(async ({ ctx, input: { projectId, userId, amount, time } }) => {
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
    }),
  confirm: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      return await ctx.prisma.donation.update({
        where: { id },
        data: {
          state: 'CONFIRMED',
        },
      })
    }),
  cancel: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      return await ctx.prisma.donation.update({
        where: { id },
        data: {
          state: 'REJECTED',
        },
      })
    }),
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
  },
) {
  const subscriberIds = [project.authorId, serverEnv.IMPACT_MARKETS_USER]
  for (const subscriberId of subscriberIds) {
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
            id: subscriberId,
          },
        },
      },
    })
  }
}
