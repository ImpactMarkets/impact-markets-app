import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { ProjectForm } from '@/components/project/form'
import { PageLoader } from '@/components/utils'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const EditProjectPage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const projectQuery = trpc.project.detail.useQuery({
    id: String(router.query.id),
  })
  const editProjectMutation = trpc.project.edit.useMutation({
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  if (projectQuery.data) {
    const projectBelongsToUser =
      projectQuery.data.author.id === session!.user.id

    return (
      <>
        <Head>
          {/* https://stackoverflow.com/questions/75875037 */}
          <title>{`Edit ${projectQuery.data.title} – GiveWiki`}</title>
        </Head>

        {session!.user.role === 'ADMIN' || projectBelongsToUser ? (
          <>
            <Heading1>Edit “{projectQuery.data.title}”</Heading1>

            <div className="mt-6">
              <ProjectForm
                isSubmitting={editProjectMutation.isLoading}
                defaultValues={{
                  id: projectQuery.data.id,
                  title: projectQuery.data.title,
                  content: projectQuery.data.content,
                  actionStart: projectQuery.data.actionStart
                    ? projectQuery.data.actionStart.toISOString().slice(0, 10)
                    : undefined,
                  actionEnd: projectQuery.data.actionEnd
                    ? projectQuery.data.actionEnd.toISOString().slice(0, 10)
                    : undefined,
                  paymentUrl: projectQuery.data.paymentUrl,
                  fundingGoal: projectQuery.data.fundingGoal?.toString(),
                  tags: projectQuery.data.tags || '',
                }}
                backTo={`/project/${projectQuery.data.id}`}
                onSubmit={(values) => {
                  editProjectMutation.mutate(
                    {
                      id: projectQuery.data.id,
                      data: {
                        title: values.title,
                        content: values.content,
                        actionStart: values.actionStart
                          ? new Date(values.actionStart)
                          : null,
                        actionEnd: values.actionEnd
                          ? new Date(values.actionEnd)
                          : null,
                        paymentUrl: values.paymentUrl,
                        fundingGoal: values.fundingGoal ?? '0',
                        tags: values.tags,
                      },
                    },
                    {
                      onSuccess: () =>
                        router.push(`/project/${projectQuery.data.id}`),
                    },
                  )
                }}
              />
            </div>
          </>
        ) : (
          <div>You don&apos;t have permissions to edit this project.</div>
        )}
      </>
    )
  }

  if (projectQuery.isError) {
    return <div>Error: {projectQuery.error.message}</div>
  }

  return <PageLoader />
}

EditProjectPage.auth = true

EditProjectPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default EditProjectPage
