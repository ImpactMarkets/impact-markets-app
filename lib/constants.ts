import { Prisma } from '@prisma/client'

export const TARGET_FRACTION = 0.9
export const DEFAULT_VALUATION = new Prisma.Decimal(1)
export const DEFAULT_TARGET = new Prisma.Decimal(1e6)
export const SHARE_COUNT = 1e5

export const PROJECT_SORT_KEYS = [
  'actionStart',
  'actionEnd',
  'supporterCount',
  '',
] as const
export type ProjectSortKey = (typeof PROJECT_SORT_KEYS)[number]
