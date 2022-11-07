import * as React from 'react'
import { useState } from 'react'

import { AppFooter } from '@/components/footer'
import { Header as AppHeader } from '@/components/header'
import { AppNavbar } from '@/components/navbar'
import { AppShell } from '@mantine/core'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [opened, setOpened] = useState<boolean>(false)

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
