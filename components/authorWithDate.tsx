import Link from 'next/link'

import { Avatar } from '@/components/avatar'
import type { Author } from '@/lib/types'

import { Date } from './date'

type AuthorWithDateProps = {
  author: Author
  date: Date
  dateLabel?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AuthorWithDate({
  author,
  date,
  dateLabel = undefined,
  size = undefined,
}: AuthorWithDateProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link href={`/profile/${author.id}`}>
        <span className="relative inline-flex">
          <span className="hidden sm:flex">
            <Avatar name={author.name!} src={author.image} size={size} />
          </span>
          <span className="flex sm:hidden">
            <Avatar name={author.name!} src={author.image} size="sm" />
          </span>
        </span>
      </Link>
      <div className="flex-1">
        <div>
          <Link href={`/profile/${author.id}`}>
            <span className="font-medium transition-colors hover:text-blue">
              {author.name}
            </span>
          </Link>
        </div>
        <div className="text-gray-500 text-sm">
          {dateLabel} <Date date={date} />
        </div>
      </div>
    </div>
  )
}
