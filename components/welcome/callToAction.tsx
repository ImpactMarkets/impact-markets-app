import * as React from 'react'

import { Card } from '@mantine/core'

import { buttonClasses } from '@/components/button'
import { ButtonLink } from '@/components/buttonLink'

export const CallToAction = () => (
  <Card
    shadow="lg"
    p="lg"
    radius="md"
    withBorder
    className="m-auto border-2 rounded-2xl text-center p-16 mt-32 mb-12"
  >
    <div>
      <div className="text-5xl font-display mb-4">Join the community!</div>
      <div className="text-lg prose">
        Play regrantor, raise money, discover funding opportunities
      </div>
      <div className="mt-6">
        <ButtonLink className="mr-2" href="https://discord.gg/7zMNNDSxWv">
          Join the Discord
        </ButtonLink>
        <ButtonLink className="mr-2" href="https://impactmarkets.substack.com/">
          Read the blog
        </ButtonLink>
        <a
          href="https://airtable.com/shr1eRlbcr43os6SX"
          className={buttonClasses({ variant: 'highlight' })}
          target="_blank"
          rel="noreferrer"
        >
          Register your interest
        </a>
      </div>
    </div>
  </Card>
)
