import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

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
        <div className="flex-1">
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
        </div>
        <div>
          <Link href="/">
            <span>
              <Image
                src="/images/logo-light.svg"
                alt=""
                width={90}
                height={38}
                className="cursor-pointer"
                unoptimized
                priority
              />
            </span>
          </Link>
        </div>
        <div className="flex-1"></div>
      </div>
    </MantineHeader>
  )
}
