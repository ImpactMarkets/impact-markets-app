import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import { AuthorWithDate } from '@/components/authorWithDate'
import { Avatar } from '@/components/avatar'
import { Banner } from '@/components/banner'
import { CommentButton } from '@/components/commentButton'
import { Heading1 } from '@/components/heading1'
import { HtmlView } from '@/components/htmlView'
import { Layout } from '@/components/layout'
import { LikeButton } from '@/components/likeButton'
import { AddCommentForm } from '@/components/project/addCommentForm'
import { Comment } from '@/components/project/comment'
import { Menu } from '@/components/projectAndCertificate/menu'
import { Tags } from '@/components/tags'
import { InferQueryPathAndInput, trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { LoadingOverlay } from '@mantine/core'
import { IconCreditCard, IconCreditCardOff } from '@tabler/icons'

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
    const isUserAdmin = session?.user.role === 'ADMIN'
    const projectBelongsToUser = project.author.id === session?.user.id

    return (
      <>
        <Head>
          <title>{project.title} – Impact Markets</title>
        </Head>

        <div className="divide-y divide-primary">
          <div className="pb-12">
            {project.hidden && (
              <Banner className="mb-6">
                This project will remain hidden until it’s published by the
                curators.
              </Banner>
            )}
            {!project.author.proofUrl && (
              <Banner className="mb-6">
                {project.author.id === session?.user.id
                  ? 'Please enter proof of your identity on your'
                  : 'The author of this project has not yet entered proof of their'}{' '}
                <Link href={`/profile/${project.author.id}`}>
                  <span className="link">user profile</span>
                </Link>
                .
              </Banner>
            )}

            <div className="flex items-center justify-between gap-4">
              <Heading1>{project.title}</Heading1>
              <Menu
                queryData={project}
                isUserAdmin={isUserAdmin}
                belongsToUser={projectBelongsToUser}
              />
            </div>
            <div className="flex justify-between my-6">
              <AuthorWithDate
                author={project.author}
                date={project.createdAt}
              />
              {project.paymentUrl ? (
                <a
                  className="text-sm text-secondary inline-block max-w-60 whitespace-nowrap overflow-hidden overflow-ellipsis"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={project.paymentUrl}
                >
                  <IconCreditCard className="inline" /> Accepting donations
                </a>
              ) : (
                <span>
                  <IconCreditCardOff className="inline" /> Not accepting
                  donations
                </span>
              )}
            </div>
            <div className="flex my-6">
              <Tags queryData={project} />
              {!!(project.actionStart || project.actionEnd) && (
                <span className="font-bold text-xs border text-primary border-secondary bg-primary px-1 ml-1 rounded">
                  {project.actionStart && project.actionEnd ? (
                    <>
                      Work: {project.actionStart.toISOString().slice(0, 10)} to{' '}
                      {project.actionEnd.toISOString().slice(0, 10)}
                    </>
                  ) : project.actionEnd ? (
                    <>
                      Work: until {project.actionEnd.toISOString().slice(0, 10)}
                    </>
                  ) : (
                    <>
                      Work: since{' '}
                      {project.actionStart!.toISOString().slice(0, 10)}
                    </>
                  )}
                </span>
              )}
            </div>
            <div className="my-6"></div>
            <HtmlView html={project.contentHtml} className="mt-8" />
            <div className="flex gap-4 mt-6">
              <LikeButton
                disabled={!session}
                likedBy={project.likedBy}
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

          <div id="comments" className="pt-12 space-y-12">
            {project.comments.length > 0 && (
              <ul className="space-y-12">
                {project.comments.map((comment) => (
                  <li key={comment.id}>
                    <Comment projectId={project.id} comment={comment} />

                    <div id="replies" className="pt-12 pl-14 space-y-12">
                      {comment.children.length > 0 && (
                        <ul className="space-y-12">
                          {comment.children.map((reply) => (
                            <li key={reply.id}>
                              <Comment projectId={project.id} comment={reply} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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
                <AddCommentForm projectId={project.id} />
              </div>
            )}
          </div>
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