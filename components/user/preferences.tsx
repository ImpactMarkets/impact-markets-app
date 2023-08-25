import { useSession } from 'next-auth/react'
import * as React from 'react'

import { Switch } from '@mantine/core'

import { trpc } from '@/lib/trpc'

import { refreshSession } from '../utils'

export function Preferences() {
  const { data: session } = useSession()
  const preferencesMutation = trpc.user.preferences.useMutation({
    onSuccess: refreshSession,
  })

  return (
    <div className="flow-root mt-6">
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
      <Switch
        label="Send me daily email notifications for new projects"
        classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
        disabled={preferencesMutation.isLoading}
        checked={session?.user.prefersProjectNotifications}
        onChange={(event) => {
          preferencesMutation.mutate({
            prefersProjectNotifications: event.target.checked,
          })
        }}
      />
      <Switch
        label="Send me daily email notifications for new bounties"
        classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
        disabled={preferencesMutation.isLoading}
        checked={session?.user.prefersBountyNotifications}
        onChange={(event) => {
          preferencesMutation.mutate({
            prefersBountyNotifications: event.target.checked,
          })
        }}
      />
      <Switch
        label="Hide me from rankings"
        classNames={{ input: 'rounded-full !bg-auto !bg-left' }}
        disabled={preferencesMutation.isLoading}
        checked={session?.user.prefersAnonymity}
        onChange={(event) => {
          preferencesMutation.mutate({
            prefersAnonymity: event.target.checked,
          })
        }}
      />
    </div>
  )
}
