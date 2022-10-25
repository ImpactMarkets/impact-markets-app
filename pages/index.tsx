import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import type { CertificateSummaryProps } from '@/components/certificate-summary'
import { CertificateSummarySkeleton } from '@/components/certificate-summary-skeleton'
import { Layout } from '@/components/layout'
import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

declare global {
  interface Window {
    intercomSettings: any
    Intercom: any
  }
}

const CertificateSummary = dynamic<CertificateSummaryProps>(
  () =>
    import('@/components/certificate-summary').then(
      (mod) => mod.CertificateSummary
    ),
  { ssr: false }
)

const ITEMS_PER_PAGE = 20

const Home: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const utils = trpc.useContext()
  const feedQueryPathAndInput: InferQueryPathAndInput<'certificate.feed'> = [
    'certificate.feed',
    getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
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

        {feedQuery.data.certificateCount === 0 ? (
          <div className="text-center text-secondary border rounded py-20 px-10">
            There are no published certificates to show yet.
          </div>
        ) : (
          <div className="flow-root">
            <ul className="my-5 divide-y divide-transparent">
              {feedQuery.data.certificates.map((certificate) => (
                <li key={certificate.id} className="py-6">
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
            <CertificateSummarySkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}

Home.auth = true

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout activeTab="Home">{page}</Layout>
}

export default Home
