import superjson from 'superjson'

import { createRouter } from '../create-router'
import { certificateRouter } from './certificate'
import { commentRouter } from './comment'
import { userRouter } from './user'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('certificate.', certificateRouter)
  .merge('comment.', commentRouter)
  .merge('user.', userRouter)

export type AppRouter = typeof appRouter
