import Head from 'next/head'

import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const WhyImpactMarkets: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>Why impact markets?</title>
      </Head>

      <Heading1>Why impact markets?</Heading1>

      <div className="mt-6">Why impact markets? is coming soon…</div>
    </div>
  )
}

WhyImpactMarkets.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default WhyImpactMarkets
