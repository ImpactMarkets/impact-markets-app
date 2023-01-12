import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Layout } from '@/components/layout'
import { CertificateFeed } from '@/components/user/certificateFeed'
import { ProfileInfo } from '@/components/user/profileInfo'
import { TransactionFeed } from '@/components/user/transactionFeed'
import { refreshSession } from '@/components/utils'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Switch, Tabs } from '@mantine/core'

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

  const preferencesMutation = trpc.useMutation(['user.preferences'], {
    onSuccess: refreshSession,
  })

  const { data: session } = useSession()

  if (profileQuery.data) {
    return (
      <>
        <ProfileInfo user={profileQuery.data} />
        <Tabs defaultValue="certificates">
          <Tabs.List>
            <Tabs.Tab value="certificates">Projects</Tabs.Tab>
            <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
            {session && <Tabs.Tab value="preferences">Preferences</Tabs.Tab>}
          </Tabs.List>

          <Tabs.Panel value="certificates" pt="xs">
            <CertificateFeed user={profileQuery.data} />
          </Tabs.Panel>

          <Tabs.Panel value="transactions" pt="xs">
            <TransactionFeed user={profileQuery.data} />
          </Tabs.Panel>

          {session && (
            <Tabs.Panel value="preferences" pt="xs">
              <Switch
                label="Detail view"
                classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
                checked={session.user.prefersDetailView}
                onChange={(event) => {
                  preferencesMutation.mutate({
                    prefersDetailView: event.target.checked,
                  })
                }}
              />
            </Tabs.Panel>
          )}
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
