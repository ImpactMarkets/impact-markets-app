import Head from 'next/head'

import { Heading1 } from '@/components/heading-1'
import { Header } from '@/components/landingpage/header'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const LandingPage: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>Impact Markets</title>
      </Head>

      <Header></Header>

      <Heading1>Landing page</Heading1>

      <div className="mt-6">Landing page</div>
    </div>
  )
}

export default LandingPage
