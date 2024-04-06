import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { SuperSEO } from 'react-super-seo'

import { LoadingOverlay, Tabs } from '@mantine/core'
import { CommentType } from '@prisma/client'
import { IconExternalLink } from '@tabler/icons-react'

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
import { PageLoader } from '@/components/utils'
import { capitalize, num } from '@/lib/text'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

// TODO: Maybe this could be made into a generic component?
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
  const bountyQuery = trpc.bounty.detail.useQuery({ id: bountyId })
  const bounty = bountyQuery.data

  const likeMutation = trpc.bounty.like.useMutation({
    onSettled: () => {
      return utils.bounty.detail.invalidate({ id: bountyId })
    },
  })
  const unlikeMutation = trpc.bounty.unlike.useMutation({
    onSettled: () => {
      return utils.bounty.detail.invalidate({ id: bountyId })
    },
  })

  if (bounty) {
    if (!isNaN(Number(bountyId))) {
      // Redirect from old to new bounty URLs
      router.push('/bounty/' + bounty.id)
    }
    const isUserAdmin = session?.user.role === 'ADMIN'
    const bountyBelongsToUser = bounty.author.id === session?.user.id

    const CommentPanel = ({ category }: { category: CommentType }) => {
      // CURRENTLY UNFILTERED BY CATEGORY
      // if you decide to add tabs, take filteredComments code from project page

      return (
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
                <Avatar name={session!.user.name} src={session!.user.image} />
              </span>
              <span className="inline-block sm:hidden">
                <Avatar
                  name={session!.user.name}
                  src={session!.user.image}
                  size="sm"
                />
              </span>
              <AddCommentForm
                objectId={bounty.id}
                objectType="bounty"
                category={category}
              />
            </div>
          )}
        </div>
      )
    }
    return (
      <>
        <Head>
          {/* https://stackoverflow.com/questions/75875037 */}
          <title>
            {`${bounty.status === 'CLOSED' ? '[Closed] ' : ''}
            ${
              bounty.status !== 'CLOSED' && bounty.size
                ? '$' + num(bounty.size) + ': '
                : ''
            }
            ${bounty.title} – GiveWiki`}
          </title>
        </Head>

        <SuperSEO
          title={`${bounty.title} – GiveWiki`}
          description={bounty.contentHtml}
          lang="en"
          openGraph={{
            ogImage: {
              ogImage: 'https://ai.givewiki.org/images/logo-light.svg',
              ogImageAlt: 'GiveWiki logo',
              ogImageWidth: 550,
              ogImageHeight: 232,
              ogImageType: 'image/jpeg',
            },
          }}
          twitter={{
            twitterSummaryCard: {
              summaryCardImage: 'https://ai.givewiki.org/images/logo-light.svg',
              summaryCardImageAlt: 'GiveWiki logo',
              // summaryCardSiteUsername: "twitterUsername",
            },
          }}
        />

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
            <div className="flex flex-wrap gap-1 my-6">
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

          <Tabs defaultValue="Q_AND_A">
            <Tabs.List>
              <Tabs.Tab value="Q_AND_A">Questions and answers</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={CommentType.Q_AND_A} pt="xs">
              <CommentPanel category={CommentType.Q_AND_A} />
            </Tabs.Panel>
          </Tabs>
        </div>
      </>
    )
  }

  if (bountyQuery.isError) {
    return <div>Error: {bountyQuery.error.message}</div>
  }

  return <PageLoader />
}

BountyPageWrapper.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default BountyPageWrapper
