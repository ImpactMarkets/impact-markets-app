import { groupBy } from 'lodash'
import { Context } from 'server/context'
import { z } from 'zod'

import { Event, createEmail, sendEmail } from '@/lib/emailEvents'
import { EventStatus } from '@prisma/client'

import { createProtectedRouter } from '../createProtectedRouter'

export const jobRouter = createProtectedRouter()
  .mutation('sendEmails', {
    input: z.void(),
    async resolve({ ctx }) {
      const rawEvents = await ctx.prisma.event.findMany({
        orderBy: [
          {
            recipientId: 'desc',
          },
          {
            type: 'desc',
          },
          {
            time: 'asc',
          },
        ],
        where: {
          status: EventStatus.PENDING,
        },
        select: {
          id: true,
          time: true,
          type: true,
          parameters: true,
          status: true,
          recipient: true,
        },
      })
      const eventsByRecipient = groupBy(
        rawEvents.map((event) => Event.strip().parse(event)),
        (event) => event.recipient.id
      )
      for (const events of Object.values(eventsByRecipient)) {
        const recipient = events[0].recipient
        const emailHtml = createEmail(recipient, events)
        await sendEmail(recipient.email, emailHtml)
        await markEventsCompleted(ctx, events)
      }
    },
  })
  .mutation('deleteCompletedNotifications', {
    input: z.void(),
    async resolve({ ctx }) {
      return await ctx.prisma.event.deleteMany({
        where: { status: EventStatus.COMPLETED },
      })
    },
  })

async function markEventsCompleted(ctx: Context, events: Event[]) {
  const allEventIds = events.map((event) => event.id)
  await ctx.prisma.event.updateMany({
    where: { id: { in: allEventIds } },
    data: {
      status: EventStatus.COMPLETED,
    },
  })
}
