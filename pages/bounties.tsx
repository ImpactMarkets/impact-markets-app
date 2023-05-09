import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import type { SummaryProps } from '@/components/bounty/summary'
import { ButtonLink } from '@/components/buttonLink'
import { Filters } from '@/components/filters'
import { Layout } from '@/components/layout'
import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import { SummarySkeleton } from '@/components/summarySkeleton'
import { BountySortKey, ITEMS_PER_PAGE } from '@/lib/constants'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const Summary = dynamic<SummaryProps>(
  () => import('@/components/bounty/summary').then((mod) => mod.Summary),
  { ssr: false }
)

const orderByValues: Array<{ value: BountySortKey; label: string }> = [
  { value: 'createdAt', label: 'Creation date' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'size', label: 'Bounty amount' },
]

const defaultOrder: string = 'size'

const Home: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const utils = trpc.useContext()
  const [filterTags, setFilterTags] = React.useState('')
  const [orderBy, setOrderBy] = React.useState(defaultOrder as BountySortKey)
  const feedQueryPathAndInput: InferQueryPathAndInput<'bounty.feed'> = [
    'bounty.feed',
    {
      ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
      filterTags,
      orderBy,
    },
  ]
  const feedQuery = trpc.useQuery(feedQueryPathAndInput)
  const likeMutation = trpc.useMutation(['bounty.like'], {
    onMutate: async (likedBountyId) => {
      await utils.cancelQuery(feedQueryPathAndInput)

      const previousQuery = utils.getQueryData(feedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          bounties: previousQuery.bounties.map((bounty) =>
            bounty.id === likedBountyId
              ? {
                  ...bounty,
                  likedBy: [
                    ...bounty.likedBy,
                    {
                      user: { id: session!.user.id, name: session!.user.name },
                    },
                  ],
                }
              : bounty
          ),
        })
      }

      return { previousQuery }
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, context.previousQuery)
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['bounty.unlike'], {
    onMutate: async (unlikedBountyId) => {
      await utils.cancelQuery(feedQueryPathAndInput)

      const previousQuery = utils.getQueryData(feedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          bounties: previousQuery.bounties.map((bounty) =>
            bounty.id === unlikedBountyId
              ? {
                  ...bounty,
                  likedBy: bounty.likedBy.filter(
                    (item) => item.user.id !== session!.user.id
                  ),
                }
              : bounty
          ),
        })
      }

      return { previousQuery }
    },
    onError: (err, id, context: any) => {
      if (context?.previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, context.previousQuery)
      }
    },
  })

  if (feedQuery.data) {
    return (
      <>
        <Head>
          <title>Impact Markets</title>
        </Head>

        <div className="flex justify-between flex-row-reverse flex-wrap">
          <div className="flex items-center justify-end gap-x-3">
            <ButtonLink href="/bounty/new" variant="highlight">
              <span className="block shrink-0">New bounty</span>
            </ButtonLink>
          </div>
          <div>
            <Filters
              onFilterTagsUpdate={(tags) => setFilterTags(tags)}
              onOrderByUpdate={(orderBy: string) =>
                // A bit unhappy with this – https://stackoverflow.com/a/69007934/678861
                (orderByValues.map((item) => item.value) as string[]).includes(
                  orderBy
                ) && setOrderBy(orderBy as BountySortKey)
              }
              orderByValues={orderByValues}
              defaultFilterTagValue={filterTags}
              defaultOrderByValue={orderBy}
              searchEndpoint="bounty.search"
            />
          </div>
        </div>

        {feedQuery.data.bountyCount === 0 ? (
          <div className="text-center text-secondary border rounded my-12 py-20 px-10">
            There are no published bounties to show yet.
          </div>
        ) : (
          <div className="flow-root my-12">
            <ul className="divide-y divide-transparent flex flex-wrap gap-2">
              {feedQuery.data.bounties.map((bounty) => (
                <li
                  key={bounty.id}
                  className="w-full max-w-full xl:w-[49.5%] xl:max-w-[49.5%] 2xl:w-[32.6%] 2xl:max-w-[32.6%]"
                >
                  <Summary
                    bounty={bounty}
                    onLike={() => {
                      likeMutation.mutate(bounty.id)
                    }}
                    onUnlike={() => {
                      unlikeMutation.mutate(bounty.id)
                    }}
                  />
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
