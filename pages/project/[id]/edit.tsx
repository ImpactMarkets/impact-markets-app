import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { ProjectForm } from '@/components/project/form'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const EditProjectPage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const projectQuery = trpc.useQuery([
    'project.detail',
    { id: String(router.query.id) },
  ])
  const editProjectMutation = trpc.useMutation('project.edit', {
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
          <title>Edit {projectQuery.data.title} – Impact Markets</title>
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
                        tags: values.tags,
                      },
                    },
                    {
                      onSuccess: () =>
                        router.push(`/project/${projectQuery.data.id}`),
                    }
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

  return (
    <div className="animate-pulse">
      <div className="w-3/4 bg-gray-200 rounded h-9 dark:bg-gray-700" />
      <div className="mt-7">
        <div>
          <div className="w-10 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="border rounded h-[42px] border-secondary mt-2" />
        </div>
        <div className="mt-6">
          <div className="w-10 h-5 bg-gray-200 rounded dark:bg-gray-700" />
          <div className="mt-2 border rounded h-9 border-secondary" />
          <div className="mt-2 border rounded h-[378px] border-secondary" />
        </div>
      </div>
      <div className="flex gap-4 mt-9">
        <div className="w-[92px] bg-gray-200 rounded-full h-button dark:bg-gray-700" />
        <div className="w-20 border rounded-full h-button border-secondary" />
      </div>
    </div>
  )
}

EditProjectPage.auth = true

EditProjectPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default EditProjectPage
