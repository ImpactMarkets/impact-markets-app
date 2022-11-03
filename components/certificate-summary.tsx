import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
} from 'chart.js'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'
import { Bar } from 'react-chartjs-2'

import { Banner } from '@/components/banner'
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
import { User } from '@prisma/client'
import * as Tooltip from '@radix-ui/react-tooltip'

import { Author } from './author'
import { Date } from './date'
import { Heading2 } from './heading-2'
import { HtmlView } from './html-view'

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend)

// export const options = {
//   plugins: {
//     title: {
//       display: true,
//       text: 'Chart.js Bar Chart - Stacked',
//     },
//   },
//   responsive: true,
//   scales: {
//     x: {
//       stacked: true,
//     },
//     y: {
//       stacked: true,
//     },
//   },
// }

// const labels = ['Holdings']

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Holdings',
//       data: labels.map(() => [0, 4]),
//       backgroundColor: 'rgb(255, 99, 132)',
//     },
//   ],
// }

export type CertificateSummaryProps = {
  certificate: InferQueryOutput<'certificate.feed'>['certificates'][number]
  hideAuthor?: boolean
  onLike: () => void
  onUnlike: () => void
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

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <div>
        {certificate.hidden && (
          <Banner className="mb-6">
            This certificate will remain hidden until it’s published by the
            curators.
          </Banner>
        )}
        <div
          style={{
            display: 'inline-block',
            width: '80%',
            verticalAlign: 'top',
          }}
          className={classNames(certificate.hidden ? 'opacity-50' : '')}
        >
          <Link href={`/certificate/${certificate.id}`}>
            <a style={{ display: 'inline-block', width: '60%' }}>
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
        <div className="flex items-center gap-4 mt-4">
          <StackedBarChart />
          <div className="ml-auto flex gap-6" style={{ marginRight: '1%' }}>
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
