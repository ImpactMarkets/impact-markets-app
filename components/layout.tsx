import * as React from 'react'

import { AppFooter } from '@/components/footer'
import { Header as AppHeader } from '@/components/header'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { AppNavbar } from '@/components/navbar'
import { AppShell } from '@mantine/core'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <AppShell
        navbar={<AppNavbar />}
        header={<AppHeader />}
        footer={<AppFooter />}
      >
        {children}
      </AppShell>
    </>
  )
}
