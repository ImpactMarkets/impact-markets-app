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
import { RegisterDonations } from '@/components/project/registerDonations'
import { TAGS } from '@/components/project/tags'
import { TopContributors } from '@/components/project/topContributors'
import { Scores } from '@/components/scores'
import { Tags } from '@/components/tags'
import { PageLoader } from '@/components/utils'
import { classNames } from '@/lib/classnames'
import { markdownToPlainHtml } from '@/lib/editor'
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

  // calculate projectBelongsToUser at the component level
  let projectBelongsToUser = false
  // if we have information about the project and if the user is logged in,
  // compare the IDs of the project creator and the current user
  // if these are the same, projectBelongsToUser becomes "true"
  if (project && session) {
    projectBelongsToUser = project.author.id === session.user.id
  }

  const [activeTab, setActiveTab] = React.useState<string | null>(null)
  const [activeCommentsTab, setActiveCommentsTab] = React.useState<
    string | null
  >(null)

  // QUESTION: should value be set to a more specific type?
  const handleTabChange = (type: 'tab' | 'comments', value: string | null) => {
    // Update URL with new tab value
    const { id, ...restQuery } = router.query
    router.push(
      {
        pathname: `/project/${projectId}`,
        query: { ...restQuery, [type]: value },
      },
      undefined,
      { shallow: true },
    )
  }

  // initialize tab state from URL
  React.useEffect(() => {
    if (router.isReady && project) {
      const defaultTab = projectBelongsToUser
        ? 'incomingDonations'
        : project.donationCount > 0
          ? 'topContributors'
          : 'registerDonations'
      setActiveTab((router.query.tab as string) || defaultTab)
      setActiveCommentsTab(
        (router.query.comments as string) || CommentType.COMMENT,
      )
    }
  }, [
    router.isReady,
    router.query.tab,
    router.query.comments,
    project,
    projectBelongsToUser,
  ])

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

    return (
      <>
        <Head>
          {/* https://stackoverflow.com/questions/75875037 */}
          <title>{`${project.title} – GiveWiki`}</title>
        </Head>

        <SuperSEO
          title={`${project.title} – GiveWiki`}
          description={markdownToPlainHtml(project.content)}
          lang="en"
          openGraph={{
            ogType: 'website',
            ogTitle: `${project.title} – GiveWiki`,
            ogUrl: `https://givewiki.org/project/${project.id}`,
            ogImage: {
              ogImage: 'https://givewiki.org/images/logo-light-og.png',
              ogImageSecureUrl: 'https://givewiki.org/images/logo-light-og.png',
              ogImageAlt: `${project.title} – GiveWiki`,
              ogImageWidth: 1200,
              ogImageHeight: 630,
              ogImageType: 'image/png',
            },
          }}
          twitter={{
            twitterSummaryCard: {
              summaryCardImage: 'https://givewiki.org/images/logo-light-og.png',
              summaryCardImageAlt: `${project.title} – GiveWiki`,
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
                  <IconMoneybag className="inline" />
                  {project.fundingGoal !== null
                    ? `Quarterly goal: $${num(project.fundingGoal)}`
                    : ''}{' '}
                  {/* TOTAL FUNDING ALL TIME */}
                  {/* ${num(project.donationTotal, 0)} */}
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
                value={activeTab}
                onChange={(value) => handleTabChange('tab', value)}
              >
                <Tabs.List>
                  {project.donationCount && (
                    <Tabs.Tab value="topContributors">
                      Top contributors
                    </Tabs.Tab>
                  )}
                  {session && (
                    <Tabs.Tab value="registerDonations">
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
                  <Tabs.Panel value="registerDonations" pt="xs">
                    <RegisterDonations project={project} />
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

          <Tabs
            value={activeCommentsTab}
            onChange={(value) => handleTabChange('comments', value)}
          >
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
