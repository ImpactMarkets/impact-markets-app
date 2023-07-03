import Link from 'next/link'
import * as React from 'react'

import { Banner } from '@/components/banner'
import { markdownToPlainHtml } from '@/lib/editor'
import { InferQueryOutput } from '@/lib/trpc'
import { Card } from '@mantine/core'

import { Author } from '../author'
import { Heading2 } from '../heading2'
import { HtmlView } from '../htmlView'
import { Scores } from '../scores'
import { Tags } from '../tags'
import { TAGS } from './tags'

export type ProjectSummaryProps = {
  project: InferQueryOutput<'project.feed'>['projects'][number]
  hideRight?: boolean
}

function Left({ project }: ProjectSummaryProps) {
  return (
    <div className="grow relative flex flex-col justify-between">
      <div className="mb-6 max-h-20 overflow-hidden">
        <Scores project={project} />
        <Tags queryData={project} tags={TAGS} />
      </div>
    </div>
  )
}

function Right({ project }: ProjectSummaryProps) {
  return (
    <div className="flex flex-col justify-between ml-4 max-w-[140px] min-w-[140px] w-[140px]">
      <div>
        <Author author={project.author} />
      </div>
    </div>
  )
}

function Bottom({ project }: ProjectSummaryProps) {
  const summary = React.useMemo(() => {
    let summary = project.content
    if (summary.length > 300) {
      summary = summary.substring(0, 300) + '…'
    }
    return markdownToPlainHtml(summary)
  }, [project.content])

  return (
    <Link href={`/project/${project.id}`}>
      <Heading2 className="cursor-pointer w-[95%] mb-6 whitespace-nowrap text-ellipsis overflow-hidden">
        {project.title}
      </Heading2>
      <HtmlView html={summary} />
    </Link>
  )
}

export const ProjectSummary = ({
  project,
  hideRight = false,
}: ProjectSummaryProps) => (
  <Card
    shadow="sm"
    p="lg"
    radius="md"
    withBorder
    className={project.hidden ? 'opacity-50' : ''}
  >
    {project.hidden && (
      <Banner className="mb-6 p-4">
        This project was hidden by the curators.
      </Banner>
    )}
    <div className="flex items-stretch">
      <Left project={project} />
      {!hideRight && <Right project={project} />}
    </div>
    <Bottom project={project} />
  </Card>
)
