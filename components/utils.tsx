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

export type Tag = {
  value: string
  label: string
  color?: string
  category?: string
}

export type TagGroup = {
  group: string
  items: [Tag, ...Tag[]]
}

export const PageLoader = () => (
  <div className="w-full h-full flex justify-center items-center text-slate-300">
    <Loader color="currentColor" className="w-14 h-12 m-16" type="bars" />
  </div>
)

// https://stackoverflow.com/a/77332075/678861
export const notEmpty = <T,>(list: T[]) => {
  if (list.length == 0) throw new TypeError('List must not be empty')
  return list as [T, ...T[]]
}

export const getQuarterDates = (): { startDate: Date; endDate: Date } => {
  const currentDate = new Date()
  const quarter = Math.floor(currentDate.getMonth() / 3)
  const year = currentDate.getFullYear()
  const startDate = new Date(year, quarter * 3, 1)
  const endDate = new Date(year, quarter * 3 + 3, 0)
  return { startDate, endDate }
}
