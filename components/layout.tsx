import { useRouter } from 'next/router'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { AppFooter } from '@/components/footer'
import { Header as AppHeader } from '@/components/header'
import { AppNavbar } from '@/components/navbar'
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

  // Hook to close the menu when a link is cliked
  useEffect(() => {
    router.events.on('routeChangeStart', closeMenu)

    return () => router.events.off('routeChangeStart', closeMenu)
  })

  return (
    <>
      <AppShell
        navbar={<AppNavbar hidden={!opened} />}
        header={<AppHeader opened={opened} setOpened={setOpened} />}
        footer={<AppFooter />}
      >
        {children}
      </AppShell>
    </>
  )
}
