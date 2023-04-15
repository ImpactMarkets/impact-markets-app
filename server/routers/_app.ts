import { superjson } from '@/lib/transformer'

import { createRouter } from '../createRouter'
import { bountyRouter } from './bounty'
import { certificateRouter } from './certificate'
import { commentRouter } from './comment'
import { donationRouter } from './donation'
import { eventRouter } from './event'
import { holdingRouter } from './holding'
import { jobRouter } from './job'
import { projectRouter } from './project'
import { transactionRouter } from './transaction'
import { userRouter } from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('project.', projectRouter)
  .merge('donation.', donationRouter)
  .merge('bounty.', bountyRouter)
  .merge('certificate.', certificateRouter)
  .merge('comment.', commentRouter)
  .merge('event.', eventRouter)
  .merge('holding.', holdingRouter)
  .merge('transaction.', transactionRouter)
  .merge('user.', userRouter)
  .merge('job.', jobRouter)

export type AppRouter = typeof appRouter
