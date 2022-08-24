import type { Author as AuthorType } from '@/lib/types'

import { Author } from './author'
import { Date } from './date'

type AuthorWithDateProps = {
  author: AuthorType
  date: Date
}

export function AuthorWithDate({ author, date }: AuthorWithDateProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Author author={author} />
      <p className="text-secondary">
        <Date date={date} />
      </p>
    </div>
  )
}
