import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import type { ProjectSummaryProps } from '@/components/project/summary'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { RouterOutput, trpc } from '@/lib/trpc'

import { PageLoader } from '../utils'

const ProjectSummary = dynamic<ProjectSummaryProps>(
  () =>
    import('@/components/project/summary').then((mod) => mod.ProjectSummary),
  { ssr: false },
)

export function ProjectFeed({
  user: _,
}: {
  user: RouterOutput['user']['profile']
}) {
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const profileFeedQueryInput = {
    ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
    authorId: String(router.query.userId),
  }
  const profileFeedQuery = trpc.project.feed.useQuery(profileFeedQueryInput)

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

  return <PageLoader />
}
