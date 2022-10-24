import Head from 'next/head'
import { ExtendedRecordMap } from 'notion-types'
import { getPageTitle } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'

import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

import notion from '../lib/notion'

export const getStaticProps = async () => {
  const pageId = '7377f53eb1324e569d0c02a23d85904d'
  const recordMap = await notion.getPage(pageId)

  return {
    props: {
      recordMap,
    },
    revalidate: 10,
  }
}

const RulesAndTerms: NextPageWithAuthAndLayout = ({
  recordMap,
}: {
  recordMap: ExtendedRecordMap
}) => {
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

RulesAndTerms.auth = true

RulesAndTerms.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout activeTab="Rules & terms">{page}</Layout>
}

export default RulesAndTerms
