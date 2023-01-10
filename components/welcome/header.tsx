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

  linkLabel: {
    marginRight: 5,
  },
}))

export function Landing_Header() {
  const { classes } = useStyles()
  const [opened, { toggle }] = useDisclosure(false)

  const links = [
    {
      link: '/why',
      label: 'Why impact markets?',
      links: null,
    },
    {
      link: 'https://impactmarkets.substack.com/',
      label: 'Our Blog',
      links: null,
    },
  ]
  const items = links.map((link) => {
    return (
      <div key={link.label} className={classes.link}>
        <Link href={link.link} onClick={(event) => event.preventDefault()}>
          {link.label}
        </Link>
      </div>
    )
  })

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
            <Logo className="w-auto h-[64px] cursor-pointer" />
          </Link>
        </Group>
        <Group spacing={5} className={classes.links}>
          {items}
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
