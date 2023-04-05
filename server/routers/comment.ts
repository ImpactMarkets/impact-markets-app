import { Context } from 'server/context'
import { z } from 'zod'

import { markdownToHtml } from '@/lib/editor'
import { projectSelect } from '@/lib/notifyemail'
import { EventStatus, EventType } from '@prisma/client'
import { Prisma } from '@prisma/client'

import { createProtectedRouter } from '../createProtectedRouter'

export const commentRouter = createProtectedRouter()
  .mutation('add', {
    input: z.object({
      projectId: z.string().min(1),
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
          project: {
            connect: {
              id: input.projectId,
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
      emitNewCommentEvent(ctx, input.projectId, comment.id)

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
  projectId: string,
  commentId: number
) {
  const project = await ctx.prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: projectSelect,
  })

  await ctx.prisma.event.create({
    data: {
      type: EventType.COMMENT,
      parameters: {
        projectId: projectId,
        commentId: commentId,
      } as Prisma.JsonObject,
      status: EventStatus.PENDING || undefined,
      recipient: {
        connect: {
          id: project?.author.id,
        },
      },
    },
  })
}
