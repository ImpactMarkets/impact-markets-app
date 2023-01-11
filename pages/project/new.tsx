import cuid from 'cuid'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { ProjectForm } from '@/components/project/form'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const NewProjectPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addProjectMutation = trpc.useMutation('project.add', {
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <>
      <Head>
        <title>New Project</title>
      </Head>

      <Heading1>New project</Heading1>

      <div className="mt-6">
        <ProjectForm
          isNew
          isSubmitting={addProjectMutation.isLoading}
          defaultValues={{
            id: cuid(),
            title: '',
            content: '',
            tags: '',
          }}
          backTo="/"
          onSubmit={(values) => {
            addProjectMutation.mutate(
              {
                id: values.id,
                title: values.title,
                content: values.content,
                actionStart: values.actionStart
                  ? new Date(values.actionStart)
                  : null,
                actionEnd: values.actionEnd ? new Date(values.actionEnd) : null,
                tags: values.tags,
              },
              {
                onSuccess: (data) => router.push(`/project/${data.id}`),
              }
            )
          }}
        />
      </div>
    </>
  )
}

NewProjectPage.auth = true

NewProjectPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default NewProjectPage
