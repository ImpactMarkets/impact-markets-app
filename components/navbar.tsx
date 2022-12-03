import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Logo } from '@/components/icons'
import {
  BoltIcon,
  FileIcon,
  HomeIcon,
  LifebuoyIcon,
  StoreIcon,
} from '@/components/icons'
import { trpc } from '@/lib/trpc'
import { Group, Navbar, Switch, createStyles } from '@mantine/core'

import refreshSession from './utils'

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon')
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  }
})

const data = [
  { link: '/', label: 'Home', icon: HomeIcon },
  { link: '/page/funders', label: 'Funders & prizes', icon: StoreIcon },
  { link: '/page/why', label: 'Why impact markets?', icon: BoltIcon },
  { link: '/page/rules', label: 'Rules & terms', icon: FileIcon },
  { link: '/page/support', label: 'Help & support', icon: LifebuoyIcon },
]

export function NavbarSimple() {
  const { classes, cx } = useStyles()
  const router = useRouter()
  const { data: session } = useSession()

  const preferencesMutation = trpc.useMutation(['user.preferences'], {
    onSuccess: refreshSession,
  })

  const links = data.map((item) => (
    <Link href={item.link} key={item.label}>
      <div
        className={
          cx(classes.link, {
            [classes.linkActive]: item.link === router.pathname,
          }) + ' flex text-sm items-center cursor-pointer'
        }
      >
        <item.icon className={classes.linkIcon} />
        <span>{item.label}</span>
      </div>
    </Link>
  ))

  let preferences = null
  if (session) {
    preferences = (
      <Switch
        label="Detail view"
        classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
        checked={session.user.prefersDetailView}
        onChange={(event) => {
          preferencesMutation.mutate({
            prefersDetailView: event.target.checked,
          })
        }}
      />
    )
  }

  return (
    <Navbar width={{ sm: 250 }} p="md" className="pt-12 sticky top-0 z-auto">
      <Navbar.Section grow>
        <Group className="mb-6" position="apart">
          <Link href="/">
            <span>
              <Logo className="w-auto h-[64px] cursor-pointer" />
            </span>
          </Link>
        </Group>
        <div className="mt-12">{links}</div>
        <div className="mt-12">{preferences}</div>
      </Navbar.Section>
    </Navbar>
  )
}
