import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Layout } from '@/components/layout'
import { Bio } from '@/components/user/bio'
import { Donations } from '@/components/user/donations'
import { Likes } from '@/components/user/likes'
import { Preferences } from '@/components/user/preferences'
import { ProfileInfo } from '@/components/user/profileInfo'
import { ProjectFeed } from '@/components/user/projectFeed'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Tabs } from '@mantine/core'

const ProfilePage: NextPageWithAuthAndLayout = () => {
  const router = useRouter()
  const { data: session } = useSession()
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
      <div className="max-w-screen-lg mx-auto">
        <ProfileInfo user={profileQuery.data} />
        <Tabs defaultValue="bio">
          <Tabs.List>
            <Tabs.Tab value="bio">Bio</Tabs.Tab>
            {profileQuery.data.donations.some(
              (donation) => donation.state === 'CONFIRMED'
            ) ? (
              <Tabs.Tab value="donations">Donations</Tabs.Tab>
            ) : null}
            <Tabs.Tab value="projects">Projects</Tabs.Tab>
            <Tabs.Tab value="likes">Likes</Tabs.Tab>
            {router.query.userId === session?.user.id ? (
              <Tabs.Tab value="preferences">Preferences</Tabs.Tab>
            ) : null}
          </Tabs.List>

          <Tabs.Panel value="bio" pt="xs">
            <Bio user={profileQuery.data} />
          </Tabs.Panel>

          <Tabs.Panel value="donations" pt="xs">
            <Donations user={profileQuery.data} />
          </Tabs.Panel>

          <Tabs.Panel value="projects" pt="xs">
            <ProjectFeed user={profileQuery.data} />
          </Tabs.Panel>

          <Tabs.Panel value="likes" pt="xs">
            <Likes user={profileQuery.data} />
          </Tabs.Panel>

          {router.query.userId === session?.user.id ? (
            <Tabs.Panel value="preferences" pt="xs" className="p-6">
              <Preferences />
            </Tabs.Panel>
          ) : null}
        </Tabs>
      </div>
    )
  }

  return null
}

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default ProfilePage
