import { Context } from 'server/context'
import slugify from 'slugify'
import { z } from 'zod'

import {
  BountyStatus,
  EventStatus,
  EventType,
  Prisma,
  User,
} from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { BOUNTY_SORT_KEYS, BountySortKey } from '@/lib/constants'
import { markdownToHtml, markdownToPlainHtml } from '@/lib/editor'

import { protectedProcedure } from '../procedures'
import { router } from '../router'

const getOrderBy = (
  orderByKey: BountySortKey | undefined,
): Prisma.BountyOrderByWithRelationInput => {
  const orderOptions = {
    createdAt: { createdAt: Prisma.SortOrder.desc },
    deadline: { deadline: Prisma.SortOrder.asc },
    size: { size: Prisma.SortOrder.desc },
    likeCount: { likedBy: { _count: Prisma.SortOrder.desc } },
  }
  const orderBy = orderByKey && orderOptions[orderByKey]
  if (!orderBy) {
    return { createdAt: Prisma.SortOrder.desc }
  }
  return orderBy
}

export const bountyRouter = router({
  feed: protectedProcedure
    .input(
      z
        .object({
          take: z.number().min(1).max(60).optional(),
          skip: z.number().min(1).optional(),
          authorId: z.string().optional(),
          filterTags: z.array(z.string()).optional(),
          orderBy: z.enum(BOUNTY_SORT_KEYS).optional(),
          showClosed: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const take = input?.take ?? 60
      const skip = input?.skip
      const baseQuery: Array<Prisma.BountyWhereInput> | undefined =
        ctx.session?.user.role === 'ADMIN'
          ? undefined
          : [{ hidden: false }, { authorId: ctx.session?.user.id }]
      const where = {
        OR: baseQuery,
        AND: input?.filterTags
          ? input.filterTags.map((tag) => ({
              tags: {
                contains: tag.toLowerCase(),
              },
            }))
          : undefined,
        authorId: input?.authorId,
      }

      const bounties = await ctx.prisma.bounty.findMany({
        take,
        skip,
        orderBy: [getOrderBy(input?.orderBy), { id: Prisma.SortOrder.asc }],
        where,
        select: {
          id: true,
          title: true,
          contentHtml: true,
          createdAt: true,
          size: true,
          deadline: true,
          sourceUrl: true,
          status: true,
          hidden: true,
          tags: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          likedBy: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      })

      const bountyCount = await ctx.prisma.bounty.count({
        where,
      })

      return {
        bounties,
        bountyCount,
      }
    }),
  detail: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input
      const bounty = await ctx.prisma.bounty.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          contentHtml: true,
          size: true,
          deadline: true,
          sourceUrl: true,
          status: true,
          createdAt: true,
          hidden: true,
          tags: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              paymentUrl: true,
              proofUrl: true,
              contact: true,
              bio: true,
            },
          },
          likedBy: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          comments: {
            where: {
              parentId: null,
            },
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              content: true,
              contentHtml: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              parent: true,
              children: {
                orderBy: {
                  createdAt: 'asc',
                },
                select: {
                  id: true,
                  bountyId: true,
                  content: true,
                  contentHtml: true,
                  createdAt: true,
                  author: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                  parent: true,
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
              likedBy: true,
            },
          },
        },
      })

      // Move to permissions middleware
      const bountyBelongsToUser = bounty?.author.id === ctx.session?.user.id

      if (
        !bounty ||
        (bounty.hidden &&
          !bountyBelongsToUser &&
          ctx.session?.user.role !== 'ADMIN')
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No bounty with id '${id}'`,
        })
      }

      return bounty
    }),
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const query = slugify(input.query, ' & ')
      const bounties = await ctx.prisma.bounty.findMany({
        take: 10,
        where: {
          OR:
            ctx.session?.user.role === 'ADMIN'
              ? undefined
              : [{ hidden: false }, { authorId: ctx.session?.user.id }],
          title: { search: query },
          content: { search: query },
        },
        select: {
          id: true,
          title: true,
        },
      })

      return bounties.map(({ id, ...rest }) => ({
        id,
        link: '/bounty/' + id,
        ...rest,
      }))
    }),
  add: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        content: z.string().min(1),
        size: z.instanceof(Prisma.Decimal),
        deadline: z.date().nullable(),
        sourceUrl: z.string(),
        tags: z.string(),
        status: z.nativeEnum(BountyStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const bounty = await ctx.prisma.bounty.create({
        data: {
          id: input.id,
          title: input.title,
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          size: input.size,
          sourceUrl: input.sourceUrl,
          deadline: input.deadline,
          tags: input.tags,
          status: input.status,
          author: {
            connect: {
              id: ctx.session!.user.id,
            },
          },
        },
        select: {
          id: true,
          title: true,
          author: true,
          content: true,
        },
      })

      // We don't wait for the events to emit before continuing.
      emitNewBountyEvents(ctx, bounty)

      return bounty
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        data: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
          deadline: z.date().nullable(),
          size: z.instanceof(Prisma.Decimal),
          sourceUrl: z.string(),
          tags: z.string(),
          status: z.nativeEnum(BountyStatus),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input
      const updatedbounty = await ctx.prisma.bounty.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          contentHtml: markdownToHtml(data.content),
          size: data.size,
          deadline: data.deadline,
          sourceUrl: data.sourceUrl,
          tags: data.tags,
          status: data.status,
        },
      })

      return updatedbounty
    }),
  like: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
      await ctx.prisma.likedBounty.create({
        data: {
          bounty: {
            connect: {
              id,
            },
          },
          user: {
            connect: {
              id: ctx.session!.user.id,
            },
          },
        },
      })

      return id
    }),
  unlike: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
      await ctx.prisma.likedBounty.delete({
        where: {
          bountyId_userId: {
            bountyId: id,
            userId: ctx.session!.user.id,
          },
        },
      })

      return id
    }),
  hide: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
      const bounty = await ctx.prisma.bounty.update({
        where: { id },
        data: {
          hidden: true,
        },
        select: {
          id: true,
        },
      })
      return bounty
    }),
  unhide: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
      const bounty = await ctx.prisma.bounty.update({
        where: { id },
        data: {
          hidden: false,
        },
        select: {
          id: true,
        },
      })
      return bounty
    }),
})

async function emitNewBountyEvents(
  ctx: Context,
  {
    id,
    title,
    author,
    content,
  }: {
    id: string
    title: string
    author: User
    content: string
  },
) {
  const subscribers = await ctx.prisma.user.findMany({
    where: {
      prefersBountyNotifications: true,
      email: { contains: '@' },
    },
    select: {
      id: true,
    },
  })

  let summary = content
  if (summary.length > 300) {
    summary = summary.substring(0, 300) + '…'
  }
  summary = markdownToPlainHtml(summary)

  for (const subscriber of subscribers) {
    if (subscriber.id === author.id) {
      continue
    }
    await ctx.prisma.event.create({
      data: {
        type: EventType.BOUNTY,
        parameters: {
          objectId: id,
          objectType: 'bounty',
          objectTitle: title,
          text: `**New bounty by ${author.name}:** “${summary}”`,
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
