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
    <CallToAction />
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
