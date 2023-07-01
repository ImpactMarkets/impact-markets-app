import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import type { ProjectSummaryProps } from '@/components/project/summary'
import { SummarySkeleton } from '@/components/summarySkeleton'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { InferQueryOutput, InferQueryPathAndInput, trpc } from '@/lib/trpc'

const ProjectSummary = dynamic<ProjectSummaryProps>(
  () =>
    import('@/components/project/summary').then((mod) => mod.ProjectSummary),
  { ssr: false }
)

export function ProjectFeed({
  user: _,
}: {
  user: InferQueryOutput<'user.profile'>
}) {
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const profileFeedQueryPathAndInput: InferQueryPathAndInput<'project.feed'> = [
    'project.feed',
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
          {profileFeedQuery.data.projectCount === 0 ? (
            <div className="text-center text-secondary border rounded py-20 px-10">
              This user hasn’t published any projects yet.
            </div>
          ) : (
            <ul className="-my-3">
              {profileFeedQuery.data.projects.map((project) => (
                <li key={project.id} className="py-3">
                  <ProjectSummary project={project} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <Pagination
          itemCount={profileFeedQuery.data.projectCount}
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
      <ul className="-my-3">
        {[...Array(3)].map((_, idx) => (
          <li key={idx} className="py-3">
            <SummarySkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}
