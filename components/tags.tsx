import * as React from 'react'

import { classNames } from '@/lib/classnames'
import { RouterOutput } from '@/lib/trpc'

import { IMTag } from './utils'

type TagsProps = {
  queryData:
    | RouterOutput['certificate']['detail']
    | RouterOutput['certificate']['feed']['certificates'][number]
    | RouterOutput['project']['detail']
    | RouterOutput['project']['feed']['projects'][number]
    | RouterOutput['bounty']['detail']
    | RouterOutput['bounty']['feed']['bounties'][number]
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
                'inline-block text-primary font-bold text-xs leading-none px-2 py-1 rounded',
                color,
              )}
            >
              {label}
            </span>
          ),
      )}
    </>
  )
}
