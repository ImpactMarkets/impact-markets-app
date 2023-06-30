import * as fp from 'lodash/fp'
import Link from 'next/link'
import * as React from 'react'

import { Banner } from '@/components/banner'
import { HoldingsChart } from '@/components/certificate/holdingsChart'
import { LikeButton } from '@/components/likeButton'
import { classNames } from '@/lib/classnames'
import { InferQueryOutput } from '@/lib/trpc'
import { Card } from '@mantine/core'

import { Author } from '../author'
import { Date } from '../date'
import { Heading2 } from '../heading2'
import { TAGS } from '../project/tags'
import { Tags } from '../tags'
import { sortAuthorFirst } from '../utils'

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
    <div className="grow relative flex flex-col justify-between max-w-[calc(100%-140px-1rem)]">
      {certificate.tags && (
        <div className="mb-6 max-h-10 overflow-hidden">
          <Tags queryData={certificate} tags={TAGS} />
        </div>
      )}
      <div className={classNames(certificate.hidden ? 'opacity-50' : '')}>
        <Link href={`/certificate/${certificate.id}`}>
          <Heading2 className="cursor-pointer w-[95%] whitespace-nowrap text-ellipsis overflow-hidden">
            {certificate.title}
          </Heading2>
        </Link>
        <Date date={certificate.createdAt} />
      </div>
      <div className="flex items-center gap-12 mt-6">
        <HoldingsChart
          holdings={certificate.holdings}
          issuers={certificate.issuers}
        />
      </div>
    </div>
  )
}

function Right({ certificate }: CertificateSummaryProps) {
  return (
    <div className="flex flex-col justify-between ml-4 max-w-[140px] min-w-[140px] w-[140px]">
      <div>
        {fp.flow(
          fp.map('user'),
          sortAuthorFirst(certificate.author),
          fp.map((user) => (
            <div key={user.id}>
              <Author author={user} />
            </div>
          ))
        )(certificate.issuers)}
      </div>
      <div className="flex justify-around h-8">
        <LikeButton
          likedBy={certificate.likedBy}
          tooltip={'No likes yet'}
          disabled
        />
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
