import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { Header } from '@/components/header'
import { Navbar } from '@/components/navbar'

type LayoutProps = {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const [opened, { toggle, close }] = useDisclosure()

  // Hook to close the menu when a link is clicked
  React.useEffect(() => {
    router.events.on('routeChangeStart', close)
    return () => router.events.off('routeChangeStart', close)
  })

  return (
    <AppShell
      classNames={{ main: 'overflow-x-auto pt-[50px] md:pt-6 md:pl-[250px]' }}
      padding="md"
    >
      <Head>
        <link rel="canonical" href={`https://givewiki.org${router.asPath}`} />
      </Head>
      <Header
        className="md:hidden h-[50px] max-h-[50px]"
        opened={opened}
        toggle={toggle}
      />
      <Navbar className="md:flex md:mt-0 mt-[50px] w-[250px]" opened={opened} />
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
