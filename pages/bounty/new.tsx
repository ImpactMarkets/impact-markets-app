import cuid from 'cuid'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { Form } from '@/components/bounty/form'
import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const NewBountyPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addBountyMutation = trpc.useMutation('bounty.add', {
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <>
      <Head>
        <title>New Bounty</title>
      </Head>

      <Heading1>New bounty</Heading1>

      <div className="mt-6">
        <Form
          isNew
          isSubmitting={addBountyMutation.isLoading}
          defaultValues={{
            id: cuid(),
            title: '',
            content: '',
            size: '0',
            deadline: '',
            sourceUrl: '',
            tags: '',
          }}
          backTo="/"
          onSubmit={(values) => {
            addBountyMutation.mutate(
              {
                id: values.id,
                title: values.title,
                content: values.content,
                size: values.size || '0',
                deadline: values.deadline ? new Date(values.deadline) : null,
                sourceUrl: values.sourceUrl,
                tags: values.tags,
              },
              {
                onSuccess: (data) => router.push(`/bounty/${data.id}`),
              }
            )
          }}
        />
      </div>
    </>
  )
}

NewBountyPage.auth = true

NewBountyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default NewBountyPage