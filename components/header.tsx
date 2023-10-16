import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { AppShell, Burger } from '@mantine/core'

interface HeaderProps {
  opened?: boolean
  className?: string
  toggle: () => void
}

export const Header = ({
  opened = false,
  className = '',
  toggle,
}: HeaderProps) => {
  // base/md thresholds are different between Mantine and Tailwind, so we make do with a bit of
  // space at the top at some screen sizes
  return (
    <AppShell.Header className={clsx('z-[5]', className)} withBorder={false}>
      <div className="flex justify-between items-center h-full px-5">
        <div className="flex-1">
          <Burger opened={opened} onClick={toggle} size="sm" mr="xl" />
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
    </AppShell.Header>
  )
}
