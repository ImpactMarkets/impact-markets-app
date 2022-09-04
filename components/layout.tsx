import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import * as React from 'react'

import { Avatar } from '@/components/avatar'
import { ButtonLink } from '@/components/button-link'
import { Footer } from '@/components/footer'
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
import { capitalize } from '@/lib/text'

import { Label } from './label'
import { NavbarSimple } from './navbar'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()
  const { theme, themes, setTheme } = useTheme()
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)

  return (
    <div className="flex relative max-w-7xl m-auto">
      <NavbarSimple></NavbarSimple>
      <div className="px-6 w-full mx-auto">
        <header className="flex max-w-4xl items-center justify-end mt-6 pt-4 gap-4 h-16">
          <div className="flex items-center gap-2 md:gap-4">
            <IconButton
              variant="secondary"
              onClick={() => {
                setIsSearchDialogOpen(true)
              }}
            >
              <SearchIcon className="w-4 h-4" />
            </IconButton>

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
                <div className="flex items-center gap-4 px-4 py-3 rounded-b bg-secondary">
                  <Label htmlFor="theme" className="text-sm">
                    Theme
                  </Label>
                  <select
                    id="theme"
                    name="theme"
                    value={theme}
                    onChange={(event) => {
                      setTheme(event.target.value)
                    }}
                    className="block w-full py-1.5 text-xs border rounded shadow-sm bg-primary border-secondary"
                  >
                    {themes.map((theme) => (
                      <option key={theme} value={theme}>
                        {capitalize(theme)}
                      </option>
                    ))}
                  </select>
                </div>
              </MenuItems>
            </Menu>

            <ButtonLink href="/new">
              <span className="sm:hidden">New</span>
              <span className="hidden sm:block shrink-0">New certificate</span>
            </ButtonLink>
          </div>
        </header>

        <main>{children}</main>

        <div className="py-20">
          <Footer />
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
