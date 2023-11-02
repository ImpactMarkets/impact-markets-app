import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Banner } from '@/components/banner'
import { CertificateSummary } from '@/components/certificate/summary'
import { Layout } from '@/components/layout'
import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import { PageLoader } from '@/components/utils'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const Home: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const feedQueryInput = {
    ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
  }
  const feedQuery = trpc.certificate.feed.useQuery(feedQueryInput)

  if (feedQuery.data) {
    return (
      <>
        <Head>
          <title>Certificates – AI Safety GiveWiki</title>
        </Head>

        <Banner className="mb-6 text-sm p-4">
          This is an archive. Please see the{' '}
          <Link href="/projects" className="link">
            projects
          </Link>{' '}
          page for the current projects.
        </Banner>

        {feedQuery.data.certificateCount === 0 ? (
          <div className="text-center text-secondary border rounded my-10 py-20 px-10">
            There are no published certificates to show yet.
          </div>
        ) : (
          <div className="flow-root">
            <ul className="divide-y divide-transparent flex flex-wrap gap-2">
              {feedQuery.data.certificates.map((certificate) => (
                <li
                  key={certificate.id}
                  className="w-full max-w-full xl:w-[49.5%] xl:max-w-[49.5%] 2xl:w-[32.6%] 2xl:max-w-[32.6%]"
                >
                  <CertificateSummary certificate={certificate} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <Pagination
          itemCount={feedQuery.data.certificateCount}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPageNumber={currentPageNumber}
        />
      </>
    )
  }

  if (feedQuery.isError) {
    return <div>Error: {feedQuery.error.message}</div>
  }

  return <PageLoader />
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
