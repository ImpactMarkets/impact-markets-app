import * as React from 'react'

import { TAGS } from '@/lib/tags'
import { InferQueryOutput } from '@/lib/trpc'

type TagsProps = {
  queryData:
    | InferQueryOutput<'certificate.detail'>
    | InferQueryOutput<'certificate.feed'>['certificates'][number]
}

export const Tags = ({ queryData }: TagsProps) => {
  if (!queryData.tags) return null
  const tags = queryData.tags.split(',')
  return (
    <div className="flex flex-wrap">
      {TAGS.map(
        ({ value, label, color }) =>
          tags.includes(value) && (
            <span
              key={value}
              className="border text-highlight border-secondary bg-primary font-bold text-xs px-1 mr-1 mb-1 rounded"
              style={{
                backgroundColor: color,
              }}
            >
              {label}
            </span>
          )
      )}
    </div>
  )
}
