import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

import { Box } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'

import { Tooltip } from '@/lib/mantine'

import { Avatar } from './avatar'
import { Button } from './button'

export function User() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Box className="flex justify-center gap-1 p-5">
        <Button onClick={() => signIn()} variant="highlight" className="w-full">
          Sign in/up
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Link href={`/profile/${session!.user.id}`}>
        <span className="w-full block p-3 hover:bg-gray-50">
          <div className="flex gap-4 items-center">
            <Avatar
              name={session.user.name}
              src={session.user.image}
              size="sm"
            />
            <Tooltip
              label={
                <p>
                  The first disbursement of Wiki Credits is planned for 2024.
                  <br />
                  They’ll have various functions on the platform.
                </p>
              }
              events={{ hover: true, focus: true, touch: true }}
            >
              <div className="grow">
                <p className="text-sm">{session.user.name}</p>
                <p className="text-xs text-gray-500">0 Wiki Credits</p>
              </div>
            </Tooltip>

            <IconChevronRight size={18} />
          </div>
        </span>
      </Link>
    </Box>
  )
}
