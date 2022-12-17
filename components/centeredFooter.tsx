import Link from 'next/link'
import * as React from 'react'

import { ActionIcon, Group, createStyles } from '@mantine/core'
import { IconBrandYoutube } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 20,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: 20,
    fontSize: theme.fontSizes.sm,
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

export function CenteredFooter() {
  const { classes } = useStyles()

  const links = [
    { label: 'Terms', link: '/terms' },
    { label: 'Blog', link: 'https://impactmarkets.substack.com/' },
    { label: 'Discord', link: 'https://discord.gg/7zMNNDSxWv' },
  ]

  const items = links.map((link) => (
    <Link key={link.link} href={link.link}>
      {link.label}
    </Link>
  ))

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        Good Exchange, PBC
        <Group className={classes.links}>{items}</Group>
        <Group spacing="xs" position="right" noWrap>
          <Link href="https://www.youtube.com/watch?v=NTIAdn0Oms8">
            <ActionIcon size="md" variant="default" radius="xl">
              <IconBrandYoutube size={16} stroke={1.5} />
            </ActionIcon>
          </Link>
        </Group>
      </div>
    </div>
  )
}
