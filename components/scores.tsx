import * as React from 'react'

import { num } from '@/lib/text'
import { RouterOutput } from '@/lib/trpc'
import { Tooltip } from '@mantine/core'
import { Prisma } from '@prisma/client'

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
        <span className="inline-block cursor-help text-highlight bg-emerald-600 font-bold text-xs leading-none px-2 py-1 rounded">
          {project.supportScore ? (
            <>Support score: {num(project.supportScore.score, 0)}</>
          ) : (
            <>No support score yet</>
          )}
        </span>
      </Tooltip>
      {showProjectScore && (
        <Tooltip
          width={400}
          multiline
          label={
            <>
              The final score is determined retrospectively by our evaluators.
              The first cohort of projects has yet to reach a state where
              sufficiently many of them can be evaluated, so we’ve not performed
              any serious evaluations yet. Meanwhile please don’t take the
              initial values too seriously.
            </>
          }
        >
          <span className="inline-block cursor-help text-highlight bg-emerald-700 font-bold text-xs leading-none px-2 py-1 rounded">
            {project.credits > zero ? (
              <>Final score: {num(project.credits, 0)}</>
            ) : (
              <>No final score yet</>
            )}
          </span>
        </Tooltip>
      )}
    </>
  )
}
