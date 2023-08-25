import Link from 'next/link'
import * as React from 'react'

import { Container, SimpleGrid, Text } from '@mantine/core'
import { IconShovel, IconTelescope, IconTrendingUp } from '@tabler/icons-react'

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: typeof IconShovel
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
        <Feature icon={IconShovel} title="AI safety projects" key="projects">
          <p>
            Are you doing independent research or launching a new AI safety
            venture? Your fundraising goal is &lt; $100,000 for now?
          </p>

          <p className="my-3">
            Let the funders come to you! We score donors by their track record
            of finding{' '}
            <span className="text-gray-700">high-impact projects</span> such as
            yours. A strong donation track record signal-boosts the projects
            that they support, so yours will be discovered by more donors!
          </p>

          <p className="my-3 text-gray-700">
            <Link href="/project/new" className="link">
              Publish your project
            </Link>{' '}
            to start fundraising. Ask your existing donors to register their
            donations to express their support.
          </p>
        </Feature>
        <Feature
          icon={IconTelescope}
          title="Project scouts & regrantors"
          key="scouts"
        >
          <p>
            You’re an experienced donor or grantmaker? You want to regrant some
            of the{' '}
            <span className="text-gray-700">$370,000 donation budget</span> of
            our donors? Or more, once larger funders join?
          </p>

          <p className="my-3">
            Scout out the best projects you can find! Your <em>donor score</em>{' '}
            reflects your donation track record: The higher your score, the more
            you signal-boost the projects you support. You’ll leverage your
            expertise for follow-on donations!
          </p>

          <p className="my-3 text-gray-700">
            Get your top projects to{' '}
            <Link href="/project/new" className="link">
              join the platform
            </Link>{' '}
            and register your past and present donations.
          </p>
        </Feature>
        <Feature
          icon={IconTrendingUp}
          title="Donors & funders"
          key="Donors & funders"
        >
          <p>
            Do you want to donate to funding-constrained{' '}
            <span className="text-gray-700">AI safety projects</span> and grow
            the ecosystem but don’t know where to start?
          </p>
          <p className="my-3">
            Project scouts find speculative, potentially spectacular projects!
            We make their diverse, specialized knowledge accessible to you.
            Follow our top scouts, tap into their wisdom, and boost the impact
            of your donations or grants.
          </p>

          <p className="my-3 text-gray-700">
            The scouts are just getting started. Meanwhile{' '}
            <a
              href="https://airtable.com/shr1eRlbcr43os6SX"
              className="link"
              target="_blank"
              rel="noreferrer"
            >
              please register your interest in this 1-minute survey
            </a>{' '}
            to give them an incentive!
          </p>
        </Feature>
      </SimpleGrid>
    </Container>
  </div>
)
