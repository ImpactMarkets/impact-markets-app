import * as React from 'react'

import { num } from '@/lib/text'
import { InferQueryOutput } from '@/lib/trpc'
import { Tooltip } from '@mantine/core'
import { Prisma } from '@prisma/client'

type ScoresProps = {
  project:
    | InferQueryOutput<'project.detail'>
    | InferQueryOutput<'project.feed'>['projects'][number]
}

export const Scores = ({ project }: ScoresProps) => {
  const zero = new Prisma.Decimal(0)
  return (
    <>
      <Tooltip
        multiline
        label={
          <>
            The support score measures the buy-in from our top donors. The
            higher the donor scores of your donors and the more there are, the
            greater the support score.
          </>
        }
      >
        <span className="inline-block cursor-help text-highlight bg-emerald-600 font-bold text-xs px-1 p-[1px] rounded">
          {project.supportScore ? (
            <>Support score: {num(project.supportScore.score, 0)}</>
          ) : (
            <>No support score yet</>
          )}
        </span>
      </Tooltip>
      <Tooltip
        multiline
        label={
          <>
            The project score is determined retrospectively by our evaluators.
            The first cohort of projects has yet to reach a state where
            sufficiently many of them can be evaluated, so we’ve not performed
            any serious evaluations yet. Meanwhile please don’t take the initial
            values too seriously.
          </>
        }
      >
        <span className="inline-block cursor-help text-highlight bg-emerald-700 font-bold text-xs px-1 p-[1px] rounded">
          {project.credits > zero ? (
            <>Project score: {num(project.credits, 0)}</>
          ) : (
            <>No project score yet</>
          )}
        </span>
      </Tooltip>
    </>
  )
}
