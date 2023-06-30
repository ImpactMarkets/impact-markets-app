import Link from 'next/link'
import * as React from 'react'

import { Banner } from '@/components/banner'
import { markdownToPlainHtml } from '@/lib/editor'
import { num } from '@/lib/text'
import { InferQueryOutput } from '@/lib/trpc'
import { Card, Tooltip } from '@mantine/core'

import { Author } from '../author'
import { Heading2 } from '../heading2'
import { HtmlView } from '../htmlView'
import { Tags } from '../tags'
import { TAGS } from './tags'

export type ProjectSummaryProps = {
  project: InferQueryOutput<'project.feed'>['projects'][number]
  onLike?: () => void
  onUnlike?: () => void
}

function Left({ project }: ProjectSummaryProps) {
  return (
    <div className="grow relative flex flex-col justify-between max-w-[calc(100%-140px-1rem)]">
      {project.tags && (
        <div className="mb-6 max-h-10 overflow-hidden">
          {project.supportScore && (
            <Tooltip label="The support score measures the buy-in from our top donors">
              <span className="border cursor-help text-highlight border-secondary bg-amber-500 font-bold text-xs px-1 py-[1px] mr-1 rounded">
                Support score: {num(project.supportScore.score, 0)}
              </span>
            </Tooltip>
          )}
          <Tags queryData={project} tags={TAGS} />
        </div>
      )}
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
    <>
      <Link href={`/project/${project.id}`}>
        <Heading2 className="cursor-pointer w-[95%] mb-6 whitespace-nowrap text-ellipsis overflow-hidden">
          {project.title}
        </Heading2>
      </Link>
      <HtmlView html={summary} />
    </>
  )
}

export const ProjectSummary = ({ project }: ProjectSummaryProps) => (
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
      <Right project={project} />
    </div>
    <Bottom project={project} />
  </Card>
)
