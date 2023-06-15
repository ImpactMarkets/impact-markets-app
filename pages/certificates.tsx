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
import { ITEMS_PER_PAGE, ProjectSortKey } from '@/lib/constants'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const CertificateSummary = dynamic<CertificateSummaryProps>(
  () =>
    import('@/components/certificate/summary').then(
      (mod) => mod.CertificateSummary
    ),
  { ssr: false }
)

const orderByValues: Array<{ value: ProjectSortKey; label: string }> = [
  { value: 'createdAt', label: 'Sort by creation date' },
  { value: 'actionStart', label: 'Sort by start of work' },
  { value: 'actionEnd', label: 'Sort by end of work' },
  { value: 'supporterCount', label: 'Sort by supporters' },
]

const defaultOrder = 'supporterCount'

const Home: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const utils = trpc.useContext()
  const [filterTags, setFilterTags] = React.useState('')
  const [orderBy, setOrderBy] = React.useState(defaultOrder as ProjectSortKey)
  const feedQueryPathAndInput: InferQueryPathAndInput<'certificate.feed'> = [
    'certificate.feed',
    {
      ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
      filterTags,
      orderBy,
    },
  ]
  const feedQuery = trpc.useQuery(feedQueryPathAndInput)
  const likeMutation = trpc.useMutation(['certificate.like'], {
    onMutate: async (likedCertificateId) => {
      await utils.cancelQuery(feedQueryPathAndInput)

      const previousQuery = utils.getQueryData(feedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          certificates: previousQuery.certificates.map((certificate) =>
            certificate.id === likedCertificateId
              ? {
                  ...certificate,
                  likedBy: [
                    ...certificate.likedBy,
                    {
                      user: { id: session!.user.id, name: session!.user.name },
                    },
                  ],
                }
              : certificate
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
  const unlikeMutation = trpc.useMutation(['certificate.unlike'], {
    onMutate: async (unlikedCertificateId) => {
      await utils.cancelQuery(feedQueryPathAndInput)

      const previousQuery = utils.getQueryData(feedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          certificates: previousQuery.certificates.map((certificate) =>
            certificate.id === unlikedCertificateId
              ? {
                  ...certificate,
                  likedBy: certificate.likedBy.filter(
                    (item) => item.user.id !== session!.user.id
                  ),
                }
              : certificate
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

        <div>
          <Filters
            tags={TAGS}
            onFilterTagsUpdate={(tags) => setFilterTags(tags)}
            onOrderByUpdate={(orderBy: string) =>
              // A bit unhappy with this – https://stackoverflow.com/a/69007934/678861
              (orderByValues.map((item) => item.value) as string[]).includes(
                orderBy
              ) && setOrderBy(orderBy as ProjectSortKey)
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
                  <CertificateSummary
                    certificate={certificate}
                    onLike={() => {
                      likeMutation.mutate(certificate.id)
                    }}
                    onUnlike={() => {
                      unlikeMutation.mutate(certificate.id)
                    }}
                  />
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
