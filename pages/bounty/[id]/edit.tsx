import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { Form } from '@/components/bounty/form'
import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { PageLoader } from '@/components/utils'
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
          {/* https://stackoverflow.com/questions/75875037 */}
          <title>{`Edit ${bountyQuery.data.title} – GiveWiki`}</title>
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

  return <PageLoader />
}

EditBountyPage.auth = true

EditBountyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default EditBountyPage
