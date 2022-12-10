import { signIn, signOut, useSession } from 'next-auth/react'
import * as React from 'react'

import { Avatar } from '@/components/avatar'
import { ButtonLink } from '@/components/button-link'
import { CenteredFooter } from '@/components/centeredFooter'
import { HeroText } from '@/components/hero-text'
import { IconButton } from '@/components/icon-button'
import { SearchIcon } from '@/components/icons'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { SearchDialog } from '@/components/search-dialog'

import { Button } from './button'
import { NavbarSimple } from './navbar'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)

  return (
    <div className="flex relative max-w-7xl m-auto">
      <NavbarSimple></NavbarSimple>
      <div className="px-6 w-full mx-auto flex flex-col min-h-screen">
        <header className="flex items-center justify-end mt-6 mb-6 pt-4 gap-4 h-16">
          <div className="flex items-center gap-2 md:gap-4">
            <IconButton
              variant="secondary"
              onClick={() => {
                setIsSearchDialogOpen(true)
              }}
            >
              <SearchIcon className="w-4 h-4" />
            </IconButton>

            {session ? (
              <>
                <Menu>
                  <MenuButton className="relative inline-flex rounded-full group focus-ring">
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
                  <span className="hidden sm:block shrink-0">New project</span>
                </ButtonLink>
              </>
            ) : (
              <Menu>
                <div className="inline-flex gap-1">
                  <Button onClick={() => signIn()} variant="secondary">
                    Log in
                  </Button>
                  <Button onClick={() => signIn()} variant="highlight">
                    Sign up
                  </Button>
                </div>
              </Menu>
            )}
          </div>
        </header>

        <main>{children}</main>

        <div className="py-5 mt-auto">
          <CenteredFooter />
        </div>

        <SearchDialog
          isOpen={isSearchDialogOpen}
          onClose={() => {
            setIsSearchDialogOpen(false)
          }}
        />
      </div>
    </div>
  )
}
