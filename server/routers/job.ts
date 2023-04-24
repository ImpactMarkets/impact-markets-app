import { Context } from 'server/context'
import { z } from 'zod'

import {
  EmailResources,
  Event,
  createEmail,
  selects,
  sendEmail,
} from '@/lib/notifyemail'
import { EventStatus, EventType } from '@prisma/client'

import { createProtectedRouter } from '../createProtectedRouter'

export const jobRouter = createProtectedRouter()
  .mutation('sendEmails', {
    input: z.void(),
    async resolve({ ctx }) {
      const events_ = await ctx.prisma.event.findMany({
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
          recipientId: true,
        },
      })
      const events = events_.map((event) => Event.strip().parse(event))

      let eventHierarchy = new Map<string, Map<EventType, Event[]>>()
      let emailResources = new EmailResources()

      for (let i = 0; i < events.length; i++) {
        addToEventHierarchy(eventHierarchy, events[i])
        await addToEmailResources(ctx, emailResources, events[i])

        // Since we've ordered the events by recipient, we know we're done with the current recipient
        // when the next event has a different one.
        if (
          i + 1 == events.length ||
          events[i].recipientId != events[i + 1].recipientId
        ) {
          if (events[i].recipient.prefersEventNotifications) {
            const emailHtml = createEmail(
              events[i].recipient,
              eventHierarchy,
              emailResources
            )
            await sendEmail(events[i].recipient.email || '', emailHtml)
          }
          await markEventsCompleted(ctx, eventHierarchy)

          eventHierarchy = new Map<string, Map<EventType, Event[]>>()
          emailResources = new EmailResources()
        }
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

function addToEventHierarchy(
  eventHierarchy: Map<string, Map<EventType, Event[]>>,
  event: Event
) {
  const { objectId } = event.parameters

  if (!eventHierarchy.has(objectId)) {
    eventHierarchy.set(objectId, new Map<EventType, Event[]>())
  }
  if (!eventHierarchy.get(objectId)?.has(event.type)) {
    eventHierarchy.get(objectId)?.set(event.type, [])
  }
  eventHierarchy.get(objectId)?.get(event.type)?.push(event)
}

async function addToEmailResources(
  ctx: Context,
  emailResources: EmailResources,
  event: Event
) {
  const { objectId, objectType, donationId, commentId } = event.parameters

  if (objectId != null && !emailResources.projects.has(objectId)) {
    // The straightforward ctx.prisma[objectType].findUnique(query) caused opaque type errors
    const query = {
      where: {
        id: objectId,
      },
      select: selects.project,
    }
    const commentee =
      objectType === 'project'
        ? await ctx.prisma.project.findUnique(query)
        : await ctx.prisma.bounty.findUnique(query)
    if (commentee) {
      emailResources.projects.set(objectId, commentee)
    }
  }

  if (event.type == EventType.DONATION && donationId != null) {
    const donation = await ctx.prisma.donation.findUnique({
      where: {
        id: donationId,
      },
      select: selects.donation,
    })
    if (donation) {
      emailResources.donations.set(donationId, donation)
    }
  } else if (event.type == EventType.COMMENT && commentId != null) {
    const comment = await ctx.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: selects.comment,
    })
    if (comment) {
      emailResources.comments.set(commentId, comment)
    }
  }
}

async function markEventsCompleted(
  ctx: Context,
  eventHierarchy: Map<string, Map<EventType, Event[]>>
) {
  const allEventIds = Array.from(eventHierarchy.values()).flatMap(
    (eventTypeToEvents) =>
      Array.from(eventTypeToEvents.values()).flatMap((events) =>
        events.flatMap((event) => event.id)
      )
  )
  await ctx.prisma.$transaction(
    allEventIds.map((eventId) =>
      ctx.prisma.event.update({
        where: { id: eventId },
        data: {
          status: EventStatus.COMPLETED,
        },
      })
    )
  )
}
