import cuid from 'cuid'
import Head from 'next/head'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

import { CertificateForm } from '@/components/certificate/form'
import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { DEFAULT_TARGET, DEFAULT_VALUATION } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Prisma } from '@prisma/client'

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

      <div className="mt-6 max-w-screen-lg">
        <CertificateForm
          isNew
          isSubmitting={addCertificateMutation.isLoading}
          defaultValues={{
            id: cuid(),
            title: '',
            content: '',
            counterfactual: '',
            location: '',
            rights: '',
            actionStart: new Date().toISOString().slice(0, 10),
            actionEnd: new Date(new Date().getTime() + 1000 * 60 * 60 * 24)
              .toISOString()
              .slice(0, 10),
            tags: '',
            issuerEmails: '',
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
                location: values.location || '',
                rights: 'RETROACTIVE_FUNDING',
                actionStart: new Date(values.actionStart),
                actionEnd: new Date(values.actionEnd),
                tags: values.tags,
                issuerEmails: values.issuerEmails,
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
