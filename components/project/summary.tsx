import Link from 'next/link'
import * as React from 'react'

import { Banner } from '@/components/banner'
import { LikeButton } from '@/components/likeButton'
import { classNames } from '@/lib/classnames'
import { InferQueryOutput } from '@/lib/trpc'
import { Card } from '@mantine/core'

import { Author } from '../author'
import { CommentButton } from '../commentButton'
import { Heading2 } from '../heading2'
import { Tags } from '../tags'
import { TAGS } from './tags'

export type ProjectSummaryProps = {
  project: InferQueryOutput<'project.feed'>['projects'][number]
  onLike?: () => void
  onUnlike?: () => void
}

function Left({ project }: ProjectSummaryProps) {
  const contentDocument = React.useMemo(
    () => new DOMParser().parseFromString(project.contentHtml, 'text/html'),
    [project.contentHtml]
  )
  //   TODO: decide on the order of the allowed tags
  //   and research on how to truncate html to a max amount of characters
  let summary = React.useMemo(() => {
    const allowedTags = ['p', 'ul', 'ol', 'h3', 'pre', 'img']

    for (const tag of allowedTags) {
      const element = contentDocument.body.querySelector(tag)
      if (element) {
        return element.outerHTML
      }
    }

    return "<p>Summary couldn't be generated</p>"
  }, [contentDocument])

  summary = summary.replace('<p>', '')
  summary = summary.replace('</p>', '')
  if (summary.length > 300) {
    summary = summary.substring(0, 300) + '...'
  }

  return (
    <div className="grow relative flex flex-col justify-between max-w-[calc(100%-140px-1rem)]">
      {project.tags && (
        <div className="mb-6 max-h-10 overflow-hidden">
          <Tags queryData={project} tags={TAGS} />
        </div>
      )}
      <div className={classNames(project.hidden ? 'opacity-50' : '')}>
        <Link href={`/project/${project.id}`}>
          <Heading2 className="cursor-pointer w-[95%] whitespace-nowrap text-ellipsis overflow-hidden">
            {project.title}
          </Heading2>
        </Link>
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
      <div className="flex justify-around h-8">
        <LikeButton
          likedBy={project.likedBy}
          tooltip={'No likes yet'}
          disabled
        />
        <CommentButton commentCount={project._count.comments} disabled />
      </div>
    </div>
  )
}

export const ProjectSummary = ({ project }: ProjectSummaryProps) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    {project.hidden && (
      <Banner className="mb-6 p-4">
        This project was hidden by the curators.
      </Banner>
    )}
    <div
      className={classNames(
        'flex items-stretch',
        project.hidden ? 'opacity-50' : ''
      )}
    >
      <Left project={project} />
      <Right project={project} />
    </div>
  </Card>
)
