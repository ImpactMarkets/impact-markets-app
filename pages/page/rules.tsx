import Head from 'next/head'

import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const RulesAndTerms: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>Rules & terms</title>
      </Head>

      <Heading1>Rules & terms</Heading1>

      <div className="mt-6">Rules & terms are coming soon…</div>
    </div>
  )
}

RulesAndTerms.auth = true

RulesAndTerms.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout activeTab="Rules & terms">{page}</Layout>
}

export default RulesAndTerms
