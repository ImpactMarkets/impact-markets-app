import { superjson } from '@/lib/transformer'

import { createRouter } from '../createRouter'
import { bountyRouter } from './bounty'
import { certificateRouter } from './certificate'
import { commentRouter } from './comment'
import { donationRouter } from './donation'
import { holdingRouter } from './holding'
import { jobRouter } from './job'
import { projectRouter } from './project'
import { userRouter } from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('project.', projectRouter)
  .merge('donation.', donationRouter)
  .merge('bounty.', bountyRouter)
  .merge('certificate.', certificateRouter)
  .merge('comment.', commentRouter)
  .merge('holding.', holdingRouter)
  .merge('user.', userRouter)
  .merge('job.', jobRouter)

export type AppRouter = typeof appRouter
