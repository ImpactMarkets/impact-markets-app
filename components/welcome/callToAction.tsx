import clsx from 'clsx'
import * as React from 'react'

import { Card } from '@mantine/core'

import { buttonClasses } from '@/components/button'
import { ButtonLink } from '@/components/buttonLink'

export const CallToAction = () => (
  <Card
    className={clsx(
      'shadow-lg',
      'border-slate-200 border-solid border-2 rounded-2xl',
      'text-center',
      'p-16 my-16',
    )}
  >
    <div>
      <div className="w-full text-5xl font-display mb-4">
        Join the community!
      </div>
      <div className="w-full text-lg text-center mb-10">
        Play regrantor, raise money, discover funding opportunities
      </div>
      <div>
        <ButtonLink className="mr-2" href="https://discord.gg/7zMNNDSxWv">
          Join the Discord
        </ButtonLink>
        <ButtonLink className="mr-2" href="https://impactmarkets.substack.com/">
          Read the blog
        </ButtonLink>
        <a
          href="https://bit.ly/donor-interests"
          className={buttonClasses({ variant: 'highlight' })}
          target="_blank"
          rel="noreferrer"
        >
          Register your interest
        </a>
      </div>
    </div>
    <div className="m-auto align-center flex justify-center">
      <iframe
        className="max-w-[300px]"
        height="150"
        src="https://impactmarkets.substack.com/embed"
        scrolling="no"
      ></iframe>
    </div>
  </Card>
)
