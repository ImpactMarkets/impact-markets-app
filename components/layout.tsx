import { useRouter } from 'next/router'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { Header } from '@/components/header'
import { Navbar } from '@/components/navbar'
import { AppShell } from '@mantine/core'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [opened, setOpened] = useState<boolean>(false)
  const router = useRouter()

  const closeMenu = useCallback(() => {
    if (opened) {
      setOpened(false)
    }
  }, [opened, setOpened])

  // Hook to close the menu when a link is clicked
  useEffect(() => {
    router.events.on('routeChangeStart', closeMenu)

    return () => router.events.off('routeChangeStart', closeMenu)
  })

  return (
    <AppShell
      navbar={<Navbar hidden={!opened} />}
      header={<Header opened={opened} setOpened={setOpened} />}
    >
      {children}
    </AppShell>
  )
}
