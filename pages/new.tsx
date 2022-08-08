import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { CertificateForm } from '@/components/certificate-form'
import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import { browserEnv } from '@/env/browser'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const NewCertificatePage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addCertificateMutation = trpc.useMutation('certificate.add', {
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`)
    },
  })

  return (
    <>
      <Head>
        <title>New Certificate</title>
      </Head>

      <Heading1>New certificate</Heading1>

      <div className="mt-6">
        <CertificateForm
          isNew
          isSubmitting={addCertificateMutation.isLoading}
          defaultValues={{
            title: '',
            proof: '',
            location: '',
            rights: '',
            impactStart: null,
            impactEnd: null,
            tags: '',
            attributedImpactVersion:
              browserEnv.NEXT_PUBLIC_ATTRIBUTED_IMPACT_RECOMMENDED_VERSION,
            actionStart: '2022-05-01',
            actionEnd: '2022-06-01',
            content: browserEnv.NEXT_PUBLIC_DESCRIPTION_PROMPTS,
          }}
          backTo="/"
          onSubmit={(values) => {
            addCertificateMutation.mutate(
              {
                title: values.title,
                content: values.content,
                attributedImpactVersion: values.attributedImpactVersion,
                proof: values.proof,
                location: values.location || '',
                rights: 'RETROACTIVE_FUNDING',
                actionStart: values.actionStart,
                actionEnd: values.actionEnd,
                tags: '',
              },
              {
                onSuccess: (data) => router.push(`/certificate/${data.id}`),
              }
            )
          }}
        />
      </div>
    </>
  )
}

NewCertificatePage.auth = true

NewCertificatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default NewCertificatePage
