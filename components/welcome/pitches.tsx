import * as React from 'react'

import { Container, SimpleGrid, Text } from '@mantine/core'
import {
  IconShovel,
  IconTelescope,
  IconTrendingUp,
  TablerIcon,
} from '@tabler/icons'

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: TablerIcon
  title: string
  children: React.ReactNode
}

const Feature = ({ icon: Icon, title, children }: FeatureProps) => (
  <div className="pt-6">
    <div>
      <div className="h-22 p-3 -ml-3 mb-3 w-[calc(100%+2rem)] bg-gray-100">
        <Icon size={38} className="stroke-blue-500 stroke-[1.5]" />
        <Text className="font-bold text-md whitespace-nowrap">{title}</Text>
      </div>
      <Text color="dimmed" size="sm" className="[hyphens:auto]">
        {children}
      </Text>
    </div>
  </div>
)

export const Pitches = () => (
  <div className="max-w-[900px] mx-auto my-5 py-6">
    <div className="flex justify-center text-3xl font-bold">A market for …</div>
    <Container mt={30} mb={30} size="lg">
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        spacing={40}
      >
        <Feature icon={IconShovel} title="Projects" key="projects">
          We score donors by their track record of finding new high-impact
          projects such as yours. A good donation track record signal-boosts the
          projects that they support. You’ll be discovered by more donors, which
          can snowball into greater and greater success.
        </Feature>
        <Feature icon={IconTelescope} title="Project scouts" key="Scouts">
          Scout out and signal-boost the best projects! You get a “donor score”
          based on your track record, and the higher your score, the greater
          your boost to the projects you support. You will leverage your
          expertise for follow-on donations, getting the projects funded faster.
        </Feature>
        <Feature
          icon={IconTrendingUp}
          title="Donors & funders"
          key="Donors & funders"
        >
          Scouts find speculative, potentially spectacular projects! We make
          their diverse, specialized knowledge accessible to you. Follow our top
          scouts, tap into their wisdom, and boost the impact of your donations
          or grants.
        </Feature>
      </SimpleGrid>
    </Container>
  </div>
)
