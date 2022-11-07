import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

import { Avatar } from '@/components/avatar'
import { ButtonLink } from '@/components/button-link'
import { IconButton } from '@/components/icon-button'
import { Logo, SearchIcon } from '@/components/icons'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { SearchDialog } from '@/components/search-dialog'
import { Burger, Header as MantineHeader, MediaQuery } from '@mantine/core'

interface HeaderProps {
  opened: boolean
  setOpened: (f: (opened: boolean) => boolean) => void
}

export function Header({ opened, setOpened }: HeaderProps) {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)
  const { data: session } = useSession()

  return (
    <MantineHeader
      // TODO: Find why {{base: 50, md: 100}} does not work
      height={100}
    >
      <div className="flex justify-between items-center h-full px-5">
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>
        <div>
          <Link href="/">
            <a>
              <Logo className="w-auto h-[48px] md:h-[64px]" />
            </a>
          </Link>
        </div>
        <div className="flex items-center gap-x-3">
          <IconButton
            variant="secondary"
            onClick={() => {
              setIsSearchDialogOpen(true)
            }}
          >
            <SearchIcon className="w-4 h-4" />
          </IconButton>

          <Menu>
            <MenuButton className="relative inline-flex rounded-full focus-ring">
              <Avatar
                name={session!.user.name}
                src={session!.user.image}
                size="sm"
              />
            </MenuButton>

            <MenuItems className="w-48">
              <MenuItemsContent>
                <MenuItemLink href={`/profile/${session!.user.id}`}>
                  Profile
                </MenuItemLink>
                <MenuItemButton onClick={() => signOut()}>
                  Log out
                </MenuItemButton>
              </MenuItemsContent>
            </MenuItems>
          </Menu>

          <ButtonLink href="/new" variant="highlight">
            <span className="sm:hidden">New</span>
            <span className="hidden sm:block shrink-0">New certificate</span>
          </ButtonLink>
        </div>
      </div>
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => {
          setIsSearchDialogOpen(false)
        }}
      />
    </MantineHeader>
  )
}
