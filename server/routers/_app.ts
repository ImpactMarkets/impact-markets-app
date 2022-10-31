import superjson from 'superjson'

import { Prisma } from '@prisma/client'

import { createRouter } from '../create-router'
import { certificateRouter } from './certificate'
import { commentRouter } from './comment'
import { holdingRouter } from './holding'
import { transactionRouter } from './transaction'
import { userRouter } from './user'

// https://github.com/blitz-js/superjson/blob/12129e1172ed89c69e16c21f00e793618c68d197/README.md#recipes
superjson.registerCustom<Prisma.Decimal, string>(
  {
    isApplicable: (value): value is Prisma.Decimal =>
      Prisma.Decimal.isDecimal(value),
    serialize: (value) => value.toJSON(),
    deserialize: (value) => new Prisma.Decimal(value),
  },
  'decimal.js'
)

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('certificate.', certificateRouter)
  .merge('comment.', commentRouter)
  .merge('holding.', holdingRouter)
  .merge('transaction.', transactionRouter)
  .merge('user.', userRouter)

export type AppRouter = typeof appRouter
