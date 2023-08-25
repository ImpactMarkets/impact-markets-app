import * as React from 'react'

import { classNames } from '@/lib/classnames'
import { trpc } from '@/lib/trpc'

import { ButtonLink } from '../buttonLink'
import { ProjectSummary } from '../project/summary'
import { ProjectSortKey } from '@/lib/constants'

export const TopProjects = () => {
  const feedQuery = trpc.project.feed.useQuery({
    take: 3,
    showHidden: false,
    hideClosed: true,
    orderBy: 'supportScore' as ProjectSortKey,
  })

  if (feedQuery.data && feedQuery.data.projectCount >= 0) {
    return (
      <div className="my-12">
        <div className="flex justify-center my-12 text-3xl font-bold">
          Our current top&nbsp;
          <span className="hidden xl:inline 2xl:inline">projects are</span>
          <span className="inline xl:hidden 2xl:hidden">project is</span>&nbsp;…
        </div>
        <ul className="divide-y divide-transparent flex flex-wrap gap-x-[1%] gap-y-2">
          {feedQuery.data.projects.map((project) => (
            <li
              key={project.id}
              className={classNames(
                'w-full max-w-full xl:w-[49.5%] xl:max-w-[49.5%] 2xl:w-[32.6%] 2xl:max-w-[32.6%]',
                '[&:nth-child(2)]:hidden xl:[&:nth-child(2)]:block 2xl:[&:nth-child(2)]:block',
                '[&:nth-child(3)]:hidden xl:[&:nth-child(3)]:hidden 2xl:[&:nth-child(3)]:block'
              )}
            >
              <ProjectSummary project={project} hideRight />
            </li>
          ))}
        </ul>
        <ButtonLink variant="secondary" className="mt-6" href="/projects">
          See all projects
        </ButtonLink>
      </div>
    )
  }

  return null
}
