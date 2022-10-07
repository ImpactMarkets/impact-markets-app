import * as React from 'react'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from '@/components/menu'
import { NavbarSimple } from '@/components/navbar'
import { AppShell } from '@mantine/core'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <AppShell
        navbar={<NavbarSimple />}
        header={<Header />}
        footer={
          <div className="py-20">
            <Footer />
          </div>
        }
      >
        <main>{children}</main>
      </AppShell>
    </>
  )
}
