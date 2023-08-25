import { router } from '../router'
import { bountyRouter } from './bounty'
import { certificateRouter } from './certificate'
import { commentRouter } from './comment'
import { donationRouter } from './donation'
import { holdingRouter } from './holding'
import { jobRouter } from './job'
import { projectRouter } from './project'
import { userRouter } from './user'

export const appRouter = router({
  project: projectRouter,
  donation: donationRouter,
  bounty: bountyRouter,
  certificate: certificateRouter,
  comment: commentRouter,
  holding: holdingRouter,
  user: userRouter,
  job: jobRouter,
})

export type AppRouter = typeof appRouter
