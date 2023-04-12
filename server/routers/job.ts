import { Context } from 'server/context'
import { z } from 'zod'

import {
  EmailResources,
  commentSelect,
  createEmail,
  donationSelect,
  projectSelect,
  sendEmail,
} from '@/lib/notifyemail'
import { Prisma } from '@prisma/client'
import { Event, EventStatus, EventType } from '@prisma/client'

import { createProtectedRouter } from '../createProtectedRouter'

type ProjectId = string

export const jobRouter = createProtectedRouter()
  .mutation('sendEmails', {
    input: z.void(),
    async resolve({ ctx }) {
      const events = await ctx.prisma.event.findMany({
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

      let eventHierarchy = new Map<ProjectId, Map<EventType, Event[]>>()
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
          const emailHtml = createEmail(
            events[i].recipient.name,
            eventHierarchy,
            emailResources
          )
          if (events[i].recipient.prefersEventNotifications) {
            await sendEmail(events[i].recipient.email || '', emailHtml)
          }
          await markEventsCompleted(ctx, eventHierarchy)

          eventHierarchy = new Map<ProjectId, Map<EventType, Event[]>>()
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
  eventHierarchy: Map<ProjectId, Map<EventType, Event[]>>,
  event: Event
) {
  const paramsObject = event.parameters as Prisma.JsonObject
  const projectId = paramsObject['projectId'] as string

  if (!eventHierarchy.has(projectId)) {
    eventHierarchy.set(projectId, new Map<EventType, Event[]>())
  }
  if (!eventHierarchy.get(projectId)?.has(event.type)) {
    eventHierarchy.get(projectId)?.set(event.type, [])
  }
  eventHierarchy.get(projectId)?.get(event.type)?.push(event)
}

async function addToEmailResources(
  ctx: Context,
  emailResources: EmailResources,
  event: Event
) {
  const paramsObject = event.parameters as Prisma.JsonObject
  const projectId = paramsObject['projectId'] as string

  if (!emailResources.projects.has(projectId)) {
    const project = await ctx.prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: projectSelect,
    })
    if (project) {
      emailResources.projects.set(projectId, project)
    }
  }

  if (event.type == EventType.DONATION) {
    const donationId = paramsObject['donationId'] as number
    const donation = await ctx.prisma.donation.findUnique({
      where: {
        id: donationId,
      },
      select: donationSelect,
    })
    if (donation) {
      emailResources.donations.set(donationId, donation)
    }
  } else if (event.type == EventType.COMMENT) {
    const commentId = paramsObject['commentId'] as number
    const comment = await ctx.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: commentSelect,
    })
    if (comment) {
      emailResources.comments.set(commentId, comment)
    }
  }
}

async function markEventsCompleted(
  ctx: Context,
  eventHierarchy: Map<ProjectId, Map<EventType, Event[]>>
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
