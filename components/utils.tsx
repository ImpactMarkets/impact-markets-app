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

export type IMTag = {
  value: string
  label: string
  color: string
  group: string
}

export const PageLoader = () => (
  <div className="w-full h-full flex justify-center items-center">
    <Loader
      className="w-16 m-12 fill-slate-300"
      style={{ width: '' }}
      variant="bars"
    />
  </div>
)
