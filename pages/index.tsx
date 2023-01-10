import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Layout } from '@/components/layout'
import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import { ProjectFilters } from '@/components/projectFilters'
import type { ProjectSummaryProps } from '@/components/projectSummary'
import { ProjectSummarySkeleton } from '@/components/projectSummarySkeleton'
import { CertSortKey } from '@/lib/constants'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const ProjectSummary = dynamic<ProjectSummaryProps>(
  () => import('@/components/projectSummary').then((mod) => mod.ProjectSummary),
  { ssr: false }
)

const ITEMS_PER_PAGE = 20

const Home: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const utils = trpc.useContext()
  const [filterTags, setFilterTags] = React.useState('')
  const [orderBy, setOrderBy] = React.useState('' as CertSortKey)
  const feedQueryPathAndInput: InferQueryPathAndInput<'project.feed'> = [
    'project.feed',
    {
      ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
      filterTags,
      orderBy,
    },
  ]
  const feedQuery = trpc.useQuery(feedQueryPathAndInput)
  const likeMutation = trpc.useMutation(['project.like'], {
    onMutate: async (likedProjectId) => {
      await utils.cancelQuery(feedQueryPathAndInput)

      const previousQuery = utils.getQueryData(feedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          projects: previousQuery.projects.map((project) =>
            project.id === likedProjectId
              ? {
                  ...project,
                  likedBy: [
                    ...project.likedBy,
                    {
                      user: { id: session!.user.id, name: session!.user.name },
                    },
                  ],
                }
              : project
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
  const unlikeMutation = trpc.useMutation(['project.unlike'], {
    onMutate: async (unlikedProjectId) => {
      await utils.cancelQuery(feedQueryPathAndInput)

      const previousQuery = utils.getQueryData(feedQueryPathAndInput)

      if (previousQuery) {
        utils.setQueryData(feedQueryPathAndInput, {
          ...previousQuery,
          projects: previousQuery.projects.map((project) =>
            project.id === unlikedProjectId
              ? {
                  ...project,
                  likedBy: project.likedBy.filter(
                    (item) => item.user.id !== session!.user.id
                  ),
                }
              : project
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

        <div className="mb-6">
          <ProjectFilters
            onFilterTagsUpdate={(tags) => setFilterTags(tags)}
            onOrderByUpdate={(orderBy: CertSortKey) => setOrderBy(orderBy)}
            defaultFilterTagValue={filterTags}
            defaultOrderByValue={orderBy}
          />
        </div>
        {feedQuery.data.projectCount === 0 ? (
          <div className="text-center text-secondary border rounded my-10 py-20 px-10">
            There are no published projects to show yet.
          </div>
        ) : (
          <div className="flow-root">
            <ul className="divide-y divide-transparent flex flex-wrap gap-2">
              {feedQuery.data.projects.map((project) => (
                <li
                  key={project.id}
                  className="w-full max-w-full xl:w-[49%] xl:max-w-[49%] 2xl:w-[32%] 2xl:max-w-[32%]"
                >
                  <ProjectSummary
                    project={project}
                    onLike={() => {
                      likeMutation.mutate(project.id)
                    }}
                    onUnlike={() => {
                      unlikeMutation.mutate(project.id)
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <Pagination
          itemCount={feedQuery.data.projectCount}
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
            <ProjectSummarySkeleton />
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
