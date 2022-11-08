import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

import { Box } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons'

import { Avatar } from './avatar'

export function User() {
  const { data: session } = useSession()

  return (
    <Box className="border-t">
      <Link href={`/profile/${session!.user.id}`}>
        <a className="w-full block p-2 hover:bg-gray-50">
          <div className="flex gap-4 items-center">
            <Avatar
              name={session!.user.name}
              src={session!.user.image}
              size="sm"
            />
            <div className="grow">
              <p className="text-sm">{session?.user.name}</p>
              <p className="text-xs color text-gray-500">
                {session?.user.email}
              </p>
            </div>

            <IconChevronRight size={18} />
          </div>
        </a>
      </Link>
    </Box>
  )
}
