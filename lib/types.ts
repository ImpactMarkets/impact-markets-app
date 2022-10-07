import type { NextPage } from 'next'
import * as React from 'react'

import { User } from '@prisma/client'

export type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

export type Author = Pick<User, 'id' | 'name' | 'image'>
