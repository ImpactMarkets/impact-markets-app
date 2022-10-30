import transformer from 'trpc-transformer'

import * as trpc from '@trpc/server'

import { Context } from './context'

export function createRouter() {
  return trpc.router<Context>().transformer(transformer)
}
