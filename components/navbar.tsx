import mixpanel from 'mixpanel-browser'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { browserEnv } from '@/env/browser'
import { trpc } from '@/lib/trpc'
import { Navbar as MantineNavbar, Switch, createStyles } from '@mantine/core'
import {
  IconBolt,
  IconBuildingStore,
  IconFile,
  IconHome,
  IconLifebuoy,
  IconTrophy,
} from '@tabler/icons'

import { User } from './user'
import refreshSession from './utils'

mixpanel.init(browserEnv.NEXT_PUBLIC_MIXPANEL_TOKEN, {
  debug: browserEnv.NEXT_PUBLIC_DEBUG,
})

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
  { link: '/', label: 'Projects', icon: IconHome },
  { link: '/ranking', label: 'Top donors', icon: IconTrophy },
  { link: '/funders', label: 'Funders & prizes', icon: IconBuildingStore },
  { link: '/why', label: 'Why impact markets?', icon: IconBolt },
  { link: '/rules', label: 'Rules & terms', icon: IconFile },
  { link: '/support', label: 'Help & support', icon: IconLifebuoy },
]

interface NavbarProps {
  hidden: boolean
}

export function Navbar({ hidden }: NavbarProps) {
  const { data: session } = useSession()
  const { classes, cx } = useStyles()
  const router = useRouter()

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
        onClick={() => {
          try {
            mixpanel.track('Click - ' + item.label, {
              user: session?.user.id,
              datetime: Date(),
            })
          } catch (error) {
            console.log('error: ' + error)
          }
        }}
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
    <MantineNavbar
      classNames={{ root: 'w-[250px] z-[5]' }}
      width={{ sm: 250 }}
      withBorder={false}
      hidden={hidden}
      hiddenBreakpoint="sm"
    >
      <MantineNavbar.Section grow className="m-4">
        {links}
        <div className="mt-4">{preferences}</div>
      </MantineNavbar.Section>
      <MantineNavbar.Section>
        <User />
      </MantineNavbar.Section>
    </MantineNavbar>
  )
}
