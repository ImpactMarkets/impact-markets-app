import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { createId } from '@paralleldrive/cuid2'

import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { ProjectForm } from '@/components/project/form'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const NewProjectPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addProjectMutation = trpc.project.add.useMutation({
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <div className="max-w-screen-lg mx-auto">
      <Head>
        <title>New Project</title>
      </Head>

      <Heading1>New project</Heading1>

      <div className="mt-6">
        <ProjectForm
          isNew
          isSubmitting={addProjectMutation.isLoading}
          defaultValues={{
            id: createId(),
            title: '',
            content: '',
            paymentUrl: '',
            fundingGoal: '0',
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
                paymentUrl: values.paymentUrl,
                fundingGoal: values.fundingGoal ?? '0',
                tags: values.tags,
              },
              {
                onSuccess: (data) => router.push(`/project/${data.id}`),
              },
            )
          }}
        />
      </div>
    </div>
  )
}

NewProjectPage.auth = true

NewProjectPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default NewProjectPage
