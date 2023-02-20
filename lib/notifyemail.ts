import DOMPurify from 'isomorphic-dompurify'
import { Prisma } from '@prisma/client'
import mjml2html from 'mjml'

import { Event, EventType } from '@prisma/client'

type ProjectId = string
type DonationId = number
type CommentId = number

// Prisma query types for displaying information in the emails.
export const projectSelect = Prisma.validator<Prisma.ProjectSelect>()({
  title: true,
  paymentUrl: true,
  author: {
    select: {
      name: true,
      image: true,
    },
  },
})
export const donationSelect = Prisma.validator<Prisma.DonationSelect>()({
  amount: true,
  user: {
    select: {
      name: true,
      image: true,
    },
  },
})
export const commentSelect = Prisma.validator<Prisma.CommentSelect>()({
  content: true,
  author: {
    select: {
      name: true,
      image: true,
    },
  },
})

export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  select: typeof projectSelect;
}>;
export type DonationWithRelations = Prisma.DonationGetPayload<{
  select: typeof donationSelect;
}>;
export type CommentWithRelations = Prisma.CommentGetPayload<{
  select: typeof commentSelect;
}>;

// Utility class for storing all the resources that will be needed in the emails.
//
// We need a separate structure for holding these, because the Event model itself doesn't actually
// hold these data as relations; just their ids in the `parameters` Json field.
export class EmailResources {
  projects: Map<ProjectId, ProjectWithRelations>
  donations: Map<DonationId, DonationWithRelations>
  comments: Map<CommentId, CommentWithRelations>

  constructor() {
    this.projects = new Map<ProjectId, ProjectWithRelations>()
    this.donations = new Map<DonationId, DonationWithRelations>()
    this.comments = new Map<CommentId, CommentWithRelations>()
  }
}

// Construct the email body and return the html.
export function createEmail(
  userName: string,
  eventHierarchy: Map<ProjectId, Map<EventType, Event[]>>,
  resources: EmailResources
) {
  var emailContents = `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-image width="100px" src="https://substackcdn.com/image/fetch/w_264,c_limit,f_webp,q_auto:best,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fe7ba5746-d417-4f8d-b679-33b845e5299e_1077x1077.png"></mj-image>
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
        <h1><a href="https://app.impactmarkets.io/project/${projectId}">${project?.title}</a></h1>
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
    const paramsObject = event.parameters as Prisma.JsonObject
    const projectId = paramsObject["projectId"] as ProjectId
    const project = resources.projects.get(projectId)

    return `Project was created by <strong>${project?.author.name}</strong>`
  }
}

function showDonation(resources: EmailResources) {
  return (event: Event) => {
    const paramsObject = event.parameters as Prisma.JsonObject
    const donationId = paramsObject["donationId"] as DonationId
    const donation = resources.donations.get(donationId)

    return `<strong>${donation?.user.name}</strong> donated <strong>${donation?.amount}</strong>`
  }
}

function showComment(resources: EmailResources) {
  return (event: Event) => {
    const paramsObject = event.parameters as Prisma.JsonObject
    const commentId = paramsObject["commentId"] as CommentId
    const comment = resources.comments.get(commentId)

    return `<strong>${comment?.author.name}</strong> added a comment`
  }
}
