import Head from 'next/head'

import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const HelpAndSupportPage: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-[720px] mx-auto my-5 py-6">
      <Head>
        <title>Help & Support</title>
      </Head>

      <Heading1>Help & Support</Heading1>

      <div className="mt-6">
        Email us at hi@impactmarkets.io or join our{' '}
        <a
          target="_blank"
          href="https://discord.gg/7zMNNDSxWv"
          rel="noopener noreferrer"
        >
          <span className="underline">Discord</span>
        </a>{' '}
        for help!
      </div>
    </div>
  )
}

HelpAndSupportPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default HelpAndSupportPage
