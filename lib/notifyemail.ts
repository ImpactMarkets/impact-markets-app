import * as htmlToText from 'html-to-text'
import DOMPurify from 'isomorphic-dompurify'
import mjml2html from 'mjml'
import { createTransport } from 'nodemailer'
import { z } from 'zod'

import { Prisma } from '@prisma/client'
import { EventStatus, EventType } from '@prisma/client'

import { capitalize } from './text'

export const Event = z.object({
  id: z.number(),
  time: z.date(),
  // z.enum needs at least one value, but our enums have > 1 value
  type: z.enum(Object.keys(EventType) as [EventType, ...EventType[]]),
  status: z.enum(Object.keys(EventStatus) as [EventStatus, ...EventStatus[]]),
  recipientId: z.string(),
  recipient: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    prefersEventNotifications: z.boolean(),
  }),
  parameters: z.object({
    objectId: z.string(),
    objectType: z.enum(['project', 'bounty']),
    commentId: z.number().nullable().optional(),
    donationId: z.number().nullable().optional(),
  }),
})

export type Event = z.infer<typeof Event>

// Prisma query types for displaying information in the emails.
export const selects = {
  project: Prisma.validator<Prisma.ProjectSelect>()({
    title: true,
    author: {
      select: {
        id: true,
        name: true,
        image: true,
      },
    },
  }),
  bounty: Prisma.validator<Prisma.BountySelect>()({
    title: true,
    author: {
      select: {
        id: true,
        name: true,
        image: true,
      },
    },
  }),
  donation: Prisma.validator<Prisma.DonationSelect>()({
    amount: true,
    user: {
      select: {
        name: true,
        image: true,
      },
    },
  }),
  comment: Prisma.validator<Prisma.CommentSelect>()({
    content: true,
    author: {
      select: {
        name: true,
        image: true,
      },
    },
  }),
}

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  select: typeof selects.project
}>
export type BountyWithRelations = Prisma.BountyGetPayload<{
  select: typeof selects.bounty
}>
export type DonationWithRelations = Prisma.DonationGetPayload<{
  select: typeof selects.donation
}>
export type CommentWithRelations = Prisma.CommentGetPayload<{
  select: typeof selects.comment
}>

// Utility class for storing all the resources that will be needed in the emails.
//
// We need a separate structure for holding these, because the Event model itself doesn't actually
// hold these data as relations; just their ids in the `parameters` Json field.
export class EmailResources {
  projects: Map<string, ProjectWithRelations>
  bounties: Map<string, BountyWithRelations>
  donations: Map<number, DonationWithRelations>
  comments: Map<number, CommentWithRelations>

  constructor() {
    this.projects = new Map<string, ProjectWithRelations>()
    this.bounties = new Map<string, BountyWithRelations>()
    this.donations = new Map<number, DonationWithRelations>()
    this.comments = new Map<number, CommentWithRelations>()
  }
}

// Construct the email body and return the html.
export function createEmail(
  userName: string,
  eventHierarchy: Map<ProjectId, Map<EventType, Event[]>>,
  resources: EmailResources
) {
  const emailContents = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-image width="200px" src="https://app.impactmarkets.io/static/images/logo-light.png"></mj-image>
            <mj-divider border-color="#EE0000"></mj-divider>
            <mj-text>
              Hello ${userName},</br>
              Here is your recent activity summary:
            </mj-text>
            <mj-divider border-color="#EE0000"></mj-divider>
            ${projectsSection(eventHierarchy, resources)}
            <mj-divider border-color="#EE0000"></mj-divider>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `
  return DOMPurify.sanitize(mjml2html(emailContents).html)
}

function projectsSection(
  eventHierarchy: Map<ProjectId, Map<EventType, Event[]>>,
  resources: EmailResources
) {
  const emailContentsArr = Array.from(eventHierarchy).map(
    ([projectId, eventTypeToEvents]) => {
      const project = resources.projects.get(projectId)

      return `
		  <mj-text>
        <h1><a href="https://app.impactmarkets.io/project/${projectId}">${
        project?.title
      }</a></h1>
		  </mj-text>
      ${eventsSubsection(
        '', // "New project created" section; No header needed.
        eventTypeToEvents.get(EventType.PROJECT),
        showProjectCreation(resources)
      )}
      ${eventsSubsection(
        '<h2>Donations</h2>',
        eventTypeToEvents.get(EventType.DONATION),
        showDonation(resources)
      )}
      ${eventsSubsection(
        '<h2>Comments</h2>',
        eventTypeToEvents.get(EventType.COMMENT),
        showComment(resources)
      )}
    `
    }
  )
  return emailContentsArr.join(
    `<mj-divider border-color="#EE0000"></mj-divider></br>`
  )
}

function eventsSubsection(
  header: string,
  events: Event[] | undefined,
  displayer: (event: Event) => string
) {
  if (!events || events.length == 0) {
    return ``
  }
  return `
		<mj-text>
			${header}
      ${events.map(displayer).join(`</br>`)}
		</mj-text>
	`
}

function showProjectCreation(resources: EmailResources) {
  return (event: Event) => {
    const objectId = String(event.parameters.objectId)
    const objectType = String(event.parameters.objectType)
    const projectOrBounty =
      objectType === 'project'
        ? resources.projects.get(objectId)
        : resources.bounties.get(objectId)

    return `Project was created by <strong>${project?.author.name}</strong>`
  }
}

function showDonation(resources: EmailResources) {
  return (event: Event) => {
    const { donationId } = event.parameters
    const donation = donationId ? resources.donations.get(donationId) : null


    return `<strong>${donation?.user.name}</strong> donated <strong>${donation?.amount}</strong>`
  }
}

function showComment(resources: EmailResources) {
  return (event: Event) => {
    const { commentId } = event.parameters
    const comment = commentId ? resources.comments.get(commentId) : null


    return `<strong>${comment?.author.name}</strong> added a comment`
  }
}

export async function sendEmail(recipientAddress: string, emailHtml: string) {
  const transporter = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  if (
    process.env.NODE_ENV === 'production' ||
    recipientAddress.endsWith('@impactmarkets.io')
  ) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipientAddress,
      subject: 'Recent Activity on Your Projects',
      text: htmlToText.convert(emailHtml, { wordwrap: 130 }),
      html: emailHtml,
    })
  }
}
