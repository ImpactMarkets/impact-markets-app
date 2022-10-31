import superjson from 'superjson'

import { createRouter } from '../create-router'
import { certificateRouter } from './certificate'
import { commentRouter } from './comment'
import { holdingRouter } from './holding'
import { transactionRouter } from './transaction'
import { userRouter } from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('certificate.', certificateRouter)
  .merge('comment.', commentRouter)
  .merge('holding.', holdingRouter)
  .merge('transaction.', transactionRouter)
  .merge('user.', userRouter)

export type AppRouter = typeof appRouter
