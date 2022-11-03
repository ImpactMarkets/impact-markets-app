import { Prisma } from '@prisma/client'

export const DEFAULT_VALUATION = new Prisma.Decimal(1)
export const DEFAULT_TARGET = new Prisma.Decimal(1e5)
export const SHARE_COUNT = 1e5
