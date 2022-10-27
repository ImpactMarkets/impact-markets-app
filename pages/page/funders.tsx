import Head from 'next/head'

import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const FundersAndPrizesPage: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>Funders & prizes</title>
      </Head>

      <Heading1>Funders & Prizes</Heading1>

      <div className="mt-6">Funders & prizes are coming soon…</div>
    </div>
  )
}

FundersAndPrizesPage.auth = true

FundersAndPrizesPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default FundersAndPrizesPage
