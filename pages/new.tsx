import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { CertificateForm } from '@/components/certificate-form'
import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const ATTRIBUTED_IMPACT_RECOMMENDED_VERSION = '0.3'

const NewCertificatePage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const addCertificateMutation = trpc.useMutation('certificate.add', {
    onError: (error) => {
      toast.error(<pre>{error.message}</pre>)
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
            tags: '',
            counterfactual: '',
            attributedImpactVersion: ATTRIBUTED_IMPACT_RECOMMENDED_VERSION,
            actionStart: new Date(),
            actionEnd: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
            content: '',
          }}
          backTo="/"
          onSubmit={(values) => {
            addCertificateMutation.mutate(
              {
                title: values.title,
                content: values.content,
                counterfactual: values.counterfactual,
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
