import { signIn } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

import { Button } from '@/components/button'
import { Logo } from '@/components/icons'
import {
  Burger,
  Container,
  Group,
  Header,
  Menu,
  createStyles,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

const HEADER_HEIGHT = 60

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}))

export function LandingHeader() {
  const { classes } = useStyles()
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }} mb={90}>
      <Container className={classes.inner} fluid>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <Link href="/">
            <span>
              <Logo className="w-auto h-[64px] cursor-pointer" />
            </span>
          </Link>
          <div
            key="Why impact markets?"
            className="px-3 py-3 text-gray-700 text-sm"
          >
            <Link href="/why" onClick={(event) => event.preventDefault()}>
              Why impact markets?
            </Link>
          </div>
          <div key="Our blog" className="px-3 py-3 text-gray-700 text-sm">
            <Link
              href="https://impactmarkets.substack.com/"
              onClick={(event) => event.preventDefault()}
            >
              Our blog
            </Link>
          </div>
          <div
            key="Why impact markets?"
            className="px-3 py-3 text-gray-700 text-sm"
          >
            <Link href="/why" onClick={(event) => event.preventDefault()}>
              Why impact markets?
            </Link>
          </div>
          <div key="Our blog" className="px-3 py-3 text-gray-700 text-sm">
            <Link
              href="https://impactmarkets.substack.com/"
              onClick={(event) => event.preventDefault()}
            >
              Our blog
            </Link>
          </div>
        </Group>
        <Group spacing={5} className="hidden sm:flex">
          <div
            key="Why impact markets?"
            className="px-3 py-3 text-gray-700 text-sm"
          >
            <Link href="/why" onClick={(event) => event.preventDefault()}>
              Why impact markets?
            </Link>
          </div>
          <div key="Our blog" className="px-3 py-3 text-gray-700 text-sm">
            <Link
              href="https://impactmarkets.substack.com/"
              onClick={(event) => event.preventDefault()}
            >
              Our blog
            </Link>
          </div>
          <Menu>
            <div className="inline-flex gap-1 ml-4">
              <Button onClick={() => signIn()} variant="secondary">
                Sign up
              </Button>
            </div>
          </Menu>
        </Group>
      </Container>
    </Header>
  )
}
