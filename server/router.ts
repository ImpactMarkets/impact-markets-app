import { Context } from './context'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    return opts.shape;
  },
})

export const router = t.router

export const publicProcedure = t.procedure

export const middleware = t.middleware

export type MiddlewareFunction = Parameters<typeof middleware>[0]

export const mergeRouters = t.mergeRouters