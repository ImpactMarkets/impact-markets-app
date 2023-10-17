import { sortBy } from 'lodash/fp'

import { Loader } from '@mantine/core'

import { Author } from '@/lib/types'

export function refreshSession() {
  const event = new Event('visibilitychange')
  document.dispatchEvent(event)
}

export type CommentFormData = {
  content: string
}

type SortAuthorFirst = (array: Author[]) => Author[]
export const sortAuthorFirst: (author: Author) => SortAuthorFirst = (author) =>
  sortBy((user) => [user.id !== author.id, user.name])

export type IMTag =
  | {
      value: string
      label: string
      color?: string
      group?: string
    }
  | {
      group: string
      items: [{ value: string; label: string; color?: string }]
    }

export const PageLoader = () => (
  <div className="w-full h-full flex justify-center items-center text-slate-300">
    <Loader color="currentColor" className="w-14 h-12 m-16" type="bars" />
  </div>
)
