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
import { PageLoader } from '@/components/utils'
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

  React.useEffect(() => {
    if (certificate && !isNaN(Number(certificateId))) {
      // Redirect from old to new certificate URLs
      router.push('/certificate/' + certificate.id)
    }
  })

  if (certificate && isNaN(Number(certificateId))) {
    const isUserAdmin = session?.user.role === 'ADMIN'
    const certificateBelongsToUser = certificate.author.id === session?.user.id
    const isActive = certificate.actionEnd > new Date()

    return (
      <>
        <Head>
          {/* https://stackoverflow.com/questions/75875037 */}
          <title>{`${certificate.title} – GiveWiki`}</title>
        </Head>

        <div className="divide-y divide-primary max-w-screen-lg mx-auto">
          <div className="pb-12">
            {certificate.hidden && (
              <Banner className="mb-6">
                This certificate was hidden by the curators.
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

  return <PageLoader />
}

CertificatePageWrapper.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return <Layout>{page}</Layout>
}

export default CertificatePageWrapper
