import { Context } from 'server/context'
import { z } from 'zod'

import { markdownToHtml } from '@/lib/editor'
import { selects } from '@/lib/notifyemail'
import { EventStatus, EventType } from '@prisma/client'

import { createProtectedRouter } from '../createProtectedRouter'

export const commentRouter = createProtectedRouter()
  .mutation('add', {
    input: z.object({
      objectId: z.string().min(1),
      objectType: z.enum(['project', 'bounty']),
      content: z.string().min(1),
      parentId: z.optional(z.number().int()),
    }),
    async resolve({ ctx, input }) {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          author: {
            connect: {
              id: ctx.session!.user.id,
            },
          },
          [input.objectType]: {
            connect: {
              id: input.objectId,
            },
          },
          ...(input.parentId && {
            parent: {
              connect: {
                id: input.parentId,
              },
            },
          }),
        },
      })

      // We don't wait for the event to emit before continuing.
      emitNewCommentEvent(ctx, input.objectId, input.objectType, comment.id)

      return comment
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: z.object({
        content: z.string().min(1),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input
      const updatedComment = await ctx.prisma.comment.update({
        where: { id },
        data: {
          content: data.content,
          contentHtml: markdownToHtml(data.content),
        },
      })
      return updatedComment
    },
  })
  .mutation('delete', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.comment.delete({ where: { id } })
      return id
    },
  })

async function emitNewCommentEvent(
  ctx: Context,
  objectId: string,
  objectType: 'project' | 'bounty',
  commentId: number
) {
  const query = {
    where: {
      id: objectId,
    },
    select: selects[objectType],
  }
  // The straightforward ctx.prisma[objectType].findUnique(query) caused opaque type errors
  const commentee =
    objectType === 'project'
      ? await ctx.prisma.project.findUnique(query)
      : await ctx.prisma.bounty.findUnique(query)

  await ctx.prisma.event.create({
    data: {
      type: EventType.COMMENT,
      parameters: {
        objectId: objectId,
        objectType: objectType,
        commentId: commentId,
      },
      status: EventStatus.PENDING || undefined,
      recipient: {
        connect: {
          id: commentee?.author.id,
        },
      },
    },
  })
}
