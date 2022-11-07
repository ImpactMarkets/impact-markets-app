import * as trpc from '@trpc/server'

import { Context } from './context'

const trpcRouter = () => trpc.router<Context>()

export const router = trpcRouter()

const init = router.middleware<Context>

export type MiddlewareFunction = Parameters<typeof init>[0]
