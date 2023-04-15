import Link from 'next/link'
import * as React from 'react'

import { Banner } from '@/components/banner'
import { LikeButton } from '@/components/likeButton'
import { classNames } from '@/lib/classnames'
import { InferQueryOutput } from '@/lib/trpc'
import { Card } from '@mantine/core'

import { Author } from '../author'
import { CommentButton } from '../commentButton'
import { Date } from '../date'
import { Heading2 } from '../heading2'
import { Tags } from '../tags'

export type SummaryProps = {
  bounty: InferQueryOutput<'bounty.feed'>['bounties'][number]
  onLike?: () => void
  onUnlike?: () => void
}

function Left({ bounty }: SummaryProps) {
  const contentDocument = React.useMemo(
    () => new DOMParser().parseFromString(bounty.contentHtml, 'text/html'),
    [bounty.contentHtml]
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
      {bounty.tags && (
        <div className="mb-6 max-h-10 overflow-hidden">
          <Tags queryData={bounty} />
        </div>
      )}
      <div className={classNames(bounty.hidden ? 'opacity-50' : '')}>
        <Link href={`/bounty/${bounty.id}`}>
          <Heading2 className="cursor-pointer w-[95%] whitespace-nowrap text-ellipsis overflow-hidden">
            {bounty.title}
          </Heading2>
        </Link>
        <Date date={bounty.createdAt} />
      </div>
      <div className="flex items-center gap-12 mt-6">{/* Donor chart */}</div>
    </div>
  )
}

function Right({ bounty }: SummaryProps) {
  return (
    <div className="flex flex-col justify-between ml-4 max-w-[140px] min-w-[140px] w-[140px]">
      <div>
        <Author author={bounty.author} />
      </div>
      <div className="flex justify-around h-8">
        <LikeButton likedBy={bounty.likedBy} disabled />
        <CommentButton commentCount={bounty._count.comments} disabled />
      </div>
    </div>
  )
}

export const BountySummary = ({ bounty }: SummaryProps) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    {bounty.hidden && (
      <Banner className="mb-6">
        This bounty will remain hidden until it’s published by the curators.
      </Banner>
    )}
    <div
      className={classNames(
        'flex items-stretch',
        bounty.hidden ? 'opacity-50' : ''
      )}
    >
      <Left bounty={bounty} />
      <Right bounty={bounty} />
    </div>
  </Card>
)
