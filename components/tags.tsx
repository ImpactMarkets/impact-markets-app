import * as React from 'react'

import { InferQueryOutput } from '@/lib/trpc'

import { IMTag } from './utils'

type TagsProps = {
  queryData:
    | InferQueryOutput<'certificate.detail'>
    | InferQueryOutput<'certificate.feed'>['certificates'][number]
    | InferQueryOutput<'project.detail'>
    | InferQueryOutput<'project.feed'>['projects'][number]
    | InferQueryOutput<'bounty.detail'>
    | InferQueryOutput<'bounty.feed'>['bounties'][number]
  tags: IMTag[]
}

export const Tags = ({ queryData, tags: knownTags }: TagsProps) => {
  if (!queryData.tags) return null
  const tags = queryData.tags.split(',')
  return (
    <span className="inline-flex flex-wrap gap-1">
      {knownTags.map(
        ({ value, label, color }) =>
          tags.includes(value) && (
            <span
              key={value}
              className="border text-highlight border-secondary bg-primary font-bold text-xs px-1 rounded"
              style={{
                backgroundColor: color,
              }}
            >
              {label}
            </span>
          )
      )}
    </span>
  )
}
