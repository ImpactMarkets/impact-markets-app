import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

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

  useEffect(() => {
    if (router?.asPath.indexOf('?') > -1) {
      toast.success(<span>Success! Thank you!</span>, {
        id: 'generic-confirmation',
      })
    }
  })

  // Hook to close the menu when a link is clicked
  useEffect(() => {
    router.events.on('routeChangeStart', close)
    return () => router.events.off('routeChangeStart', close)
  })

  return (
    <AppShell
      classNames={{ main: 'overflow-x-auto pt-[50px] md:pt-6 md:pl-[250px]' }}
      padding="md"
    >
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
