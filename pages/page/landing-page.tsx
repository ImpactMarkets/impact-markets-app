import Head from 'next/head'

import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const LandingPage: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>Impact Markets</title>
      </Head>

      <Heading1>Landing page</Heading1>

      <div className="mt-6">Landing page</div>
    </div>
  )
}

LandingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default LandingPage
