import Link from 'next/link'

import { Avatar } from '@/components/avatar'
import type { Author as AuthorType } from '@/lib/types'

type AuthorProps = {
  author: AuthorType
}

export function Author({ author }: AuthorProps) {
  return (
    <div className="relative inline-flex items-center gap-2 w-full">
      <Link href={`/profile/${author.id}`} className="h-[34px]">
        <span className="relative inline-flex">
          <span className="flex">
            <Avatar name={author.name!} src={author.image} size="sm" />
          </span>
        </span>
      </Link>
      <div className="flex-1 overflow-hidden text-ellipsis font-medium text-sm whitespace-nowrap transition-colors">
        <Link href={`/profile/${author.id}`}>
          <span className="link">{author.name}</span>
        </Link>
      </div>
    </div>
  )
}
