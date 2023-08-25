import superjson from 'superjson'

import { initTRPC } from '@trpc/server'

import { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    return opts.shape
  },
})

export const router = t.router

export const publicProcedure = t.procedure

export const middleware = t.middleware

export type MiddlewareFunction = Parameters<typeof middleware>[0]

export const mergeRouters = t.mergeRouters
