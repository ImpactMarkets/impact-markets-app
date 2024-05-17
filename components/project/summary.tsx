import Link from 'next/link'
import * as React from 'react'

import { Card } from '@mantine/core'

import { markdownToPlainHtml } from '@/lib/editor'
import { RouterOutput } from '@/lib/trpc'

import { Author } from '../author'
import { FundingProgress } from '../fundingProgress'
import { Heading2 } from '../heading2'
import { HtmlView } from '../htmlView'
import { Scores } from '../scores'
import { Tags } from '../tags'
import { TAGS } from './tags'

export type ProjectSummaryProps = {
  project: RouterOutput['project']['feed']['projects'][number]
  hideRight?: boolean
}

function Left({ project }: ProjectSummaryProps) {
  return (
    <div className="flex grow flex-wrap gap-1 mb-6">
      <Scores project={project} />
      <Tags queryData={project} tags={TAGS} />
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
  console.log(project.fundingGoal)
  console.log(project.quarterDonationTotal)
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
      {project.fundingGoal &&
      project.fundingGoal.toNumber() > 0 &&
      project.quarterDonationTotal ? (
        <FundingProgress
          quarterDonationTotal={project.quarterDonationTotal.toString()}
          fundingGoal={project.fundingGoal.toString()}
          classNames={{
            label: 'text-sm',
            root: 'h-2 rounded mt-1',
          }}
          showLabels={false}
        />
      ) : (
        ''
      )}
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
    <div className="flex items-stretch">
      <Left project={project} />
      {!hideRight && <Right project={project} />}
    </div>
    <Bottom project={project} />
  </Card>
)
