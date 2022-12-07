import * as React from 'react'

import { Heading1 } from '@/components/heading-1'

/*
export function OneTwoThree() {
  return <div>Test 1</div>
}
*/
import { Container, SimpleGrid, Text, createStyles } from '@mantine/core'
import {
  IconHeart,
  IconShovel,
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
    backgroundColor: theme.fn.variant({ variant: 'light', color: 'gray' })
      .background,
    zIndex: 1,
  },

  content: {
    position: 'relative',
    zIndex: 2,
  },

  icon: {
    color: theme.fn.variant({ variant: 'light', color: 'blue' }).color,
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
    icon: IconShovel,
    title: 'Creators',
    description:
      'Fund your altruistic work by selling impact shares. Impact investors will fund your project if they think it will win future prizes.',
  },
  {
    icon: IconTrendingUp,
    title: 'Impact Investors',
    description:
      "Invest in altruistic projects the same way you'd invest in startups. Profit when you pick projects that win prizes.",
  },
  {
    icon: IconHeart,
    title: 'Philanthropic Funders',
    description:
      'Create prizes to incentivize impact. Only pay out after the impact is achieved. Outsource evaluation to impact investors.',
  },
]

export function OneTwoThree() {
  const items = mockdata.map((item) => <Feature {...item} key={item.title} />)

  return (
    <div className="max-w-[900px] mx-auto my-5 py-6">
      <div className="flex justify-center text-3xl font-bold">
        A market for...
      </div>
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
