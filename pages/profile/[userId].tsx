import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { TAGS as BOUNTY_TAGS } from '@/components/bounty/tags'
import { Layout } from '@/components/layout'
import { IMMultiSelect } from '@/components/multiSelect'
import { TAGS as PROJECT_TAGS } from '@/components/project/tags'
import { CertificateFeed } from '@/components/user/certificateFeed'
import { ProfileInfo } from '@/components/user/profileInfo'
import { TransactionFeed } from '@/components/user/transactionFeed'
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
  const { register, getValues, setValue } = useForm<{
    projectTags: string
    bountyTags: string
  }>({
    mode: 'onChange',
    defaultValues: {
      projectTags: profileQuery.data?.projectTags,
      bountyTags: profileQuery.data?.bountyTags,
    },
  })

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
        <Tabs defaultValue="certificates">
          <Tabs.List>
            <Tabs.Tab value="certificates">Projects</Tabs.Tab>
            <Tabs.Tab value="transactions">Transactions</Tabs.Tab>
            {router.query.userId === session?.user.id ? (
              <>
                <Tabs.Tab value="subscriptions">Subscriptions</Tabs.Tab>
                <Tabs.Tab value="preferences">Preferences</Tabs.Tab>
              </>
            ) : null}
          </Tabs.List>

          <Tabs.Panel value="certificates" pt="xs">
            <CertificateFeed user={profileQuery.data} />
          </Tabs.Panel>

          <Tabs.Panel value="transactions" pt="xs">
            <TransactionFeed user={profileQuery.data} />
          </Tabs.Panel>

          <Tabs.Panel value="subscriptions" pt="xs">
            <div className="mt-6">
              Here you can subscribe to daily updates on projects and bounties
              that match your interests.
            </div>
            <div className="mt-6">
              <IMMultiSelect
                {...register('projectTags')}
                label="Project tags"
                description="Please select the project tags you would like to subscribe to."
                placeholder="Pick your interests"
                data={PROJECT_TAGS.map((tag) => ({
                  value: tag.value,
                  label: tag.label,
                  group: tag.group,
                }))}
                searchable
                onChange={(value) =>
                  Array.isArray(value)
                    ? setValue('projectTags', value.join(','))
                    : null
                }
                defaultValue={
                  getValues().projectTags
                    ? getValues().projectTags.split(',')
                    : []
                }
              />
            </div>
            <div className="mt-6">
              <IMMultiSelect
                {...register('bountyTags')}
                label="Bounty tags"
                description="Please select the bounty tags you would like to subscribe to."
                placeholder="Pick your interests"
                data={BOUNTY_TAGS.map((tag) => ({
                  value: tag.value,
                  label: tag.label,
                  group: tag.group,
                }))}
                searchable
                onChange={(value) =>
                  Array.isArray(value)
                    ? setValue('bountyTags', value.join(','))
                    : null
                }
                defaultValue={
                  getValues().bountyTags
                    ? getValues().bountyTags.split(',')
                    : []
                }
              />
            </div>
          </Tabs.Panel>

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
