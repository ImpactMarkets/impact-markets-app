import Head from 'next/head'

import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const RulesAndTerms: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>Rules & Terms</title>
      </Head>
    </div>
  )
}

RulesAndTerms.auth = true

RulesAndTerms.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout activeTab="Rules & terms">{page}</Layout>
}

export default RulesAndTerms
