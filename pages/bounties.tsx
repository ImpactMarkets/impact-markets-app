import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { Banner } from '@/components/banner'
import { Summary } from '@/components/bounty/summary'
import { TAGS_GROUPED } from '@/components/bounty/tags'
import { ButtonLink } from '@/components/buttonLink'
import { FilterInputs, Filters, OrderByOption } from '@/components/filters'
import { Layout } from '@/components/layout'
import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import { PageLoader } from '@/components/utils'
import { BountySortKey, ITEMS_PER_PAGE } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const orderings: [
  OrderByOption<BountySortKey>,
  ...OrderByOption<BountySortKey>[],
] = [
  { value: 'createdAt', label: 'Sort by creation date' },
  { value: 'deadline', label: 'Sort by deadline' },
  { value: 'size', label: 'Sort by bounty amount' },
  { value: 'likeCount', label: 'Sort by interest' },
]

const Home: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1

  const form = useForm<FilterInputs<BountySortKey>>({
    defaultValues: { orderBy: 'size', filterTags: [], showAll: false },
  })
  const { watch } = form

  const feedQuery = trpc.bounty.feed.useQuery({
    ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
    filterTags: watch('filterTags'),
    orderBy: watch('orderBy'),
    showClosed: watch('showAll'),
  })

  if (feedQuery.data) {
    return (
      <div className="max-w-screen-lg mx-auto">
        <Head>
          <title>Bounties – GiveWiki</title>
        </Head>

        <div className="flex justify-between flex-row-reverse flex-wrap gap-3 mt-3">
          <div className="flex items-center justify-end gap-x-3">
            <ButtonLink href="/bounty/new" variant="highlight">
              <span className="block shrink-0">New bounty</span>
            </ButtonLink>
          </div>
          <div>
            <Filters
              tags={TAGS_GROUPED}
              orderings={orderings}
              searchEndpoint="bounty"
              form={form}
            />
          </div>
        </div>

        <Banner className="mt-6 text-sm p-4">
          Need seed funding to work on any of these?{' '}
          <Link href="/projects" className="link">
            Fundraise by creating a project
          </Link>
          !
        </Banner>

        {feedQuery.data.bountyCount === 0 ? (
          <div className="text-center text-secondary border rounded my-12 py-20 px-10">
            There are no published bounties to show yet.
          </div>
        ) : (
          <div className="flow-root my-12">
            <ul className="divide-y divide-transparent flex flex-wrap gap-2">
              {feedQuery.data.bounties.map((bounty) => (
                <li key={bounty.id} className="w-full max-w-full">
                  {/* Classes for the tiled arrangement: w-full max-w-full xl:w-[49.5%] xl:max-w-[49.5%] 2xl:w-[32.6%] 2xl:max-w-[32.6%] */}
                  <Summary bounty={bounty} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <Pagination
          itemCount={feedQuery.data.bountyCount}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPageNumber={currentPageNumber}
        />
      </div>
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
