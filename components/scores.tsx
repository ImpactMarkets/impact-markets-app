import * as React from 'react'

import { Prisma } from '@prisma/client'

import { Tooltip } from '@/lib/mantine'
import { num } from '@/lib/text'
import { RouterOutput } from '@/lib/trpc'

type ScoresProps = {
  project:
    | RouterOutput['project']['detail']
    | RouterOutput['project']['feed']['projects'][number]
  showProjectScore?: boolean
}

export const Scores = ({ project, showProjectScore = false }: ScoresProps) => {
  const zero = new Prisma.Decimal(0)
  return (
    <>
      <span className="inline-block cursor-help text-primary bg-emerald-600 font-bold text-xs leading-none px-2 py-1 rounded">
        <Tooltip
          width={400}
          multiline
          label={
            <>
              The support score measures the buy-in from our top donors. The
              higher the donor scores of your donors and the more there are, the
              greater the support score.
            </>
          }
        >
          {project.supportScore ? (
            <span>Support score: {num(project.supportScore.score, 0)}</span>
          ) : (
            <span>No support score yet</span>
          )}
        </Tooltip>
      </span>
      {showProjectScore && (
        <span className="inline-block cursor-help text-primary bg-emerald-700 font-bold text-xs leading-none px-2 py-1 rounded">
          <Tooltip
            width={400}
            multiline
            label={
              <>
                The final score is determined retrospectively by our evaluators.
                The first cohort of projects has yet to reach a state where
                sufficiently many of them can be evaluated, so we’ve not
                performed any serious evaluations yet. Meanwhile please don’t
                take the initial values too seriously.
              </>
            }
          >
            {project.credits > zero ? (
              <span>Final score: {num(project.credits, 0)}</span>
            ) : (
              <span>No final score yet</span>
            )}
          </Tooltip>
        </span>
      )}
    </>
  )
}
