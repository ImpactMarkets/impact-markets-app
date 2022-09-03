import Link from 'next/link'

import { Avatar } from '@/components/avatar'
import type { Author as AuthorType } from '@/lib/types'

type AuthorProps = {
  author: AuthorType
}

export function Author({ author }: AuthorProps) {
  return (
    <div className="relative inline-flex items-center gap-2">
      <Link href={`/profile/${author.id}`}>
        <a className="relative inline-flex">
          <span className="hidden sm:flex">
            <Avatar name={author.name!} src={author.image} />
          </span>
          <span className="flex sm:hidden">
            <Avatar name={author.name!} src={author.image} size="sm" />
          </span>
        </a>
      </Link>
      <div className="flex-1 text-sm sm:text-base">
        <div>
          <Link href={`/profile/${author.id}`}>
            <a className="font-medium transition-colors hover:text-blue">
              {author.name}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}