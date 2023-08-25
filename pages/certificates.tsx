import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Banner } from '@/components/banner'
import type { CertificateSummaryProps } from '@/components/certificate/summary'
import { Filters } from '@/components/filters'
import { Layout } from '@/components/layout'
import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import { TAGS } from '@/components/project/tags'
import { SummarySkeleton } from '@/components/summarySkeleton'
import { CertificateSortKey, ITEMS_PER_PAGE } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const CertificateSummary = dynamic<CertificateSummaryProps>(
  () =>
    import('@/components/certificate/summary').then(
      (mod) => mod.CertificateSummary,
    ),
  { ssr: false },
)

const orderByValues: Array<{ value: CertificateSortKey; label: string }> = [
  { value: 'createdAt', label: 'Sort by creation date' },
  { value: 'actionStart', label: 'Sort by start of work' },
  { value: 'actionEnd', label: 'Sort by end of work' },
  { value: 'likeCount', label: 'Sort by likes' },
]

const defaultOrder = 'likeCount'

const Home: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const [filterTags, setFilterTags] = React.useState('')
  const [orderBy, setOrderBy] = React.useState(
    defaultOrder as CertificateSortKey,
  )
  const feedQueryInput = {
    ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
    filterTags,
    orderBy,
  }
  const feedQuery = trpc.certificate.feed.useQuery(feedQueryInput)

  if (feedQuery.data) {
    return (
      <>
        <Head>
          <title>Impact Markets</title>
        </Head>

        <div>
          <Filters
            tags={TAGS}
            onFilterTagsUpdate={(tags) => setFilterTags(tags)}
            onOrderByUpdate={(orderBy: string) =>
              // A bit unhappy with this – https://stackoverflow.com/a/69007934/678861
              (orderByValues.map((item) => item.value) as string[]).includes(
                orderBy,
              ) && setOrderBy(orderBy as CertificateSortKey)
            }
            orderByValues={orderByValues}
            defaultFilterTagValue={filterTags}
            defaultOrderByValue={orderBy}
          />
        </div>

        <Banner className="my-6 text-sm p-4">
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

  return (
    <div className="flow-root">
      <ul className="my-10 divide-y divide-transparent">
        {[...Array(3)].map((_, idx) => (
          <li key={idx} className="py-10">
            <SummarySkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
