import * as React from 'react'

import { Heading1 } from '@/components/heading-1'

/*
export function OneTwoThree() {
  return <div>Test 1</div>
}
*/
import { Container, SimpleGrid, Text, createStyles } from '@mantine/core'
import {
  IconCoin,
  IconPencilPlus,
  IconTrendingUp,
  TablerIcon,
} from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  feature: {
    position: 'relative',
    paddingTop: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
  },

  overlay: {
    position: 'absolute',
    height: 100,
    width: 180,
    top: 0,
    left: 0,
    backgroundColor: theme.fn.variant({ variant: 'light', color: 'red' })
      .background,
    zIndex: 1,
  },

  content: {
    position: 'relative',
    zIndex: 2,
  },

  icon: {
    color: theme.fn.variant({ variant: 'light', color: 'red' }).color,
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
  },
}))

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: TablerIcon
  title: string
  description: string
}

function Feature({
  icon: Icon,
  title,
  description,
  className,
  ...others
}: FeatureProps) {
  const { classes, cx } = useStyles()

  return (
    <div className={cx(classes.feature, className)} {...others}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon size={38} className={classes.icon} stroke={1.5} />
        <Text weight={700} size="lg" mb="sm" mt={1}>
          {title}
        </Text>
        <Text color="dimmed" size="sm">
          {description}
        </Text>
      </div>
    </div>
  )
}

const mockdata = [
  {
    icon: IconPencilPlus,
    title: 'Creators',
    description:
      'As electricity builds up inside its body, it becomes more aggressive. One theory is that the electricity.',
  },
  {
    icon: IconTrendingUp,
    title: 'Impact Investors',
    description:
      'Slakoth’s heart beats just once a minute. Whatever happens, it is content to loaf around motionless.',
  },
  {
    icon: IconCoin,
    title: 'Philanthropic Funders',
    description:
      'Thought to have gone extinct, Relicanth was given a name that is a variation of the name of the person who discovered.',
  },
]

export function OneTwoThree() {
  const items = mockdata.map((item) => <Feature {...item} key={item.title} />)

  return (
    <div className="max-w-[900px] mx-auto my-5 py-6">
      <Heading1 className="flex justify-center">A market for...</Heading1>
      <Container mt={30} mb={30} size="lg">
        <SimpleGrid
          cols={3}
          breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
          spacing={80}
        >
          {items}
        </SimpleGrid>
      </Container>
    </div>
  )
}
