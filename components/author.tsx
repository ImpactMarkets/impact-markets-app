import Link from 'next/link'

import { Avatar } from '@/components/avatar'
import type { Author as AuthorType } from '@/lib/types'

type AuthorProps = {
  author: AuthorType
}

export function Author({ author }: AuthorProps) {
  return (
    <div className="relative inline-flex items-center gap-2 w-full">
      <Link href={`/profile/${author.id}`}>
        <a className="relative inline-flex">
          <span className="flex">
            <Avatar name={author.name!} src={author.image} size="sm" />
          </span>
        </a>
      </Link>
      <div className="flex-1 overflow-hidden text-ellipsis font-medium text-sm whitespace-nowrap transition-colors">
        <Link href={`/profile/${author.id}`}>
          <a className="hover:text-blue">{author.name}</a>
        </Link>
      </div>
    </div>
  )
}
