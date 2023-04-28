import * as React from 'react'

import { Container, SimpleGrid, Text } from '@mantine/core'
import {
  IconHeart,
  IconSearch,
  IconShovel,
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
        cols={4}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        spacing={40}
      >
        <Feature icon={IconShovel} title="Creators" key="projects">
          We score donors by their track record of finding new high-impact
          projects such as yours. A good donation track record signal-boosts the
          projects that they support. You’ll be discovered by more donors, which
          can snowball into greater and greater success.
        </Feature>
        <Feature
          icon={IconSearch}
          title="Specialist donors"
          key="specialist donors"
        >
          Signal-boost the best projects! You get a “donor score” based on your
          track record of impact, and the higher your score, the greater your
          boost to the projects you support. This lets you leverage your
          expertise for follow-on donations, getting the project funded faster.
        </Feature>
        <Feature icon={IconTrendingUp} title="All donors" key="all donors">
          Follow donors who have skin in the game! Impact Markets is a
          crowd-sourced charity evaluator for all the small, speculative,
          potentially-spectacular projects across all cause areas ranked by the
          donations they’ve received from specialist donors. You can tap into
          the wisdom of these donors and boost the impact of your donations.
        </Feature>
        <Feature icon={IconHeart} title="Philanthropic funders" key="funders">
          Specialist donors research their donations in-depth, and they can
          access local information to find exceptional funding gaps. We
          signal-boost that knowledge and make it accessible to you. You can use
          cash or regranting bounties to incentivize these donors, or you can
          mine their findings for any funding gaps that you want to fill!
        </Feature>
      </SimpleGrid>
    </Container>
  </div>
)
