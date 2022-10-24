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
import { Group, Navbar, createStyles } from '@mantine/core'

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
  { link: '', label: 'Funders & prizes', icon: StoreIcon },
  { link: '/why-impact-markets', label: 'Why impact markets?', icon: BoltIcon },
  { link: '', label: 'Rules & terms', icon: FileIcon },
  { link: '', label: 'Help & support', icon: LifebuoyIcon },
]

export function NavbarSimple() {
  const { classes, cx } = useStyles()
  const router = useRouter()

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.link === router.pathname,
      })}
      href={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke="1.5" />
      <span>{item.label}</span>
    </a>
  ))

  return (
    <Navbar width={{ sm: 250 }} p="md" className="pt-12 sticky top-0 z-auto">
      <Navbar.Section grow>
        <Group className="mb-6" position="apart">
          <Link href="/">
            <a>
              <Logo className="w-auto h-[64px]" />
            </a>
          </Link>
        </Group>
        <div className="mt-12">{links}</div>
      </Navbar.Section>
    </Navbar>
  )
}
