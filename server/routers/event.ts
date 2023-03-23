import { z } from 'zod'

import { EventStatus, EventType } from '@prisma/client'

import { createProtectedRouter } from '../createProtectedRouter'

export const eventRouter = createProtectedRouter()
  .query('feed', {
    input: z.object({
      status: z.nativeEnum(EventStatus).optional(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.event.findMany({
        orderBy: [
          {
            recipientId: 'desc',
          },
          {
            type: 'desc',
          },
          {
            time: 'asc',
          },
        ],
        where: {
          status: input.status || undefined,
        },
        select: {
          id: true,
          time: true,
          type: true,
          parameters: true,
          status: true,
          recipient: true,
        },
      })
    },
  })
  .mutation('add', {
    input: z.object({
      type: z.nativeEnum(EventType),
      parameters: z.string().min(1),
      status: z.nativeEnum(EventStatus).optional(),
      recipientId: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      const event = await ctx.prisma.event.create({
        data: {
          type: input.type,
          parameters: input.parameters,
          status: input.status || undefined,
          recipient: {
            connect: {
              id: input.recipientId,
            },
          },
        },
      })

      return event
    },
  })
  .mutation('complete', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      return await ctx.prisma.event.update({
        where: { id },
        data: {
          status: EventStatus.COMPLETED,
        },
      })
    },
  })
  .mutation('drop', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      return await ctx.prisma.event.update({
        where: { id },
        data: {
          status: EventStatus.DROPPED,
        },
      })
    },
  })
  .mutation('delete', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.event.delete({ where: { id } })
      return id
    },
  })
