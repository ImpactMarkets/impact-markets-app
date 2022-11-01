import Link from 'next/link'

import { Avatar } from '@/components/avatar'
import type { Author } from '@/lib/types'

import { Date } from './date'

type AuthorWithDateProps = {
  author: Author
  date: Date
  size?: 'sm' | 'md' | 'lg'
}

export function AuthorWithDate({
  author,
  date,
  size = 'sm',
}: AuthorWithDateProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link href={`/profile/${author.id}`}>
        <a className="relative inline-flex">
          <span className="hidden sm:flex">
            <Avatar name={author.name!} src={author.image} size={size} />
          </span>
          <span className="flex sm:hidden">
            <Avatar name={author.name!} src={author.image} size="sm" />
          </span>
        </a>
      </Link>
      <div className="flex-1">
        <div>
          <Link href={`/profile/${author.id}`}>
            <a className="font-medium transition-colors hover:text-blue">
              {author.name}
            </a>
          </Link>
        </div>
        <div className="text-secondary">
          <Date date={date} />
        </div>
      </div>
    </div>
  )
}
