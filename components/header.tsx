import Link from 'next/link'
import * as React from 'react'

import { Logo } from '@/components/icons'
import { Burger, Header as MantineHeader, MediaQuery } from '@mantine/core'

interface HeaderProps {
  opened?: boolean
  showMenu?: boolean
  setOpened?: (f: (opened: boolean) => boolean) => void
}

export const Header = ({
  opened = false,
  showMenu = false,
  setOpened,
}: HeaderProps) => {
  // base/md thresholds are different between Mantine and Tailwind, so we make do with a bit of
  // space at the top at some screen sizes
  return (
    <MantineHeader
      classNames={{
        root: 'md:hidden h-[50px] max-h-[50px] z-[5]',
      }}
      withBorder={false}
      height={{ base: 50, sm: 0 }}
    >
      <div className="flex justify-between items-center h-full px-5">
        {showMenu && (
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened!((o) => !o)}
              size="sm"
              mr="xl"
            />
          </MediaQuery>
        )}
        <div>
          <Link href="/">
            <span>
              <Logo className="w-auto h-[32px] cursor-pointer" />
            </span>
          </Link>
        </div>
        <div></div>
      </div>
    </MantineHeader>
  )
}
