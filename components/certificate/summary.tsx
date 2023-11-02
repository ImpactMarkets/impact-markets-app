import * as fp from 'lodash/fp'
import Link from 'next/link'
import * as React from 'react'

import { Card } from '@mantine/core'

import { Banner } from '@/components/banner'
import { HoldingsChart } from '@/components/certificate/holdingsChart'
import { classNames } from '@/lib/classnames'
import { RouterOutput } from '@/lib/trpc'

import { Author } from '../author'
import { Date } from '../date'
import { Heading2 } from '../heading2'
import { TAGS } from '../project/tags'
import { Tags } from '../tags'
import { sortAuthorFirst } from '../utils'

export type CertificateSummaryProps = {
  certificate: RouterOutput['certificate']['feed']['certificates'][number]
  onLike?: () => void
  onUnlike?: () => void
}

export const Left = ({ certificate }: CertificateSummaryProps) => (
  <div className="grow relative flex flex-col justify-between max-w-[calc(100%-140px-1rem)]">
    {certificate.tags && (
      <div className="flex flex-wrap gap-1 mb-6">
        <Tags queryData={certificate} tags={TAGS} />
      </div>
    )}
    <div className={classNames(certificate.hidden ? 'opacity-50' : '')}>
      <Link href={`/certificate/${certificate.id}`}>
        <Heading2 className="cursor-pointer w-[95%] whitespace-nowrap text-ellipsis overflow-hidden">
          {certificate.title}
        </Heading2>
      </Link>
      <Date date={certificate.createdAt} className="text-gray-500 text-sm" />
    </div>
  </div>
)

export const Right = ({ certificate }: CertificateSummaryProps) => (
  <div className="flex flex-col justify-between ml-4 max-w-[140px] min-w-[140px] w-[140px]">
    <div>
      {fp.flow(
        fp.map('user'),
        sortAuthorFirst(certificate.author),
        fp.map((user) => (
          <div key={user.id}>
            <Author author={user} />
          </div>
        )),
      )(certificate.issuers)}
    </div>
  </div>
)

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
        certificate.hidden ? 'opacity-50' : '',
      )}
    >
      <Left certificate={certificate} />
      <Right certificate={certificate} />
    </div>
    <div className="flex items-center gap-12 mt-6">
      <HoldingsChart
        holdings={certificate.holdings}
        issuers={certificate.issuers}
      />
    </div>
  </Card>
)
