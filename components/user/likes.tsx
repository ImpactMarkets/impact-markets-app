import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Pagination } from '@/components/pagination'
import type { ProjectSummaryProps } from '@/components/project/summary'
import { SummarySkeleton } from '@/components/summarySkeleton'
import { ITEMS_PER_PAGE } from '@/lib/constants'
import { InferQueryOutput } from '@/lib/trpc'

// TODO
// do the same for bounties but somehow combine these
// refactor const projects and const bounties into one?

// TO ADD CERTIFICATES:
//// first update user.ts profile query
//// will need to add author and content to user.ts as well

export function Likes({ user }: { user: InferQueryOutput<'user.profile'> }) {
  const ProjectSummary = dynamic<ProjectSummaryProps>(
    () =>
      import('@/components/project/summary').then((mod) => mod.ProjectSummary),
    { ssr: false }
  )

  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1

  const projects = user.likedProjects.map((likedProject) => (
    <li key={likedProject.projectId} className="py-3">
      <ProjectSummary project={likedProject.project} />
    </li>
  ))

  const combinedLikeCount =
    user.likedProjects.length + user.likedBounties.length

  if (user) {
    return (
      <>
        <div className="flow-root mt-6">
          {combinedLikeCount === 0 ? (
            <div className="text-center text-secondary border rounded py-20 px-10">
              This user hasn’t liked any projects or bounties yet.
            </div>
          ) : (
            <>
              <div>
                <ul className="-my-3">{projects}</ul>
              </div>
              {/* TODO:
              <div>
                <ul className="-my-3">
                  {bounties}
                </ul>
              </div> */}
            </>
          )}
        </div>

        <Pagination
          itemCount={combinedLikeCount}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPageNumber={currentPageNumber}
        />
      </>
    )
  }

  // display when loading
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
