import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { createId } from '@paralleldrive/cuid2'
import { Prisma } from '@prisma/client'

import { Form } from '@/components/bounty/form'
import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const NewBountyPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addBountyMutation = trpc.bounty.add.useMutation({
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  return (
    <div className="max-w-screen-lg mx-auto">
      <Head>
        <title>New Bounty</title>
      </Head>

      <Heading1>New bounty</Heading1>

      <div className="mt-6 max-w-screen-lg">
        <Form
          isNew
          isSubmitting={addBountyMutation.isLoading}
          defaultValues={{
            id: createId(),
            title: '',
            content: '',
            size: new Prisma.Decimal('0'),
            deadline: '',
            sourceUrl: '',
            tags: '',
            status: 'ACTIVE',
          }}
          backTo="/"
          onSubmit={(values) => {
            addBountyMutation.mutate(
              {
                id: values.id,
                title: values.title,
                content: values.content,
                size: new Prisma.Decimal(values.size || '0'),
                deadline: values.deadline ? new Date(values.deadline) : null,
                sourceUrl: values.sourceUrl,
                tags: values.tags,
                status: values.status,
              },
              {
                onSuccess: (data) => router.push(`/bounty/${data.id}`),
              },
            )
          }}
        />
      </div>
    </div>
  )
}

NewBountyPage.auth = true

NewBountyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default NewBountyPage
