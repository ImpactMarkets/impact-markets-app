import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { SuperSEO } from 'react-super-seo'

import { LoadingOverlay, Tabs } from '@mantine/core'
import { CommentType } from '@prisma/client'
import {
  IconCreditCard,
  IconCreditCardOff,
  IconMoneybag,
  IconWoman,
} from '@tabler/icons-react'

import { AuthorWithDate } from '@/components/authorWithDate'
import { Avatar } from '@/components/avatar'
import { Banner } from '@/components/banner'
import { buttonClasses } from '@/components/button'
import { AddCommentForm } from '@/components/comment/addCommentForm'
import { Comment } from '@/components/comment/comment'
import { CommentButton } from '@/components/commentButton'
import { Heading1 } from '@/components/heading1'
import { HtmlView } from '@/components/htmlView'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/likeButton'
import { IncomingDonations } from '@/components/project/incomingDonations'
import { Menu } from '@/components/project/menu'
import { OutboundDonations } from '@/components/project/outboundDonations'
import { TAGS } from '@/components/project/tags'
import { TopContributors } from '@/components/project/topContributors'
import { Scores } from '@/components/scores'
import { Tags } from '@/components/tags'
import { PageLoader } from '@/components/utils'
import { classNames } from '@/lib/classnames'
import { num } from '@/lib/text'
import { RouterOutput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

// TODO: Maybe this could be made into a generic component?
const ProjectPageWrapper: NextPageWithAuthAndLayout = () => {
  const router = useRouter()

  if (!router.isReady) {
    return <LoadingOverlay visible />
  } else if (typeof router.query.id !== 'string') {
    return <p>Invalid project id: {router.query.id}</p>
  } else {
    return <ProjectPage projectId={router.query.id} />
  }
}

const CommentPanel = ({
  comments,
  category,
  objectId,
}: {
  comments: RouterOutput['project']['detail']['comments']
  category: CommentType
  objectId: string
}) => {
  const { data: session } = useSession()
  const filteredComments = comments.filter(
    (comment) => comment.category === category,
  )

  return (
    <div id="comments" className="pt-6 space-y-12">
      {filteredComments.length > 0 ? (
        <ul className="space-y-12">
          {filteredComments.map((comment) => (
            <li key={comment.id}>
              <Comment
                objectId={objectId}
                objectType="project"
                comment={comment}
              />

              <div id="replies" className="pt-12 pl-14 space-y-12">
                {comment.children.length > 0 && (
                  <ul className="space-y-12">
                    {comment.children.map((reply) => (
                      <li key={reply.id}>
                        <Comment
                          objectId={objectId}
                          objectType="project"
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
            <Avatar name={session.user.name} src={session.user.image} />
          </span>
          <span className="inline-block sm:hidden">
            <Avatar
              name={session.user.name}
              src={session.user.image}
              size="sm"
            />
          </span>
          <AddCommentForm
            objectId={objectId}
            objectType="project"
            category={category}
          />
        </div>
      )}
    </div>
  )
}

function ProjectPage({ projectId }: { projectId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const utils = trpc.useContext()
  const projectQueryInput = {
    id: projectId,
  }
  const projectQuery = trpc.project.detail.useQuery(projectQueryInput)
  const project = projectQuery.data

  const likeMutation = trpc.project.like.useMutation({
    onSettled: () => {
      return utils.project.detail.invalidate({ id: projectId })
    },
  })
  const unlikeMutation = trpc.project.unlike.useMutation({
    onSettled: () => {
      return utils.project.detail.invalidate({ id: projectId })
    },
  })

  if (project) {
    if (!isNaN(Number(projectId))) {
      // Redirect from old to new project URLs
      router.push('/project/' + project.id)
    }
    const isAdmin = session?.user.role === 'ADMIN'
    const projectBelongsToUser = project.author.id === session?.user.id

    return (
      <>
        <Head>
          {/* https://stackoverflow.com/questions/75875037 */}
          <title>{`${project.title} – AI Safety Impact Markets`}</title>
        </Head>

        <SuperSEO
          title={`${project.title} – AI Safety Impact Markets`}
          description={project.contentHtml}
          lang="en"
          openGraph={{
            ogImage: {
              ogImage: 'https://app.impactmarkets.io/images/logo-light.svg',
              ogImageAlt: 'AI Safety Impact Markets logo',
              ogImageWidth: 550,
              ogImageHeight: 232,
              ogImageType: 'image/jpeg',
            },
          }}
          twitter={{
            twitterSummaryCard: {
              summaryCardImage:
                'https://app.impactmarkets.io/images/logo-light.svg',
              summaryCardImageAlt: 'AI Safety Impact Markets logo',
              // summaryCardSiteUsername: "twitterUsername",
            },
          }}
        />

        <div className="max-w-screen-lg mx-auto">
          <div className="pb-12">
            {project.hidden && (
              <Banner className="mb-6">
                This project was hidden by the curators.
              </Banner>
            )}

            <div className="flex items-center justify-between gap-4">
              <Heading1>{project.title}</Heading1>
              <Menu
                queryData={project}
                isUserAdmin={isAdmin}
                belongsToUser={projectBelongsToUser}
              />
            </div>
            <div className="flex justify-between my-6">
              <AuthorWithDate
                author={project.author}
                date={project.createdAt}
                dateLabel="Created"
              />
              <div>
                {project.paymentUrl ? (
                  <a
                    href={project.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      buttonClasses({ variant: 'highlight' }),
                      'ml-[-1rem] mb-1 inline-block max-w-60 whitespace-nowrap overflow-hidden overflow-ellipsis',
                    )}
                  >
                    <IconCreditCard className="inline" />
                    &nbsp;Accepting donations
                  </a>
                ) : (
                  <span className="text-sm text-secondary whitespace-nowrap">
                    <IconCreditCardOff className="inline" /> Not accepting new
                    donations
                  </span>
                )}
                <div className="text-sm text-secondary whitespace-nowrap">
                  <IconMoneybag className="inline" /> $
                  {num(project.donationTotal, 0)}
                </div>
                <div className="text-sm text-secondary whitespace-nowrap">
                  <IconWoman className="inline" />{' '}
                  {project.donationCount.toLocaleString()}{' '}
                  {project.donationCount === 1 ? 'donation' : 'donations'}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 my-6">
              <Scores project={project} showProjectScore />
              <Tags queryData={project} tags={TAGS} />
            </div>
            <div className="my-6">
              <Tabs
                defaultValue={
                  projectBelongsToUser ? 'incomingDonations' : 'topContributors'
                }
              >
                <Tabs.List>
                  {project.donationCount && (
                    <Tabs.Tab value="topContributors">
                      Top contributors
                    </Tabs.Tab>
                  )}
                  {session && (
                    <Tabs.Tab value="outboundDonations">
                      Register a donation
                    </Tabs.Tab>
                  )}
                  {(isAdmin || projectBelongsToUser) && (
                    <Tabs.Tab value="incomingDonations">
                      Incoming donations
                    </Tabs.Tab>
                  )}
                </Tabs.List>

                <Tabs.Panel value="topContributors" pt="xs">
                  <TopContributors project={project} />
                </Tabs.Panel>
                {session && (
                  <Tabs.Panel value="outboundDonations" pt="xs">
                    <OutboundDonations project={project} />
                  </Tabs.Panel>
                )}
                {(isAdmin || projectBelongsToUser) && (
                  <Tabs.Panel value="incomingDonations" pt="xs">
                    <IncomingDonations project={project} />
                  </Tabs.Panel>
                )}
              </Tabs>
            </div>
            <HtmlView html={project.contentHtml} className="mt-8" />
            <div className="flex gap-4 mt-6">
              <LikeButton
                disabled={!session}
                likedBy={project.likedBy}
                defaultTooltip="No likes yet"
                onLike={() => {
                  likeMutation.mutate(project.id)
                }}
                onUnlike={() => {
                  unlikeMutation.mutate(project.id)
                }}
              />
              <CommentButton
                commentCount={project._count.comments}
                href={`/project/${project.id}#comments`}
                variant="secondary"
                disabled={!session}
              />
            </div>
          </div>

          <Tabs defaultValue={CommentType.COMMENT}>
            <Tabs.List>
              <Tabs.Tab value={CommentType.COMMENT}>Comments</Tabs.Tab>
              <Tabs.Tab value={CommentType.Q_AND_A}>
                Questions and answers
              </Tabs.Tab>
              <Tabs.Tab value={CommentType.REASONING}>Reasons</Tabs.Tab>
              <Tabs.Tab value={CommentType.ENDORSEMENT}>Endorsements</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={CommentType.COMMENT} className="p-6">
              <p className="text-sm">General comments on the project.</p>
              <CommentPanel
                comments={project.comments}
                category={CommentType.COMMENT}
                objectId={project.id}
              />
            </Tabs.Panel>
            <Tabs.Panel value={CommentType.Q_AND_A} className="p-6">
              <p className="text-sm">Questions about the project.</p>
              <CommentPanel
                comments={project.comments}
                category={CommentType.Q_AND_A}
                objectId={project.id}
              />
            </Tabs.Panel>
            <Tabs.Panel value={CommentType.REASONING} className="p-6">
              <p className="text-sm">
                Donors’ reasoning behind their donations.
              </p>
              <CommentPanel
                comments={project.comments}
                category={CommentType.REASONING}
                objectId={project.id}
              />
            </Tabs.Panel>
            <Tabs.Panel value={CommentType.ENDORSEMENT} className="p-6">
              <p className="text-sm">
                Endorsements of the project or links to such endorsements
                elsewhere.
              </p>
              <CommentPanel
                comments={project.comments}
                category={CommentType.ENDORSEMENT}
                objectId={project.id}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      </>
    )
  }

  if (projectQuery.isError) {
    return <div>Error: {projectQuery.error.message}</div>
  }

  return <PageLoader />
}

ProjectPageWrapper.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ProjectPageWrapper
