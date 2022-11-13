import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'
import { Bar } from 'react-chartjs-2'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

import { Banner } from '@/components/banner'
import { ListIcon } from '@/components/icons'
import {
  ChevronRightIcon,
  HeartFilledIcon,
  HeartIcon,
  MessageIcon,
} from '@/components/icons'
import { MAX_LIKED_BY_SHOWN } from '@/components/like-button'
import { StackedBarChart } from '@/components/stacked-bar-chart'
import { classNames } from '@/lib/classnames'
import { InferQueryOutput } from '@/lib/trpc'
import { Card } from '@mantine/core'
import * as Tooltip from '@radix-ui/react-tooltip'

import { Author } from './author'
import { Tags } from './certificate/Tags'
import { Date } from './date'
import { Heading2 } from './heading-2'
import { HtmlView } from './html-view'
import { MockListIcon } from './list-icon'

export type CertificateSummaryProps = {
  certificate: InferQueryOutput<'certificate.feed'>['certificates'][number]
  hideAuthor?: boolean
  onLike: () => void
  onUnlike: () => void
}

const mockData = {
  data: [
    {
      label: 'Available',
      count: '55',
      part: 55,
      color: '#47d6ab',
    },
    {
      label: 'Consumed',
      count: '25',
      part: 25,
      color: '#03141a',
    },
    {
      label: 'Reserved',
      count: '20',
      part: 20,
      color: '#4fcdf7',
    },
  ],
}

export function CertificateSummary({
  certificate,
  hideAuthor = false,
}: CertificateSummaryProps) {
  const contentDocument = React.useMemo(
    () => new DOMParser().parseFromString(certificate.contentHtml, 'text/html'),
    [certificate.contentHtml]
  )
  //   TODO: decide on the order of the allowed tags
  //   and research on how to truncate html to a max amount of characters
  const summary = React.useMemo(() => {
    const allowedTags = ['p', 'ul', 'ol', 'h3', 'pre', 'img']

    for (const tag of allowedTags) {
      const element = contentDocument.body.querySelector(tag)
      if (element) {
        return element.outerHTML
      }
    }

    return "<p>Summary couldn't be generated</p>"
  }, [contentDocument])
  const hasMoreContent = React.useMemo(
    () => contentDocument.body.children.length > 1,
    [contentDocument]
  )

  const { data: session } = useSession()

  const isLikedByCurrentUser = Boolean(
    certificate.likedBy.find((item: any) => item.user.id === session!.user.id)
  )
  const likeCount = certificate.likedBy.length

  let cert_summary = summary
  cert_summary = cert_summary.replace('<p>', '')
  cert_summary = cert_summary.replace('</p>', '')
  if (cert_summary.length > 300) {
    cert_summary = cert_summary.substring(0, 300) + '...'
  }

  const css = `
  .actions li {
    display: inline;
    list-style-type: none;
    padding-right: 5px;
    font-size: 1.2em;
  }
  `

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <style>{css}</style>
      {certificate.hidden && (
        <Banner className="mb-6">
          This certificate will remain hidden until it’s published by the
          curators.
        </Banner>
      )}
      <div className={classNames(certificate.hidden ? 'opacity-50' : '')}>
        {certificate.tags && (
          <div className="my-6">
            <Tags queryData={certificate} />
          </div>
        )}

        <span className="actions">
          <ul>
            <li>
              {MockListIcon('First', <FaHeart style={{ display: 'inline' }} />)}
            </li>
            <li>
              <li>
                {MockListIcon(
                  'Second',
                  <FaRegHeart style={{ display: 'inline', marginLeft: '10' }} />
                )}
              </li>
            </li>
            <li>
              <li>
                {MockListIcon(
                  'Third',
                  <FaHeart style={{ display: 'inline', marginLeft: '10' }} />
                )}
              </li>
            </li>
          </ul>
        </span>
        <div
          style={{
            display: 'inline-block',
            width: '80%',
            verticalAlign: 'bottom',
          }}
          className={classNames(certificate.hidden ? 'opacity-50' : '')}
        >
          <Link href={`/certificate/${certificate.id}`}>
            <a style={{ display: 'inline-block', width: '85%' }}>
              <Heading2>{certificate.title}</Heading2>
            </a>
          </Link>
          <Date date={certificate.createdAt} />
          <HtmlView
            html={cert_summary}
            className={hideAuthor ? 'mt-4' : 'mt-2'}
          />
        </div>
        <div
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
          }}
          className={classNames(hideAuthor ? 'mt-2' : 'mt-4')}
        >
          {hideAuthor ? (
            <p className="text-secondary">
              <time dateTime={certificate.createdAt.toISOString()}>
                {formatDistanceToNow(certificate.createdAt)}
              </time>{' '}
              ago
            </p>
          ) : (
            <Author author={certificate.author} />
          )}
        </div>
        <div className="flex items-center gap-4 mt-4">
          {hasMoreContent && (
            <Link href={`/certificate/${certificate.id}`}>
              <a className="inline-flex items-center font-medium transition-colors text-blue">
                Continue reading <ChevronRightIcon className="w-4 h-4 ml-1" />
              </a>
            </Link>
          )}
        </div>
        <div className="flex items-center gap-12 mt-6">
          <StackedBarChart data={mockData.data} />
          <div
            className="flex gap-8"
            style={{
              position: 'absolute',
              bottom: '8%',
              right: '5%',
            }}
          >
            <Tooltip.Provider>
              <Tooltip.Root delayDuration={300}>
                <Tooltip.Trigger
                  asChild
                  onClick={(event) => {
                    event.preventDefault()
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                  }}
                >
                  <div className="inline-flex items-center gap-1.5">
                    {isLikedByCurrentUser ? (
                      <HeartFilledIcon className="w-4 h-4 text-red" />
                    ) : (
                      <HeartIcon className="w-4 h-4 text-red" />
                    )}
                    <span className="text-sm font-semibold tabular-nums">
                      {likeCount}
                    </span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Content
                  side="bottom"
                  sideOffset={4}
                  className={classNames(
                    'max-w-[260px] px-3 py-1.5 rounded shadow-lg bg-secondary-inverse text-secondary-inverse sm:max-w-sm',
                    likeCount === 0 && 'hidden'
                  )}
                >
                  <p className="text-sm">
                    {certificate.likedBy
                      .slice(0, MAX_LIKED_BY_SHOWN)
                      .map((item: any) =>
                        item.user.id === session!.user.id
                          ? 'You'
                          : item.user.name
                      )
                      .join(', ')}
                    {likeCount > MAX_LIKED_BY_SHOWN &&
                      ` and ${likeCount - MAX_LIKED_BY_SHOWN} more`}
                  </p>
                  <Tooltip.Arrow
                    offset={22}
                    className="fill-gray-800 dark:fill-gray-50"
                  />
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>

            <div className="inline-flex items-center gap-1.5">
              <MessageIcon className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold tabular-nums">
                {certificate._count.comments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
