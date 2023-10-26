import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { AppShell } from '@mantine/core'
import {
  IconBooks,
  IconHome,
  IconLifebuoy,
  IconMessageCircleQuestion,
  IconPigMoney,
  IconRocket,
  IconTrophy,
} from '@tabler/icons-react'

import { User } from './user'

const NavbarLink = ({
  link,
  prefixes,
  label,
  icon: Icon,
}: {
  link: string
  prefixes: string[]
  label: string
  icon: React.ElementType
}) => {
  const router = useRouter()

  return (
    <Link href={link} key={label}>
      <div
        className={clsx(
          'flex',
          'items-center',
          'p-3',
          'text-sm no-underline',
          'cursor-pointer',
          'text-slate-600 fill-slate-600',
          router.pathname === link ||
            prefixes.some((value) => router.pathname.startsWith(value))
            ? 'text-blue-500 fill-blue-500 bg-blue-50'
            : 'hover:bg-slate-100 hover:fill-gray-900 hover:text-gray-900',
        )}
      >
        <Icon className="mr-3" />
        <span>{label}</span>
      </div>
    </Link>
  )
}

export const Navbar = ({
  opened,
  className,
}: {
  opened: boolean
  className?: string
}) => (
  <AppShell.Navbar
    className={clsx('z-[5]', className, opened ? 'flex' : 'hidden')}
    withBorder={false}
    hidden={!opened}
  >
    <div className="hidden md:block m-4">
      <Link href="/">
        <Image
          src="/images/logo-light.svg"
          alt="Impact Markets logo"
          width={180}
          height={76}
          className="cursor-pointer"
          unoptimized
          priority
        />
      </Link>
    </div>
    <div className="mx-4 my-3 flex-grow">
      <NavbarLink link="/" prefixes={[]} label="Home" icon={IconHome} />
      <NavbarLink
        link="/projects"
        prefixes={['/projects', '/project/']}
        label="Projects"
        icon={IconRocket}
      />
      <NavbarLink
        link="/bounties"
        prefixes={['/bounties', '/bounty/']}
        label="Bounties"
        icon={IconPigMoney}
      />
    </div>
    <div className="m-4">
      <NavbarLink
        link="/ranking"
        prefixes={['/ranking']}
        label="Top donors"
        icon={IconTrophy}
      />
      <NavbarLink
        link="/why"
        prefixes={['/why']}
        label="Questions & answers"
        icon={IconMessageCircleQuestion}
      />
      <NavbarLink
        link="/rules"
        prefixes={['/rules']}
        label="Rules & terms"
        icon={IconBooks}
      />
      <NavbarLink
        link="/support"
        prefixes={['/support']}
        label="Help & support"
        icon={IconLifebuoy}
      />
    </div>
    <Image
      src="https://www.facebook.com/tr?id=144902331947551&ev=PageView&noscript=1"
      alt=""
      height={1}
      width={1}
      unoptimized
    />
    <div>
      <User />
    </div>
  </AppShell.Navbar>
)
