import cuid from 'cuid'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { CertificateForm } from '@/components/certificate-form'
import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import { DEFAULT_TARGET, DEFAULT_VALUATION } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Prisma } from '@prisma/client'

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
        <title>New Project</title>
      </Head>

      <Heading1>New project</Heading1>

      <div className="mt-6">
        <CertificateForm
          isNew
          isSubmitting={addCertificateMutation.isLoading}
          defaultValues={{
            id: cuid(),
            title: '',
            proof: '',
            location: '',
            rights: '',
            tags: '',
            counterfactual: '',
            attributedImpactVersion: ATTRIBUTED_IMPACT_RECOMMENDED_VERSION,
            actionStart: new Date().toISOString().slice(0, 10),
            actionEnd: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
              .toISOString()
              .slice(0, 10),
            content: '',
            valuation: DEFAULT_VALUATION,
            target: DEFAULT_TARGET,
          }}
          backTo="/"
          onSubmit={(values) => {
            addCertificateMutation.mutate(
              {
                id: values.id,
                title: values.title,
                content: values.content,
                counterfactual: values.counterfactual,
                attributedImpactVersion: values.attributedImpactVersion,
                proof: values.proof,
                location: values.location || '',
                rights: 'RETROACTIVE_FUNDING',
                actionStart: new Date(values.actionStart),
                actionEnd: new Date(values.actionEnd),
                tags: values.tags,
                valuation: new Prisma.Decimal(
                  values.valuation || DEFAULT_VALUATION
                ),
                target: new Prisma.Decimal(values.target || DEFAULT_TARGET),
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
