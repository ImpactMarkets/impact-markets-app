import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { AuthorWithDate } from '@/components/author-with-date'
import { Avatar } from '@/components/avatar'
import { Banner } from '@/components/banner'
import { ButtonLink } from '@/components/button-link'
import { AddCommentForm } from '@/components/certificate/AddCommentForm'
import { CertificateMenu } from '@/components/certificate/CertificateMenu'
import { Comment } from '@/components/certificate/Comment'
import { Labels } from '@/components/certificate/Labels'
import { Ledger } from '@/components/certificate/Ledger'
import { Tags } from '@/components/certificate/Tags'
import { getCertificateQueryPathAndInput } from '@/components/certificate/utils'
import { Heading1 } from '@/components/heading-1'
import { HtmlView } from '@/components/html-view'
import { MessageIcon } from '@/components/icons'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/like-button'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const CertificatePage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const utils = trpc.useContext()
  const certificateQueryPathAndInput = getCertificateQueryPathAndInput(
    String(router.query.id)
  )
  const certificateQuery = trpc.useQuery(certificateQueryPathAndInput)
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

  if (certificateQuery.data) {
    if (!isNaN(Number(router.query.id))) {
      // Redirect from old to new certificate URLs
      router.push('/certificate/' + certificateQuery.data.id)
    }
    const isUserAdmin = session?.user.role === 'ADMIN'
    const certificateBelongsToUser =
      certificateQuery.data.author.id === session!.user.id

    return (
      <>
        <Head>
          <title>{certificateQuery.data.title} – Impact Markets</title>
        </Head>

        <div className="divide-y divide-primary">
          <div className="pb-12">
            {certificateQuery.data.hidden && (
              <Banner className="mb-6">
                This certificate will remain hidden until it’s published by the
                curators.
              </Banner>
            )}

            <div className="flex items-center justify-between gap-4">
              <Heading1>{certificateQuery.data.title}</Heading1>
              <CertificateMenu
                queryData={certificateQuery.data}
                isUserAdmin={isUserAdmin}
                certificateBelongsToUser={certificateBelongsToUser}
              />
            </div>
            <div className="my-6">
              <AuthorWithDate
                author={certificateQuery.data.author}
                date={certificateQuery.data.createdAt}
              />
            </div>
            <div className="my-6">
              <Labels queryData={certificateQuery.data} />
            </div>
            <div className="my-6">
              <Tags queryData={certificateQuery.data} />
            </div>
            <div className="my-6">
              <Ledger certificateId={String(router.query.id)} />
            </div>
            <HtmlView
              html={certificateQuery.data.contentHtml}
              className="mt-8"
            />
            <div className="flex gap-4 mt-6">
              <LikeButton
                likedBy={certificateQuery.data.likedBy}
                onLike={() => {
                  likeMutation.mutate(certificateQuery.data.id)
                }}
                onUnlike={() => {
                  unlikeMutation.mutate(certificateQuery.data.id)
                }}
              />
              <ButtonLink
                href={`/certificate/${certificateQuery.data.id}#comments`}
                variant="secondary"
              >
                <MessageIcon className="w-4 h-4 text-secondary" />
                <span className="ml-1.5">
                  {certificateQuery.data._count.comments}
                </span>
              </ButtonLink>
            </div>
          </div>

          <div id="comments" className="pt-12 space-y-12">
            {certificateQuery.data.comments.length > 0 && (
              <ul className="space-y-12">
                {certificateQuery.data.comments.map((comment) => (
                  <li key={comment.id}>
                    <Comment
                      certificateId={certificateQuery.data.id}
                      comment={comment}
                    />
                  </li>
                ))}
              </ul>
            )}
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
              <AddCommentForm certificateId={certificateQuery.data.id} />
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

CertificatePage.auth = true

CertificatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default CertificatePage
