import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { AuthorWithDate } from '@/components/authorWithDate'
import { Avatar } from '@/components/avatar'
import { Banner } from '@/components/banner'
import { Menu } from '@/components/bounty/menu'
import { TAGS } from '@/components/bounty/tags'
import { colors } from '@/components/colors'
import { AddCommentForm } from '@/components/comment/addCommentForm'
import { Comment } from '@/components/comment/comment'
import { CommentButton } from '@/components/commentButton'
import { Heading1 } from '@/components/heading1'
import { HtmlView } from '@/components/htmlView'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/likeButton'
import { Status } from '@/components/status'
import { Tags } from '@/components/tags'
import { capitalize, num } from '@/lib/text'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { LoadingOverlay, Tabs } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons'

// TODO: Maybe this could be made into a generic component ?
const BountyPageWrapper: NextPageWithAuthAndLayout = () => {
  const router = useRouter()

  if (!router.isReady) {
    return <LoadingOverlay visible />
  } else if (typeof router.query.id !== 'string') {
    return <p>Invalid bounty id: {router.query.id}</p>
  } else {
    return <BountyPage bountyId={router.query.id} />
  }
}

function BountyPage({ bountyId }: { bountyId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const utils = trpc.useContext()
  const bountyQueryPathAndInput: InferQueryPathAndInput<'bounty.detail'> = [
    'bounty.detail',
    {
      id: bountyId,
    },
  ]
  const bountyQuery = trpc.useQuery(bountyQueryPathAndInput)
  const bounty = bountyQuery.data

  const likeMutation = trpc.useMutation(['bounty.like'], {
    onMutate: async () => {
      await utils.cancelQuery(bountyQueryPathAndInput)

      const previousBounty = utils.getQueryData(bountyQueryPathAndInput)

      if (previousBounty) {
        utils.setQueryData(bountyQueryPathAndInput, {
          ...previousBounty,
          likedBy: [
            ...previousBounty.likedBy,
            { user: { id: session!.user.id, name: session!.user.name } },
          ],
        })
      }

      return { previousBounty }
    },
    onError: (err, id, context: any) => {
      if (context?.previousBounty) {
        utils.setQueryData(bountyQueryPathAndInput, context.previousBounty)
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['bounty.unlike'], {
    onMutate: async () => {
      await utils.cancelQuery(bountyQueryPathAndInput)

      const previousBounty = utils.getQueryData(bountyQueryPathAndInput)

      if (previousBounty) {
        utils.setQueryData(bountyQueryPathAndInput, {
          ...previousBounty,
          likedBy: previousBounty.likedBy.filter(
            (item) => item.user.id !== session!.user.id
          ),
        })
      }

      return { previousBounty }
    },
    onError: (err, id, context: any) => {
      if (context?.previousBounty) {
        utils.setQueryData(bountyQueryPathAndInput, context.previousBounty)
      }
    },
  })

  if (bounty) {
    if (!isNaN(Number(bountyId))) {
      // Redirect from old to new bounty URLs
      router.push('/bounty/' + bounty.id)
    }
    const isUserAdmin = session?.user.role === 'ADMIN'
    const bountyBelongsToUser = bounty.author.id === session?.user.id

    return (
      <>
        <Head>
          <title>
            {bounty.status === 'CLOSED' ? '[Closed] ' : null}
            {bounty.status !== 'CLOSED' && bounty.size
              ? '$' + num(bounty.size) + ': '
              : ''}
            {bounty.title} – Impact Markets
          </title>
        </Head>
        <div className="max-w-screen-lg mx-auto">
          <div className="pb-12">
            {bounty.hidden && (
              <Banner className="mb-6">
                This bounty was hidden by the curators.
              </Banner>
            )}

            <div className="flex items-center justify-between gap-4">
              <Heading1>
                <span className="text-gray-500">
                  {bounty.status === 'CLOSED' ? '[Closed] ' : null}
                  {bounty.status !== 'CLOSED' && bounty.size
                    ? `$${num(bounty.size)}: `
                    : ''}
                </span>
                {bounty.title}
              </Heading1>
              <Menu
                queryData={bounty}
                isUserAdmin={isUserAdmin}
                belongsToUser={bountyBelongsToUser}
              />
            </div>
            <div className="flex justify-between my-6">
              <AuthorWithDate
                author={bounty.author}
                date={bounty.deadline || bounty.createdAt}
                dateLabel={bounty.deadline ? 'Deadline' : 'Created'}
              />

              <div>
                {bounty.sourceUrl && (
                  <a
                    className="text-sm text-secondary inline-block max-w-60 whitespace-nowrap overflow-hidden overflow-ellipsis"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={bounty.sourceUrl}
                  >
                    <IconExternalLink className="inline h-5 align-text-bottom" />{' '}
                    More information
                  </a>
                )}
                <Status
                  color={colors[bounty.status]}
                  status={capitalize(bounty.status.toLowerCase())}
                />
              </div>
            </div>
            <div className="flex my-6">
              <Tags queryData={bounty} tags={TAGS} />
            </div>
            <HtmlView html={bounty.contentHtml} className="mt-8" />
            <div className="flex gap-4 mt-6">
              <LikeButton
                disabled={!session}
                likedBy={bounty.likedBy}
                label="interested"
                defaultTooltip="No expressions of interest yet"
                onLike={() => {
                  likeMutation.mutate(bounty.id)
                }}
                onUnlike={() => {
                  unlikeMutation.mutate(bounty.id)
                }}
              />
              <CommentButton
                commentCount={bounty._count.comments}
                href={`/bounty/${bounty.id}#comments`}
                variant="secondary"
                disabled={!session}
              />
            </div>
          </div>

          <Tabs defaultValue="questions-and-answers">
            <Tabs.List>
              <Tabs.Tab value="questions-and-answers">
                Questions and answers
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="questions-and-answers" pt="xs">
              <div id="comments" className="pt-6 space-y-12">
                {bounty.comments.length > 0 ? (
                  <ul className="space-y-12">
                    {bounty.comments.map((comment) => (
                      <li key={comment.id}>
                        <Comment
                          objectId={bounty.id}
                          objectType="bounty"
                          comment={comment}
                        />

                        <div id="replies" className="pt-12 pl-14 space-y-12">
                          {comment.children.length > 0 && (
                            <ul className="space-y-12">
                              {comment.children.map((reply) => (
                                <li key={reply.id}>
                                  <Comment
                                    objectId={bounty.id}
                                    objectType="bounty"
                                    comment={reply}
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pb-6 text-sm">No comments yet</p>
                )}
                {session && (
                  <div className="flex items-start gap-2 sm:gap-4">
                    <span className="hidden sm:inline-block">
                      <Avatar
                        name={session!.user.name}
                        src={session!.user.image}
                      />
                    </span>
                    <span className="inline-block sm:hidden">
                      <Avatar
                        name={session!.user.name}
                        src={session!.user.image}
                        size="sm"
                      />
                    </span>
                    <AddCommentForm objectId={bounty.id} objectType="bounty" />
                  </div>
                )}
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </>
    )
  }

  if (bountyQuery.isError) {
    return <div>Error: {bountyQuery.error.message}</div>
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

BountyPageWrapper.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default BountyPageWrapper
