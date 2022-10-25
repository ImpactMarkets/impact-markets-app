import Head from 'next/head'

import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const WhyImpactMarkets: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>Why impact markets?</title>
      </Head>
    </div>
  )
}

WhyImpactMarkets.auth = true

WhyImpactMarkets.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout activeTab="Why impact markets?">{page}</Layout>
}

export default WhyImpactMarkets
