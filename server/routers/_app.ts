import { superjson } from '@/lib/transformer'

import { createRouter } from '../createRouter'
import { certificateRouter } from './certificate'
import { commentRouter } from './comment'
import { donationRouter } from './donation'
import { eventRouter } from './event'
import { holdingRouter } from './holding'
import { projectRouter } from './project'
import { transactionRouter } from './transaction'
import { userRouter } from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('project.', projectRouter)
  .merge('donation.', donationRouter)
  .merge('certificate.', certificateRouter)
  .merge('comment.', commentRouter)
  .merge('event.', eventRouter)
  .merge('holding.', holdingRouter)
  .merge('transaction.', transactionRouter)
  .merge('user.', userRouter)

export type AppRouter = typeof appRouter
