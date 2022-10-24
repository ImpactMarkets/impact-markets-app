import Head from 'next/head'
import { getPageTitle } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'

import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

import notion from '../lib/notion'

export const getStaticProps = async () => {
  const pageId = '4bc1a1b5910c48578002ca8b86d39b1b'
  const recordMap = await notion.getPage(pageId)

  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  }
}

const WhyImpactMarkets: NextPageWithAuthAndLayout = ({ recordMap }) => {
  const title = getPageTitle(recordMap)
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>{title}</title>
      </Head>
      <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
    </div>
  )
}

WhyImpactMarkets.auth = true

WhyImpactMarkets.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout activeTab="Why impact markets?">{page}</Layout>
}

export default WhyImpactMarkets
