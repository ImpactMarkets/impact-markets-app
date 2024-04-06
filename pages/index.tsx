import Head from 'next/head'

import { CenteredFooter } from '@/components/centeredFooter'
import { Layout } from '@/components/layout'
import { CallToAction } from '@/components/welcome/callToAction'
import { Comparisons } from '@/components/welcome/comparisons'
import { HeroText } from '@/components/welcome/heroText'
import { Partners } from '@/components/welcome/partners'
import { Pitches } from '@/components/welcome/pitches'
import { TopProjects } from '@/components/welcome/topProjects'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const LandingPage: NextPageWithAuthAndLayout = () => (
  <div className="mx-auto max-w-screen-lg my-5 pt-6">
    <Head>
      <title>GiveWiki</title>
    </Head>
    <HeroText />
    <div className="border"></div>
    <TopProjects />
    <div className="border"></div>
    <Pitches />
    <div className="border"></div>
    <Comparisons />
    <Partners />
    <CallToAction />
    <div className="border"></div>
    <CenteredFooter />
  </div>
)

LandingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default LandingPage
