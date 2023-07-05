import * as htmlToText from 'html-to-text'
import { groupBy, sortBy } from 'lodash'
import Markdown from 'markdown-to-jsx'
import mjml2html from 'mjml'
import { createTransport } from 'nodemailer'
import { z } from 'zod'

import {
  Mjml,
  MjmlBody,
  MjmlColumn,
  MjmlDivider,
  MjmlImage,
  MjmlSection,
  MjmlText,
} from '@faire/mjml-react'
import { renderToMjml } from '@faire/mjml-react/utils/renderToMjml'
import { EventStatus, EventType } from '@prisma/client'

export const Event = z.object({
  id: z.number(),
  time: z.date(),
  // z.enum needs at least one value, but our enums have > 1 value
  type: z.enum(Object.keys(EventType) as [EventType, ...EventType[]]),
  status: z.enum(Object.keys(EventStatus) as [EventStatus, ...EventStatus[]]),
  recipient: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    prefersEventNotifications: z.boolean(),
    prefersProjectNotifications: z.boolean(),
    prefersBountyNotifications: z.boolean(),
  }),
  parameters: z.object({
    objectId: z.string(),
    objectType: z.enum(['project', 'bounty']),
    objectTitle: z.string(),
    text: z.string(),
  }),
})

export type Event = z.infer<typeof Event>

// Construct the email body and return the html.
export const createEmail = (
  recipient: {
    id: string
    name: string
  },
  events: Event[]
) => {
  // CUIDs are virtually never duplicated between tables
  const eventsByProject = groupBy(
    sortBy(events, 'type'),
    (event) => event.parameters.objectId
  )
  const emailContents = (
    <Mjml>
      <MjmlBody>
        <MjmlSection>
          <MjmlColumn>
            <MjmlImage
              width="200px"
              src="https://app.impactmarkets.io/static/images/logo-light.png"
            ></MjmlImage>
            <MjmlText>
              <p>Hello {recipient.name},</p>
              <p>
                Here is your summary of the recent activity on your projects and
                bounties.
              </p>
            </MjmlText>
            <MjmlDivider border-color="#EE0000"></MjmlDivider>
            {Object.values(eventsByProject).map(renderSection)}
            <MjmlText>
              <p>
                You can change your notification preferences on your{' '}
                <a
                  href={`https://app.impactmarkets.io/profile/${recipient.id}`}
                >
                  Impact Markets profile
                </a>
                .
              </p>
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  )
  return mjml2html(renderToMjml(emailContents)).html
}

const renderSection = (events: Event[]) => {
  // All events in this array have the same object ID, type, and title
  const objectId = events[0].parameters.objectId
  const objectType = events[0].parameters.objectType
  const objectTitle = events[0].parameters.objectTitle
  return (
    <>
      <MjmlText>
        <h2>
          Project “
          <a href={`https://app.impactmarkets.io/${objectType}/${objectId}`}>
            {objectTitle}
          </a>
          ”
        </h2>
        {events.map((event) => (
          <p key={event.id}>
            <Markdown>{event.parameters.text}</Markdown>
          </p>
        ))}
      </MjmlText>
      <MjmlDivider border-color="#EE0000"></MjmlDivider>
    </>
  )
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
    (process.env.NODE_ENV === 'production' && process.env.EMAIL_ANYONE) ||
    recipientAddress.endsWith('@impactmarkets.io') ||
    recipientAddress === 'telofy@gmail.com'
  ) {
    console.log(`Sending email to ${recipientAddress}`)
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipientAddress,
      subject: 'Recent activity on your projects and bounties',
      text: htmlToText.convert(emailHtml, { wordwrap: 130 }),
      html: emailHtml,
    })
  }
}
