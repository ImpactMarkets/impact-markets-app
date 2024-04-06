import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { ButtonLink } from '@/components/buttonLink'
import { FilterInputs, Filters, OrderByOption } from '@/components/filters'
import { Layout } from '@/components/layout'
import { Pagination, getQueryPaginationInput } from '@/components/pagination'
import { ProjectSummary } from '@/components/project/summary'
import { TAGS_GROUPED } from '@/components/project/tags'
import { PageLoader } from '@/components/utils'
import { ITEMS_PER_PAGE, ProjectSortKey } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const orderings: [
  OrderByOption<ProjectSortKey>,
  ...OrderByOption<ProjectSortKey>[],
] = [
  { value: 'supportScore', label: 'Sort by support score' },
  { value: 'credits', label: 'Sort by credits' },
  { value: 'likeCount', label: 'Sort by likes' },
  { value: 'createdAt', label: 'Sort by creation date' },
]

const Projects: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const currentPageNumber = router.query.page ? Number(router.query.page) : 1
  const { data: session } = useSession()
  const isAdmin = session?.user.role === 'ADMIN'

  const form = useForm<FilterInputs<ProjectSortKey>>({
    defaultValues: { orderBy: 'supportScore', filterTags: [], showAll: false },
  })
  const { watch } = form

  const feedQuery = trpc.project.feed.useQuery({
    ...getQueryPaginationInput(ITEMS_PER_PAGE, currentPageNumber),
    filterTags: watch('filterTags'),
    orderBy: watch('orderBy'),
    showClosed: watch('showAll'),
    showHidden: watch('showAll') && isAdmin,
  })

  if (feedQuery.data) {
    return (
      <div className="max-w-screen-lg mx-auto">
        <Head>
          <title>Projects – GiveWiki</title>
        </Head>

        <div className="flex justify-between flex-row-reverse flex-wrap gap-2 mt-3">
          <div>
            <ButtonLink href="/project/new" variant="highlight">
              <span className="block shrink-0">New project</span>
            </ButtonLink>
          </div>
          <div>
            <Filters
              tags={TAGS_GROUPED}
              orderings={orderings}
              searchEndpoint="project"
              form={form}
            />
          </div>
        </div>

        {feedQuery.data.projectCount === 0 ? (
          <div className="text-center text-secondary border rounded my-12 py-20 px-10">
            There are no published projects to show yet.
          </div>
        ) : (
          <div className="flow-root my-12">
            <ul className="divide-y divide-transparent flex flex-wrap gap-x-[1%] gap-y-2">
              {feedQuery.data.projects.map((project) => (
                <li key={project.id} className="w-full max-w-full">
                  {/* Classes for the tiled arrangement: w-full max-w-full xl:w-[49.5%] xl:max-w-[49.5%] 2xl:w-[32.6%] 2xl:max-w-[32.6%] */}
                  <ProjectSummary project={project} />
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
      </div>
    )
  }

  if (feedQuery.isError) {
    return <div>Error: {feedQuery.error.message}</div>
  }

  return <PageLoader />
}

Projects.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Projects
