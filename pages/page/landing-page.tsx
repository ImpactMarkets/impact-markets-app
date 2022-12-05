import Head from 'next/head'

import { FooterCentered } from '@/components/footercentered'
import { Heading1 } from '@/components/heading-1'
import { HeroText } from '@/components/herotext'
import { Landing_Header } from '@/components/landingpage/header'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const LandingPage: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[1100px] mx-auto my-5 py-6">
      <Head>
        <title>Impact Markets</title>
      </Head>
      <Landing_Header></Landing_Header>
      <HeroText></HeroText>
      <FooterCentered></FooterCentered>
    </div>
  )
}

export default LandingPage
