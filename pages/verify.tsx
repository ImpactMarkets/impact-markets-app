import Head from 'next/head'
import { useRouter } from 'next/router'
import Persona from 'persona'
import toast from 'react-hot-toast'

import { Heading1 } from '@/components/heading-1'
import { Layout } from '@/components/layout'
import { browserEnv } from '@/env/browser'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const VerifyPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Identify Verification</title>
      </Head>

      <Heading1>Verify your identity</Heading1>

      <div className="mx-auto w-11/12 max-w-2xl">
        <Persona.Inquiry
          templateId="itmpl_sPFzDpGWLEju64JFzDQCEdxB"
          environment="sandbox"
          onLoad={() => {
            console.log('Loaded inline')
          }}
          onComplete={({ inquiryId, status, fields }) => {
            // Inquiry completed. Optionally tell your server about it.
            console.log(`Sending finished inquiry ${inquiryId} to backend`)
          }}
        />
      </div>
    </>
  )
}

VerifyPage.auth = true

VerifyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default VerifyPage
