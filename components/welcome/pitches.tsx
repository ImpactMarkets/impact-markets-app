import Link from 'next/link'
import * as React from 'react'

import { IconShovel, IconTelescope, IconTrendingUp } from '@tabler/icons-react'

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: typeof IconShovel
  title: string
  children: React.ReactNode
}

const Feature = ({ icon: Icon, title, children }: FeatureProps) => (
  <div>
    <div className="h-22 p-3 mb-3 w-full bg-gray-100">
      <Icon
        size={20}
        className="inline stroke-blue-500 stroke-[2] mr-3 align-text-bottom"
      />
      <span className="font-display text-xl whitespace-nowrap overflow-hidden overflow-ellipsis">
        {title}
      </span>
    </div>
    <div className="[hyphens:auto] text-sm prose">{children}</div>
  </div>
)

export const Pitches = () => (
  <div className="max-w-[900px] mx-auto my-5 py-6">
    <div className="flex justify-center text-3xl font-display">
      AI Safety Impact Markets is a platform for …
    </div>
    <div className="flex gap-6 flex-col sm:flex-row my-6">
      <Feature icon={IconShovel} title="AI safety projects" key="projects">
        <p>
          You’re working on independent research or a{' '}
          <span className="font-semibold">new AI safety venture</span>? Your
          funding goal is &lt;&nbsp;$100,000 for now?
        </p>

        <p className="my-3">
          Let the funders come to you! We score donors by their track record of
          finding high-impact projects such as yours. A strong donation track
          record signal-boosts the projects that they support, so yours will be
          discovered by more donors!
        </p>

        <p className="my-3">
          <IconShovel
            size="38"
            className="float-left mr-1 stroke-blue-500 stroke-[1.5]"
          />
          <Link href="/project/new" className="link">
            Publish your project
          </Link>{' '}
          to start fundraising. Ask your existing donors to register their
          donations to express their support.
        </p>
      </Feature>
      <Feature icon={IconTelescope} title="Scouts & regrantors" key="scouts">
        <p>
          You’re a seasoned donor or grantmaker? You want to{' '}
          <span className="font-semibold">regrant some of the $600,000</span> of
          our donors and funders?
        </p>

        <p className="my-3">
          Scout out the best projects you can find! Your <em>donor score</em>{' '}
          reflects your donation track record: The higher your score, the more
          you signal-boost the projects you support. You’ll leverage your
          expertise for follow-on donations!
        </p>

        <p className="my-3">
          <IconTelescope
            size="38"
            className="float-left mr-1 stroke-blue-500 stroke-[1.5]"
          />
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
          You want to support{' '}
          <span className="font-semibold">
            funding-constrained AI safety projects
          </span>{' '}
          but don’t know which?
        </p>
        <p className="my-3">
          Project scouts find speculative, potentially spectacular projects! We
          make their diverse, specialized knowledge accessible to you. Follow
          our top scouts, tap into their wisdom, and boost the impact of your
          donations or grants.
        </p>

        <p className="my-3">
          <IconTrendingUp
            size="38"
            className="float-left mr-1 stroke-blue-500 stroke-[1.5]"
          />
          The scouts are just getting started.{' '}
          <a
            href="https://airtable.com/shr1eRlbcr43os6SX"
            className="link"
            target="_blank"
            rel="noreferrer"
          >
            Please register your interest in this 1-minute survey
          </a>{' '}
          to give them an incentive!
        </p>
      </Feature>
    </div>
    <iframe
      className="w-full max-w-[800px] aspect-video my-12 mx-auto"
      src="https://www.youtube.com/embed/MInKrUV9TVY?si=w9W6tW5b_P4d465x"
      title="YouTube video player"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    ></iframe>
  </div>
)
