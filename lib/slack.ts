import { marked } from 'marked'

import { serverEnv } from '@/env/server'
import { markdownToBlocks } from '@instantish/mack'
import type { Certificate } from '@prisma/client'

export async function postToSlackIfEnabled({
  certificate,
  authorName,
}: {
  certificate: Certificate
  authorName: string
}) {
  if (serverEnv.ENABLE_SLACK_POSTING && serverEnv.SLACK_WEBHOOK_URL) {
    const tokens = marked.lexer(certificate.content)
    const summaryToken = tokens.find((token) => {
      return (
        token.type === 'paragraph' ||
        token.type === 'html' ||
        token.type === 'image'
      )
    })
    const summaryBlocks = summaryToken
      ? await markdownToBlocks(summaryToken.raw)
      : []
    return fetch(serverEnv.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*<${serverEnv.NEXT_APP_URL}/certificate/${certificate.id}|${certificate.title}>*`,
            },
          },
          summaryBlocks[0],
          { type: 'divider' },
          {
            type: 'context',
            elements: [
              {
                type: 'plain_text',
                text: authorName,
                emoji: true,
              },
            ],
          },
        ],
      }),
    })
  }
}
