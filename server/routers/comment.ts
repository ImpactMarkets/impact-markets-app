import { z } from 'zod'

import { markdownToHtml } from '@/lib/editor'

import { createProtectedRouter } from '../create-protected-router'

export const commentRouter = createProtectedRouter()
  .mutation('add', {
    input: z.object({
      certificateId: z.string().min(1),
      content: z.string().min(1),
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
          certificate: {
            connect: {
              id: input.certificateId,
            },
          },
        },
      })

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
