import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Layout } from '@/components/layout'
import { Bio } from '@/components/user/bio'
import { ProfileInfo } from '@/components/user/profileInfo'
import { ProjectFeed } from '@/components/user/projectFeed'
import { refreshSession } from '@/components/utils'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { Switch, Tabs } from '@mantine/core'

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

  const preferencesMutation = trpc.useMutation(['user.preferences'], {
    onSuccess: refreshSession,
  })

  if (profileQuery.data) {
    return (
      <div className="max-w-screen-lg mx-auto">
        <ProfileInfo user={profileQuery.data} />
        <Tabs defaultValue="projects">
          <Tabs.List>
            <Tabs.Tab value="projects">Projects</Tabs.Tab>
            {profileQuery.data.bio && <Tabs.Tab value="bio">Bio</Tabs.Tab>}
            {router.query.userId === session?.user.id ? (
              <Tabs.Tab value="preferences">Preferences</Tabs.Tab>
            ) : null}
          </Tabs.List>

          <Tabs.Panel value="projects" pt="xs">
            <ProjectFeed user={profileQuery.data} />
          </Tabs.Panel>

          {profileQuery.data.bio && (
            <Tabs.Panel value="bio" pt="xs">
              <Bio user={profileQuery.data} />
            </Tabs.Panel>
          )}
          {router.query.userId === session?.user.id ? (
            <Tabs.Panel value="preferences" pt="xs" className="p-6">
              <Switch
                label="Show detailed certificate view"
                classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
                disabled={preferencesMutation.isLoading}
                checked={session?.user.prefersDetailView}
                onChange={(event) => {
                  preferencesMutation.mutate({
                    prefersDetailView: event.target.checked,
                  })
                }}
              />
              <Switch
                label="Hide name from rankings"
                classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
                disabled={preferencesMutation.isLoading}
                checked={session?.user.prefersAnonymity}
                onChange={(event) => {
                  preferencesMutation.mutate({
                    prefersAnonymity: event.target.checked,
                  })
                }}
              />
              <Switch
                label="Send me daily email notifications for activity on my projects"
                classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
                disabled={preferencesMutation.isLoading}
                checked={session?.user.prefersEventNotifications}
                onChange={(event) => {
                  preferencesMutation.mutate({
                    prefersEventNotifications: event.target.checked,
                  })
                }}
              />
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
