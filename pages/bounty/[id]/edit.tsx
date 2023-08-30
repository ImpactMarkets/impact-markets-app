import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { Form } from '@/components/bounty/form'
import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const EditBountyPage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const bountyQuery = trpc.bounty.detail.useQuery({
    id: String(router.query.id),
  })
  const editBountyMutation = trpc.bounty.edit.useMutation({
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
    },
  })

  if (bountyQuery.data) {
    const bountyBelongsToUser = bountyQuery.data.author.id === session!.user.id

    return (
      <>
        <Head>
          <title>Edit {bountyQuery.data.title} – AI Safety Impact Markets</title>
        </Head>

        {session!.user.role === 'ADMIN' || bountyBelongsToUser ? (
          <>
            <Heading1>Edit “{bountyQuery.data.title}”</Heading1>

            <div className="mt-6">
              <Form
                isSubmitting={editBountyMutation.isLoading}
                defaultValues={{
                  id: bountyQuery.data.id,
                  title: bountyQuery.data.title,
                  content: bountyQuery.data.content,
                  size: bountyQuery.data.size,
                  deadline: bountyQuery.data.deadline
                    ? bountyQuery.data.deadline.toISOString().slice(0, 10)
                    : undefined,
                  sourceUrl: bountyQuery.data.sourceUrl,
                  tags: bountyQuery.data.tags || '',
                  status: bountyQuery.data.status,
                }}
                backTo={`/bounty/${bountyQuery.data.id}`}
                onSubmit={(values) => {
                  editBountyMutation.mutate(
                    {
                      id: bountyQuery.data.id,
                      data: {
                        title: values.title,
                        content: values.content,
                        size: values.size || '0',
                        deadline: values.deadline
                          ? new Date(values.deadline)
                          : null,
                        sourceUrl: values.sourceUrl,
                        tags: values.tags,
                        status: values.status,
                      },
                    },
                    {
                      onSuccess: () =>
                        router.push(`/bounty/${bountyQuery.data.id}`),
                    },
                  )
                }}
              />
            </div>
          </>
        ) : (
          <div>You don&apos;t have permissions to edit this bounty.</div>
        )}
      </>
    )
  }

  if (bountyQuery.isError) {
    return <div>Error: {bountyQuery.error.message}</div>
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

EditBountyPage.auth = true

EditBountyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default EditBountyPage
