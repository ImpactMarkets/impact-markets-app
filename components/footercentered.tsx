import Link, { LinkProps } from 'next/link'
import * as React from 'react'

import { Logo } from '@/components/icons'
import { ActionIcon, Anchor, Group, createStyles } from '@mantine/core'
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

    [theme.fn.smallerThan('sm')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
  },
}))

interface FooterCenteredProps {
  links: { link: string; label: string }[]
}

export function FooterCentered() {
  const { classes } = useStyles()

  // TODO hardcode other links
  const links = [
    { link: '/terms', label: 'Terms' },
    { link: '/link2', label: 'Link2' },
  ]

  const items = links.map((link) => <Link href={link.link}>{link.label}</Link>)

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Logo className="w-[200px]" />

        <Group className={classes.links}>{items}</Group>

        <Group spacing="xs" position="right" noWrap>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" variant="default" radius="xl">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  )
}
