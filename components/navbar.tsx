import mixpanel from 'mixpanel-browser'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { browserEnv } from '@/env/browser'
import { Navbar as MantineNavbar, createStyles } from '@mantine/core'
import {
  IconBolt,
  IconFile,
  IconHome,
  IconLifebuoy,
  IconPigMoney,
  IconRocket,
  IconTrophy,
  TablerIcon,
} from '@tabler/icons'

import { User } from './user'

mixpanel.init(browserEnv.NEXT_PUBLIC_MIXPANEL_TOKEN, {
  debug: browserEnv.NEXT_PUBLIC_DEBUG,
})

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon')
  return {
    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colors.gray[0],
        color: theme.black,
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colors.gray[6],
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
      },
    },
  }
})

const NavbarLink = ({
  link,
  label,
  icon: Icon,
}: {
  link: string
  label: string
  icon: TablerIcon
}) => {
  const { data: session } = useSession()
  const { classes, cx } = useStyles()
  const router = useRouter()

  return (
    <Link href={link} key={label}>
      <div
        className={
          cx(classes.link, {
            [classes.linkActive]: link === router.pathname,
          }) + ' flex text-sm items-center cursor-pointer'
        }
        onClick={() => {
          try {
            mixpanel.track('Click - ' + label, {
              user: session?.user.id,
              datetime: Date(),
            })
          } catch (error) {
            console.log('error: ' + error)
          }
        }}
      >
        <Icon className={classes.linkIcon} />
        <span>{label}</span>
      </div>
    </Link>
  )
}

export const Navbar = ({ hidden }: { hidden: boolean }) => (
  <MantineNavbar
    classNames={{ root: 'w-[250px] z-[5]' }}
    width={{ sm: 250 }}
    withBorder={false}
    hidden={hidden}
    hiddenBreakpoint="sm"
  >
    <MantineNavbar.Section className="hidden md:block m-4">
      <Link href="/">
        <Image
          src="/images/logo-light.svg"
          alt="Impact Markets logo"
          width={180}
          height={76}
          className="cursor-pointer"
          unoptimized
        />
      </Link>
    </MantineNavbar.Section>
    <MantineNavbar.Section grow className="mx-4 my-3">
      <NavbarLink link="/" label="Home" icon={IconHome} />
      <NavbarLink link="/projects" label="Projects" icon={IconRocket} />
      <NavbarLink link="/bounties" label="Bounties" icon={IconPigMoney} />
    </MantineNavbar.Section>
    <MantineNavbar.Section className="m-4">
      <NavbarLink link="/ranking" label="Top donors" icon={IconTrophy} />
      <NavbarLink link="/why" label="Questions & answers" icon={IconBolt} />
      <NavbarLink link="/rules" label="Rules & terms" icon={IconFile} />
      <NavbarLink link="/support" label="Help & support" icon={IconLifebuoy} />
    </MantineNavbar.Section>
    <MantineNavbar.Section>
      <User />
    </MantineNavbar.Section>
  </MantineNavbar>
)
