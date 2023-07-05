import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

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
import { OutgoingDonations } from '@/components/project/outgoingDonations'
import { TAGS } from '@/components/project/tags'
import { TopContributors } from '@/components/project/topContributors'
import { Scores } from '@/components/scores'
import { Tags } from '@/components/tags'
import { classNames } from '@/lib/classnames'
import { num } from '@/lib/text'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { LoadingOverlay, Tabs } from '@mantine/core'
import {
  IconCreditCard,
  IconCreditCardOff,
  IconMoneybag,
  IconWoman,
} from '@tabler/icons'

// TODO: Maybe this could be made into a generic component ?
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

function ProjectPage({ projectId }: { projectId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const utils = trpc.useContext()
  const projectQueryPathAndInput: InferQueryPathAndInput<'project.detail'> = [
    'project.detail',
    {
      id: projectId,
    },
  ]
  const projectQuery = trpc.useQuery(projectQueryPathAndInput)
  const project = projectQuery.data

  const likeMutation = trpc.useMutation(['project.like'], {
    onMutate: async () => {
      await utils.cancelQuery(projectQueryPathAndInput)

      const previousProject = utils.getQueryData(projectQueryPathAndInput)

      if (previousProject) {
        utils.setQueryData(projectQueryPathAndInput, {
          ...previousProject,
          likedBy: [
            ...previousProject.likedBy,
            { user: { id: session!.user.id, name: session!.user.name } },
          ],
        })
      }

      return { previousProject }
    },
    onError: (err, id, context: any) => {
      if (context?.previousProject) {
        utils.setQueryData(projectQueryPathAndInput, context.previousProject)
      }
    },
  })
  const unlikeMutation = trpc.useMutation(['project.unlike'], {
    onMutate: async () => {
      await utils.cancelQuery(projectQueryPathAndInput)

      const previousProject = utils.getQueryData(projectQueryPathAndInput)

      if (previousProject) {
        utils.setQueryData(projectQueryPathAndInput, {
          ...previousProject,
          likedBy: previousProject.likedBy.filter(
            (item) => item.user.id !== session!.user.id
          ),
        })
      }

      return { previousProject }
    },
    onError: (err, id, context: any) => {
      if (context?.previousProject) {
        utils.setQueryData(projectQueryPathAndInput, context.previousProject)
      }
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
          <title>{project.title} – Impact Markets</title>
        </Head>

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
                      'ml-[-1rem] mb-1 inline-block max-w-60 whitespace-nowrap overflow-hidden overflow-ellipsis'
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
              <Scores project={project} />
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
                    <Tabs.Tab value="outgoingDonations">
                      Register a donation
                    </Tabs.Tab>
                  )}
                  {(isAdmin || projectBelongsToUser) && (
                    <Tabs.Tab value="incomingDonations">
                      Incoming donations
                    </Tabs.Tab>
                  )}
                </Tabs.List>

                {session && (
                  <Tabs.Panel value="topContributors" pt="xs">
                    <TopContributors project={project} />
                  </Tabs.Panel>
                )}
                {session && (
                  <Tabs.Panel value="outgoingDonations" pt="xs">
                    <OutgoingDonations project={project} />
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

          <Tabs defaultValue="comments">
            <Tabs.List>
              <Tabs.Tab value="comments">Comments</Tabs.Tab>
              <Tabs.Tab value="questions-and-answers">
                Questions and answers
              </Tabs.Tab>
              <Tabs.Tab value="reasons">Reasons</Tabs.Tab>
              <Tabs.Tab value="endorsements">Endorsements</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="questions-and-answers" pt="xs">
              <div id="comments" className="pt-6 space-y-12">
                {project.comments.length > 0 ? (
                  <ul className="space-y-12">
                    {project.comments.map((comment) => (
                      <li key={comment.id}>
                        <Comment
                          objectId={project.id}
                          objectType="project"
                          comment={comment}
                        />

                        <div id="replies" className="pt-12 pl-14 space-y-12">
                          {comment.children.length > 0 && (
                            <ul className="space-y-12">
                              {comment.children.map((reply) => (
                                <li key={reply.id}>
                                  <Comment
                                    objectId={project.id}
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
                    <AddCommentForm
                      objectId={project.id}
                      objectType="project"
                    />
                  </div>
                )}
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </>
    )
  }

  if (projectQuery.isError) {
    return <div>Error: {projectQuery.error.message}</div>
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

ProjectPageWrapper.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ProjectPageWrapper
