import Head from 'next/head'

import { buttonClasses } from '@/components/button'
import { ButtonLink } from '@/components/buttonLink'
import { CenteredFooter } from '@/components/centeredFooter'
import { Layout } from '@/components/layout'
import { Comparisons } from '@/components/welcome/comparisons'
import { HeroText } from '@/components/welcome/heroText'
import { Pitches } from '@/components/welcome/pitches'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Card } from '@mantine/core'

const LandingPage: NextPageWithAuthAndLayout = () => (
  <div className="mx-auto max-w-screen-lg my-5 pt-6">
    <Head>
      <title>Impact Markets</title>
    </Head>
    <HeroText />
    <div className="border"></div>
    <Pitches />
    <div className="border"></div>
    <Comparisons />
    <Card
      shadow="lg"
      p="lg"
      radius="md"
      withBorder
      className="border-theme-blue m-auto border-2 rounded-2xl text-center p-16 mt-32 mb-12"
    >
      <div>
        <div className="text-4xl font-extrabold mb-4">Join the community!</div>
        <div className="text-lg">
          Play regrantor, raise money, discover funding opportunities
        </div>
        <div className="mt-6">
          <ButtonLink className="mr-2" href="https://discord.gg/7zMNNDSxWv">
            Join the Discord
          </ButtonLink>
          <ButtonLink
            className="mr-2"
            href="https://impactmarkets.substack.com/"
          >
            Read the blog
          </ButtonLink>
          <a
            href="https://airtable.com/shr1eRlbcr43os6SX"
            className={buttonClasses({ variant: 'highlight' })}
            target="_blank"
            rel="noreferrer"
          >
            Register your interest
          </a>
        </div>
      </div>
    </Card>
    <div className="m-auto align-center flex justify-center">
      <iframe
        className="max-w-[300px]"
        height="320"
        src="https://impactmarkets.substack.com/embed"
        scrolling="no"
      ></iframe>
    </div>
    <CenteredFooter></CenteredFooter>
  </div>
)

LandingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default LandingPage
