import { useRouter } from 'next/router'
import * as React from 'react'

import { Layout } from '@/components/layout'
import { CertificateFeed } from '@/components/user/certificateFeed'
import { ProfileInfo } from '@/components/user/profileInfo'
import { TransactionFeed } from '@/components/user/transactionFeed'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Tabs } from '@mantine/core'

const ProfilePage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const profileQuery = trpc.useQuery([
    'user.profile',
    {
      id: String(router.query.userId),
    },
  ])

  if (profileQuery.isError) {
    return <div>Error: {profileQuery.error.message}</div>
  }

  if (profileQuery.data) {
    return (
      <>
        <ProfileInfo user={profileQuery.data} />
        <Tabs defaultValue="certificates">
          <Tabs.List>
            <Tabs.Tab value="certificates">Projects</Tabs.Tab>
            <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="certificates" pt="xs">
            <CertificateFeed user={profileQuery.data} />
          </Tabs.Panel>

          <Tabs.Panel value="transactions" pt="xs">
            <TransactionFeed user={profileQuery.data} />
          </Tabs.Panel>
        </Tabs>
      </>
    )
  }

  return null
}

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ProfilePage
