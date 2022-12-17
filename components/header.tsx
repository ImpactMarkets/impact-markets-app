import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

import { ButtonLink } from '@/components/button-link'
import { IconButton } from '@/components/icon-button'
import { Logo, SearchIcon } from '@/components/icons'
import { SearchDialog } from '@/components/search-dialog'
import { Burger, Header as MantineHeader, MediaQuery } from '@mantine/core'

import { Button } from './button'

interface HeaderProps {
  opened: boolean
  setOpened: (f: (opened: boolean) => boolean) => void
}

export function Header({ opened, setOpened }: HeaderProps) {
  const { data: session } = useSession()
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false)

  return (
    <MantineHeader
      // TODO: Find why {{base: 50, md: 100}} does not work
      height={100}
      withBorder={false}
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

          {session ? (
            <ButtonLink href="/new" variant="highlight">
              <span className="sm:hidden">New</span>
              <span className="hidden sm:block shrink-0">New project</span>
            </ButtonLink>
          ) : (
            <>
              <Button
                onClick={() => signIn()}
                variant="secondary"
                className="hidden md:block"
              >
                Log in
              </Button>
              <Button
                onClick={() => signIn()}
                variant="highlight"
                className="hidden md:block"
              >
                Sign up
              </Button>
            </>
          )}
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
