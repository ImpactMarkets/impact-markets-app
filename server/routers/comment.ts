import { Context } from 'server/context'
import { z } from 'zod'

import { EventStatus, EventType } from '@prisma/client'

import { serverEnv } from '@/env/server'
import { markdownToHtml } from '@/lib/editor'

import { protectedProcedure } from '../procedures'
import { router } from '../router'

export const commentRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        objectId: z.string().min(1),
        objectType: z.enum(['project', 'bounty']),
        content: z.string().min(1),
        parentId: z.optional(z.number().int()),
        category: z.enum([
          'COMMENT',
          'Q_AND_A',
          'REASONING',
          'ENDORSEMENT',
          'REPLY',
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          category: input.category,
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
        select: {
          id: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          project: {
            select: {
              id: true,
              title: true,
              author: {
                select: { id: true, name: true },
              },
            },
          },
          bounty: {
            select: {
              id: true,
              title: true,
              author: { select: { id: true, name: true } },
            },
          },
        },
      })

      // We don't wait for the event to emit before continuing.
      emitNewCommentEvent(ctx, input.objectType, comment)

      return comment
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          content: z.string().min(1),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input
      const updatedComment = await ctx.prisma.comment.update({
        where: { id },
        data: {
          content: data.content,
          contentHtml: markdownToHtml(data.content),
        },
      })
      return updatedComment
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input: id, ctx }) => {
      await ctx.prisma.comment.delete({ where: { id } })
      return id
    }),
})

async function emitNewCommentEvent(
  ctx: Context,
  objectType: 'project' | 'bounty',
  {
    author,
    project,
    bounty,
  }: {
    author: {
      id: string
      name: string
    }
    project: {
      id: string
      title: string
      author: {
        id: string
        name: string
      }
    } | null
    bounty: {
      id: string
      title: string
      author: {
        id: string
        name: string
      }
    } | null
    id: number
  },
) {
  const commentee = objectType === 'project' ? project : bounty
  const subscribers = [commentee!.author, { id: serverEnv.IMPACT_MARKETS_USER }]
  for (const subscriber of subscribers) {
    if (!subscriber) continue
    await ctx.prisma.event.create({
      data: {
        type: EventType.COMMENT,
        parameters: {
          objectId: commentee!.id,
          objectType: objectType,
          objectTitle: commentee!.title,
          text: `**${author.name}** added a comment`,
        },
        status: EventStatus.PENDING,
        recipient: {
          connect: {
            id: subscriber.id,
          },
        },
      },
    })
  }
}
