import * as React from 'react'

import { classNames } from '@/lib/classnames'
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
    <>
      {knownTags.map(
        ({ value, label, color }) =>
          tags.includes(value) && (
            <span
              key={value}
              className={classNames(
                'inline-block text-highlight font-bold text-xs px-1 p-[1px] mr-1 rounded',
                color
              )}
            >
              {label}
            </span>
          )
      )}
    </>
  )
}
