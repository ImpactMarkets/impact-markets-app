import Head from 'next/head'
import Image from 'next/image'

import { ButtonLink } from '@/components/button-link'
import { CenteredFooter } from '@/components/centeredFooter'
import { HeroText } from '@/components/hero-text'
import { Landing_Header } from '@/components/landingPage/header'
import { Pitches } from '@/components/landingPage/pitches'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Card } from '@mantine/core'

const LandingPage: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[1100px] mx-auto my-5 pt-6">
      <Head>
        <title>Impact Markets</title>
      </Head>
      <Landing_Header></Landing_Header>
      <HeroText></HeroText>
      <div className="border"></div>
      <Pitches></Pitches>
      <div className="border"></div>
      <div className="max-w-screen-lg m-auto items-center flex mb-20 mt-12">
        <div className="basis-full">
          <Image
            src="/images/trophy.png"
            alt="Trophy"
            width={626}
            height={378}
            layout="fixed"
            object-fit="contain"
            unoptimized
          />
        </div>
        <div className="basis-full">
          <div className="text-xl font-bold mb-4">
            It’s like investing in X prize teams
          </div>
          <div>
            Prize competitions already exist to induce people to achieve great
            things. An impact market adds a twist where impact investors can
            provide money to teams that have a shot at winning the prize, and if
            the team wins the prize then the investor gets some of the prize in
            proportion to how many shares they bought. This allows people to
            predict who will win the prize and help them get resources to
            achieve it more easily.
          </div>
        </div>
      </div>
      <div className="max-w-screen-lg m-auto flex items-center mb-20 mt-12">
        <div className="basis-full">
          <div className="text-xl font-bold mb-4">
            It’s like a startup ecosystem for altruistic projects
          </div>
          <div>
            We want to replicate the incentives of startup investment, where
            founders and employees have stock, and venture capitalists have
            enormous sums of money they can invest for stock as well. Good
            startups building a lot of value can exit via an IPO or acquisition,
            making their stockholders wealthy. We would like to build an
            ecosystem analogous to this for projects working on valuable things
            that don’t have a profit mechanism that prices them in to the
            marketplace. Retroactively funding things after more information has
            come out about their effectiveness is one way to incentivize people
            doing the most valuable things for the world (we hope!).
          </div>
        </div>
        <div className="basis-full">
          <Image
            src="/images/trophy.png"
            alt="Trophy"
            width={626}
            height={378}
            layout="fixed"
            object-fit="contain"
            unoptimized
          />
        </div>
      </div>
      <Card
        shadow="lg"
        p="lg"
        radius="md"
        withBorder
        className=" max-w-screen-lg border-theme-blue m-auto border-2 rounded-2xl text-center p-16 mt-32 mb-12"
      >
        <div>
          <div className="text-4xl font-extrabold mb-4">Check it out!</div>
          <div className="text-lg">
            Launch a prize, fund a friend, or raise some capital
          </div>
          <div className="mt-6">
            <ButtonLink className="mr-2" href="/">
              Join our Discord
            </ButtonLink>
            <ButtonLink variant="highlight" href="/">
              Explore Markets
            </ButtonLink>
          </div>
        </div>
      </Card>
      <div className="m-auto align-center flex justify-center">
        <iframe
          width="50%"
          height="320"
          src="https://impact-markets.substack.com/embed"
          scrolling="no"
        ></iframe>
      </div>
      <CenteredFooter></CenteredFooter>
    </div>
  )
}

export default LandingPage
