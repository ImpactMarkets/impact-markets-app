import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as React from 'react'

import type { CertificateSummaryProps } from '@/components/certificate/summary'
import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import { SummarySkeleton } from '@/components/summarySkeleton'
import { InferQueryOutput, InferQueryPathAndInput, trpc } from '@/lib/trpc'

const CertificateSummary = dynamic<CertificateSummaryProps>(
  () =>
    import('@/components/certificate/summary').then(
      (mod) => mod.CertificateSummary
    ),
  { ssr: false }
)

const ITEMS_PER_PAGE = 20

export function CertificateFeed({
  user: _,
}: {
  user: InferQueryOutput<'user.profile'>
}) {
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const profileFeedQueryPathAndInput: InferQueryPathAndInput<'certificate.feed'> =
    [
      'certificate.feed',
      {
        ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
        authorId: String(router.query.userId),
      },
    ]
  const profileFeedQuery = trpc.useQuery(profileFeedQueryPathAndInput)

  if (profileFeedQuery.data) {
    return (
      <>
        <div className="flow-root mt-6">
          {profileFeedQuery.data.certificateCount === 0 ? (
            <div className="text-center text-secondary border rounded py-20 px-10">
              This user hasn&apos;t published any certificates yet.
            </div>
          ) : (
            <ul className="-my-12 divide-y divide-primary">
              {profileFeedQuery.data.certificates.map((certificate) => (
                <li key={certificate.id} className="py-10">
                  <CertificateSummary certificate={certificate} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <Pagination
          itemCount={profileFeedQuery.data.certificateCount}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPageNumber={currentPageNumber}
        />
      </>
    )
  }

  if (profileFeedQuery.isError) {
    return <div className="mt-6">Error: {profileFeedQuery.error.message}</div>
  }

  return (
    <div className="flow-root mt-6">
      <ul className="-my-12 divide-y divide-primary">
        {[...Array(3)].map((_, idx) => (
          <li key={idx} className="py-10">
            <SummarySkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}
