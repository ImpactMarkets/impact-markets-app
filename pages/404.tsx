import Head from 'next/head'

import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const Custom404: NextPageWithAuthAndLayout = () => {
  return (
    <div className="max-w-screen-lg mx-auto my-5 py-6">
      <Head>
        <title>404 – Page Not Found</title>
      </Head>

      <Heading1>404 – Page Not Found</Heading1>

      <p className="mt-6">
        Huh, you’ve done the impossible! You’ve found a page that can’t be
        found.
      </p>
    </div>
  )
}

Custom404.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Custom404
