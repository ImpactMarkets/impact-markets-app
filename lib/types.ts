import type { NextPage } from 'next'
import { ExtendedRecordMap } from 'notion-types'
import * as React from 'react'

import { User } from '@prisma/client'

export type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean
  getLayout?: (page: React.ReactElement) => React.ReactNode
  recordMap?: ExtendedRecordMap
}

export type Author = Pick<User, 'id' | 'name' | 'image'>
