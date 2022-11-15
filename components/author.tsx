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
          <span className="flex">
            <Avatar name={author.name!} src={author.image} size="sm" />
          </span>
        </a>
      </Link>
      <div className="flex-1">
        <div>
          <Link href={`/profile/${author.id}`}>
            <a className="font-medium text-sm transition-colors hover:text-blue">
              {author.name}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}
