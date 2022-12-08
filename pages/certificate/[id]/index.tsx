import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { AuthorWithDate } from '@/components/author-with-date'
import { Avatar } from '@/components/avatar'
import { Banner } from '@/components/banner'
import { AddCommentForm } from '@/components/certificate/AddCommentForm'
import { CertificateMenu } from '@/components/certificate/CertificateMenu'
import { Comment } from '@/components/certificate/Comment'
import { Labels } from '@/components/certificate/Labels'
import { Ledger } from '@/components/certificate/Ledger'
import { Tags } from '@/components/certificate/Tags'
import { getCertificateQueryPathAndInput } from '@/components/certificate/utils'
import { CommentButton } from '@/components/comment-button'
import { Heading1 } from '@/components/heading-1'
import { HtmlView } from '@/components/html-view'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/like-button'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { LoadingOverlay } from '@mantine/core'

// TODO: Maybe this could be made into a generic component ?
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
  const certificateQueryPathAndInput =
    getCertificateQueryPathAndInput(certificateId)
  const certificateQuery = trpc.useQuery(certificateQueryPathAndInput)
  const certificate = certificateQuery.data
  const likeMutation = trpc.useMutation(['certificate.like'], {
    onMutate: async () => {
      await utils.cancelQuery(certificateQueryPathAndInput)

      const previousCertificate = utils.getQueryData(
        certificateQueryPathAndInput
      )

      if (previousCertificate) {
        utils.setQueryData(certificateQueryPathAndInput, {
          ...previousCertificate,
          likedBy: [
            ...previousCertificate.likedBy,
            { user: { id: session!.user.id, name: session!.user.name } },
          ],
        })
      }

      return { previousCertificate }
    },
    onError: (err, id, context: any) => {
      if (context?.previousCertificate) {
        utils.setQueryData(
          certificateQueryPathAndInput,
          context.previousCertificate
        )
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['certificate.unlike'], {
    onMutate: async () => {
      await utils.cancelQuery(certificateQueryPathAndInput)

      const previousCertificate = utils.getQueryData(
        certificateQueryPathAndInput
      )

      if (previousCertificate) {
        utils.setQueryData(certificateQueryPathAndInput, {
          ...previousCertificate,
          likedBy: previousCertificate.likedBy.filter(
            (item) => item.user.id !== session!.user.id
          ),
        })
      }

      return { previousCertificate }
    },
    onError: (err, id, context: any) => {
      if (context?.previousCertificate) {
        utils.setQueryData(
          certificateQueryPathAndInput,
          context.previousCertificate
        )
      }
    },
  })

  if (certificate) {
    if (!isNaN(Number(certificateId))) {
      // Redirect from old to new certificate URLs
      router.push('/certificate/' + certificate.id)
    }
    const isUserAdmin = session?.user.role === 'ADMIN'
    const certificateBelongsToUser = certificate.author.id === session?.user.id

    return (
      <>
        <Head>
          <title>{certificate.title} – Impact Markets</title>
        </Head>

        <div className="divide-y divide-primary">
          <div className="pb-12">
            {certificate.hidden && (
              <Banner className="mb-6">
                This certificate will remain hidden until it’s published by the
                curators.
              </Banner>
            )}

            <div className="flex items-center justify-between gap-4">
              <Heading1>{certificate.title}</Heading1>
              <CertificateMenu
                queryData={certificate}
                isUserAdmin={isUserAdmin}
                certificateBelongsToUser={certificateBelongsToUser}
              />
            </div>
            <div className="my-6">
              <AuthorWithDate
                author={certificate.author}
                date={certificate.createdAt}
              />
            </div>
            <div className="my-6">
              <Tags queryData={certificate} />
            </div>
            <div className="my-6">
              <Ledger certificate={certificate} />
            </div>
            <HtmlView html={certificate.contentHtml} className="mt-8" />
            <div className="my-6">
              <Labels queryData={certificate} />
            </div>
            <div className="flex gap-4 mt-6">
              <LikeButton
                disabled={!session}
                likedBy={certificate.likedBy}
                onLike={() => {
                  likeMutation.mutate(certificate.id)
                }}
                onUnlike={() => {
                  unlikeMutation.mutate(certificate.id)
                }}
              />
              <CommentButton
                commentCount={certificate._count.comments}
                href={`/certificate/${certificate.id}#comments`}
                variant="secondary"
                disabled={!session}
              />
            </div>
          </div>

          <div id="comments" className="pt-12 space-y-12">
            {certificate.comments.length > 0 && (
              <ul className="space-y-12">
                {certificate.comments.map((comment) => (
                  <li key={comment.id}>
                    <Comment certificateId={certificate.id} comment={comment} />
                  </li>
                ))}
              </ul>
            )}
            {session && (
              <div className="flex items-start gap-2 sm:gap-4">
                <span className="hidden sm:inline-block">
                  <Avatar name={session!.user.name} src={session!.user.image} />
                </span>
                <span className="inline-block sm:hidden">
                  <Avatar
                    name={session!.user.name}
                    src={session!.user.image}
                    size="sm"
                  />
                </span>
                <AddCommentForm certificateId={certificate.id} />
              </div>
            )}
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
  page: React.ReactElement
) {
  return <Layout>{page}</Layout>
}

export default CertificatePageWrapper
