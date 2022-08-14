import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { CertificateForm } from '@/components/certificate-form'
import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const EditCertificatePage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const certificateQuery = trpc.useQuery([
    'certificate.detail',
    { id: Number(router.query.id) },
  ])
  const editCertificateMutation = trpc.useMutation('certificate.edit', {
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  if (certificateQuery.data) {
    const certificateBelongsToUser =
      certificateQuery.data.author.id === session!.user.id

    return (
      <>
        <Head>
          <title>Edit {certificateQuery.data.title} – Impact Markets</title>
        </Head>

        {certificateBelongsToUser ? (
          <>
            <Heading1>Edit “{certificateQuery.data.title}”</Heading1>

            <div className="mt-6">
              <CertificateForm
                isSubmitting={editCertificateMutation.isLoading}
                defaultValues={{
                  title: certificateQuery.data.title,
                  content: certificateQuery.data.content,
                  attributedImpactVersion:
                    certificateQuery.data.attributedImpactVersion,
                  proof: certificateQuery.data.proof || '',
                  location: certificateQuery.data.location || '',
                  rights: certificateQuery.data.rights,
                  actionStart: certificateQuery.data.actionStart
                    .toISOString()
                    .slice(0, 10),
                  actionEnd: certificateQuery.data.actionEnd
                    .toISOString()
                    .slice(0, 10),
                  impactStart: certificateQuery.data.impactStart,
                  impactEnd: certificateQuery.data.impactEnd,
                  tags: certificateQuery.data.tags || '',
                }}
                backTo={`/certificate/${certificateQuery.data.id}`}
                onSubmit={(values) => {
                  editCertificateMutation.mutate(
                    {
                      id: certificateQuery.data.id,
                      data: {
                        title: values.title,
                        content: values.content,
                        attributedImpactVersion: values.attributedImpactVersion,
                        proof: values.proof,
                        location: values.location || '',
                        rights: values.rights,
                        actionStart: values.actionStart,
                        actionEnd: values.actionEnd,
                        tags: values.tags,
                      },
                    },
                    {
                      onSuccess: () =>
                        router.push(`/certificate/${certificateQuery.data.id}`),
                    }
                  )
                }}
              />
            </div>
          </>
        ) : (
          <div>You don&apos;t have permissions to edit this certificate.</div>
        )}
      </>
    )
  }

  if (certificateQuery.isError) {
    return <div>Error: {certificateQuery.error.message}</div>
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

EditCertificatePage.auth = true

EditCertificatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default EditCertificatePage