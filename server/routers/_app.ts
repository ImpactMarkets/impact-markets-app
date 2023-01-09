import { superjson } from '@/lib/transformer'

import { createRouter } from '../createRouter'
import { certificateRouter } from './certificate'
import { commentRouter } from './comment'
import { holdingRouter } from './holding'
import { projectRouter } from './project'
import { transactionRouter } from './transaction'
import { userRouter } from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('project.', projectRouter)
  .merge('certificate.', certificateRouter)
  .merge('comment.', commentRouter)
  .merge('holding.', holdingRouter)
  .merge('transaction.', transactionRouter)
  .merge('user.', userRouter)

export type AppRouter = typeof appRouter
