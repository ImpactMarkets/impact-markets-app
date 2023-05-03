import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useIntercom } from 'react-use-intercom'

import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const HelpAndSupportPage: NextPageWithAuthAndLayout = () => {
  const { show } = useIntercom()
  return (
    <div className="max-w-screen-lg mx-auto my-5 py-6">
      <Head>
        <title>Help & Support</title>
      </Head>

      <Heading1>Help & Support</Heading1>

      <p className="mt-6">
        Is something unclear? Do you need support? Do you have feedback for us?
      </p>
      <p className="mt-6">
        Please use the{' '}
        <span className="link" onClick={show}>
          Intercom button
        </span>{' '}
        in the lower right, email us at{' '}
        <Link className="link" href="hi@impactmarkets.io">
          hi@impactmarkets.io
        </Link>
        , or join our{' '}
        <a
          target="_blank"
          href="https://discord.gg/7zMNNDSxWv"
          rel="noopener noreferrer"
        >
          <span className="link">Discord</span>
        </a>
        !
      </p>
      <p className="mt-20">
        <Image
          src="/images/support.png"
          alt="Support"
          width={512}
          height={503}
          object-fit="contain"
          unoptimized
        />
      </p>
    </div>
  )
}

HelpAndSupportPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default HelpAndSupportPage
