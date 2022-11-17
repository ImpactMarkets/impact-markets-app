import * as React from 'react'

import { TAGS } from '@/lib/tags'
import { InferQueryOutput } from '@/lib/trpc'

type TagsProps = {
  queryData:
    | InferQueryOutput<'certificate.detail'>
    | InferQueryOutput<'certificate.feed'>['certificates'][number]
}

export const Tags = ({ queryData }: TagsProps) => (
  <div className="flex flex-wrap">
    {queryData.tags &&
      queryData.tags.split(',').map((tagValue, index) => {
        const tag = TAGS.find((elt) => elt.value === tagValue)
        return (
          tag && (
            <span
              key={index}
              className="border text-highlight border-secondary bg-primary font-bold text-xs px-1 mr-1 mb-1 rounded"
              style={{
                backgroundColor: tag.color,
              }}
            >
              {tag.label}
            </span>
          )
        )
      })}
  </div>
)
