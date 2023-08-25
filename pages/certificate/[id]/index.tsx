import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { LoadingOverlay } from '@mantine/core'

import { AuthorWithDate } from '@/components/authorWithDate'
import { Banner } from '@/components/banner'
import { Labels } from '@/components/certificate/labels'
import { Ledger } from '@/components/certificate/ledger'
import { Menu } from '@/components/certificate/menu'
import { Heading1 } from '@/components/heading1'
import { HtmlView } from '@/components/htmlView'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/likeButton'
import { TAGS } from '@/components/project/tags'
import { Tags } from '@/components/tags'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

// TODO: Maybe this could be made into a generic component?
const CertificatePageWrapper: NextPageWithAuthAndLayout = () => {
  const router = useRouter()

  if (!router.isReady) {
    return <LoadingOverlay visible />
  } else if (typeof router.query.id !== 'string') {
    return <p>Invalid certificate id: {router.query.id}</p>
  } else {
    return <CertificatePage certificateId={router.query.id} />
  }
}

function CertificatePage({ certificateId }: { certificateId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const utils = trpc.useContext()
  const certificateQuery = trpc.certificate.detail.useQuery({
    id: certificateId,
  })
  const certificate = certificateQuery.data
  const likeMutation = trpc.certificate.like.useMutation({
    onSettled: () => {
      return utils.certificate.detail.invalidate({ id: certificateId })
    },
  })
  const unlikeMutation = trpc.certificate.unlike.useMutation({
    onSettled: () => {
      return utils.certificate.detail.invalidate({ id: certificateId })
    },
  })

  if (certificate) {
    if (!isNaN(Number(certificateId))) {
      // Redirect from old to new certificate URLs
      router.push('/certificate/' + certificate.id)
    }
    const isUserAdmin = session?.user.role === 'ADMIN'
    const certificateBelongsToUser = certificate.author.id === session?.user.id
    const isActive = certificate.actionEnd > new Date()

    return (
      <>
        <Head>
          <title>{certificate.title} – Impact Markets</title>
        </Head>

        <div className="divide-y divide-primary max-w-screen-lg mx-auto">
          <div className="pb-12">
            {certificate.hidden && (
              <Banner className="mb-6">
                This project was hidden by the curators.
              </Banner>
            )}

            <div className="flex items-center justify-between gap-4">
              <Heading1>{certificate.title}</Heading1>
              <Menu
                queryData={certificate}
                isUserAdmin={isUserAdmin}
                belongsToUser={certificateBelongsToUser}
              />
            </div>
            <div className="my-6">
              <AuthorWithDate
                author={certificate.author}
                date={certificate.createdAt}
              />
            </div>
            <div className="flex flex-wrap gap-1 my-6">
              <Tags queryData={certificate} tags={TAGS} />
            </div>
            <div className="my-6">
              <Ledger certificate={certificate} isActive={isActive} />
            </div>
            <HtmlView html={certificate.contentHtml} className="mt-8" />
            <div className="my-6">
              <Labels queryData={certificate} />
            </div>
            <div className="flex gap-4 mt-6">
              <LikeButton
                disabled={!session}
                likedBy={certificate.likedBy}
                defaultTooltip="No likes yet"
                onLike={() => {
                  likeMutation.mutate(certificate.id)
                }}
                onUnlike={() => {
                  unlikeMutation.mutate(certificate.id)
                }}
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (certificateQuery.isError) {
    return <div>Error: {certificateQuery.error.message}</div>
  }

  return (
    <div className="animate-pulse">
      <div className="w-3/4 bg-gray-200 rounded h-9 dark:bg-gray-700" />
      <div className="flex items-center gap-4 mt-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700" />
        <div className="flex-1">
          <div className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="w-32 h-3 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
        </div>
      </div>
      <div className="space-y-3 mt-7">
        {[...Array(3)].map((_, idx) => (
          <React.Fragment key={idx}>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
            <div className="w-1/2 h-5 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-5 col-span-1 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-5 col-span-2 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
            <div className="w-3/5 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          </React.Fragment>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <div className="w-16 border rounded-full h-button border-secondary" />
        <div className="w-16 border rounded-full h-button border-secondary" />
      </div>
    </div>
  )
}

CertificatePageWrapper.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return <Layout>{page}</Layout>
}

export default CertificatePageWrapper
