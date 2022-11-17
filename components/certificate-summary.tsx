import * as fp from 'lodash/fp'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import * as React from 'react'

import { Banner } from '@/components/banner'
import { HoldingsChart } from '@/components/holdings-chart'
import { HeartFilledIcon, HeartIcon, MessageIcon } from '@/components/icons'
import { MAX_LIKED_BY_SHOWN } from '@/components/like-button'
import { classNames } from '@/lib/classnames'
import { InferQueryOutput } from '@/lib/trpc'
import { Card } from '@mantine/core'
import * as Tooltip from '@radix-ui/react-tooltip'

import { Author } from './author'
import { Tags } from './certificate/Tags'
import { sortAuthorFirst } from './certificate/utils'
import { Date } from './date'
import { Heading2 } from './heading-2'
import { HtmlView } from './html-view'

export type CertificateSummaryProps = {
  certificate: InferQueryOutput<'certificate.feed'>['certificates'][number]
  onLike?: () => void
  onUnlike?: () => void
}

function Left({ certificate }: CertificateSummaryProps) {
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

  let cert_summary = summary
  cert_summary = cert_summary.replace('<p>', '')
  cert_summary = cert_summary.replace('</p>', '')
  if (cert_summary.length > 300) {
    cert_summary = cert_summary.substring(0, 300) + '...'
  }

  return (
    <div className="grow">
      {certificate.tags && (
        <div className="mb-6">
          <Tags queryData={certificate} />
        </div>
      )}
      <div className={classNames(certificate.hidden ? 'opacity-50' : '')}>
        <Link href={`/certificate/${certificate.id}`}>
          <Heading2 className="cursor-pointer">{certificate.title}</Heading2>
        </Link>
        <Date date={certificate.createdAt} />
        <HtmlView html={cert_summary} className="mt-2" />
      </div>
      <div className="flex items-center gap-12 mt-6">
        <HoldingsChart certificate={certificate} />
      </div>
    </div>
  )
}

function Right({ certificate }: CertificateSummaryProps) {
  const { data: session } = useSession()

  const isLikedByCurrentUser = Boolean(
    certificate.likedBy.find((item: any) => item.user.id === session!.user.id)
  )
  const likeCount = certificate.likedBy.length

  return (
    <div className="flex flex-col justify-between max-w-[140px] min-w-[140px] w-[140px]">
      <div>
        {fp.flow(
          fp.map('user'),
          sortAuthorFirst(certificate.author),
          fp.map((user) => (
            <div key={user.id} className="mt-4">
              <Author author={user} />
            </div>
          ))
        )(certificate.issuers)}
      </div>
      <div className="flex justify-around h-8">
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
                    item.user.id === session!.user.id ? 'You' : item.user.name
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
  )
}

export const CertificateSummary = ({
  certificate,
}: CertificateSummaryProps) => (
  <Card shadow="sm" p="lg" radius="md" withBorder>
    {certificate.hidden && (
      <Banner className="mb-6">
        This certificate will remain hidden until it’s published by the
        curators.
      </Banner>
    )}
    <div
      className={classNames(
        'flex items-stretch',
        certificate.hidden ? 'opacity-50' : ''
      )}
    >
      <Left certificate={certificate} />
      <Right certificate={certificate} />
    </div>
  </Card>
)
