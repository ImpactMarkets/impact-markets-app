import { Context } from 'server/context'
import slugify from 'slugify'
import { z } from 'zod'

import { getQuarterDates } from '@/components/utils'
import { PROJECT_SORT_KEYS, ProjectSortKey } from '@/lib/constants'
import { markdownToHtml, markdownToPlainHtml } from '@/lib/editor'
import { EventStatus, EventType, Prisma, User } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { protectedProcedure } from '../procedures'
import { router } from '../router'

async function getQuarterDonationTotal(
  ctx: Context,
  id: string,
  startDate: Date,
  endDate: Date,
) {
  const quarterResult: {
    quarterDonationTotal: Prisma.Decimal
  }[] = await ctx.prisma.$queryRaw`
    SELECT
        COALESCE(SUM(amount), 0) AS "quarterDonationTotal"
    FROM
        "Donation"
    WHERE
        "projectId" = ${id}
        AND "state" = 'CONFIRMED'
        AND "time" >= ${startDate.toISOString()}::timestamp
        AND "time" <= ${endDate.toISOString()}::timestamp
  `
  return quarterResult[0]?.quarterDonationTotal ?? 0
}

const getOrderBy = (
  orderByKey: ProjectSortKey | undefined,
): Prisma.ProjectOrderByWithRelationInput[] => {
  const { desc } = Prisma.SortOrder
  const orderOptions = {
    createdAt: [{ createdAt: desc }],
    credits: [{ credits: desc }],
    supportScore: [
      {
        supportScore: {
          score: desc,
        },
      },
    ],
    likeCount: [
      {
        likedBy: {
          _count: desc,
        },
      },
    ],
  }
  const orderBy = orderByKey && orderOptions[orderByKey]
  if (!orderBy) {
    return [{ createdAt: desc }]
  }
  return orderBy
}

export const projectRouter = router({
  feed: protectedProcedure
    .input(
      z
        .object({
          take: z.number().min(1).max(60).optional(),
          skip: z.number().min(1).optional(),
          authorId: z.string().optional(),
          filterTags: z.array(z.string()).optional(),
          orderBy: z.enum(PROJECT_SORT_KEYS).optional(),
          showHidden: z.boolean().optional(),
          showClosed: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const { asc, desc } = Prisma.SortOrder
      const take = input?.take ?? 60
      const skip = input?.skip
      const showHidden = input?.showHidden ?? true
      const baseQuery: Array<Prisma.ProjectWhereInput> | undefined =
        ctx.session?.user.role === 'ADMIN' && showHidden
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
        paymentUrl: input?.showClosed ? undefined : { contains: '/' },
      }

      const projects = await ctx.prisma.project.findMany({
        take,
        skip,
        orderBy: [
          { supportScore: { isFundraising: desc } },
          ...getOrderBy(input?.orderBy),
          { id: asc },
        ],
        where,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          hidden: true,
          tags: true,
          credits: true,
          fundingGoal: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          donations: {
            select: {
              id: true,
              time: true,
              amount: true,
              user: true,
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
          supportScore: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      })

      const projectCount = await ctx.prisma.project.count({
        where,
      })

      // calculate quarterDonationTotal for each project
      const { startDate, endDate } = getQuarterDates()
      const projectsWithQuarterDonations = await Promise.all(
        projects.map(async (project) => {
          const { id } = project
          const quarterDonationTotal = await getQuarterDonationTotal(
            ctx,
            id,
            startDate,
            endDate,
          )
          return {
            ...project,
            quarterDonationTotal,
          }
        }),
      )

      return {
        projects: projectsWithQuarterDonations,
        projectCount,
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
      const project = await ctx.prisma.project.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
          actionStart: true,
          actionEnd: true,
          paymentUrl: true,
          fundingGoal: true,
          tags: true,
          credits: true,
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
              category: true,
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
                  projectId: true,
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
          supportScore: true,
          _count: {
            select: {
              comments: true,
              likedBy: true,
            },
          },
        },
      })

      // Move to permissions middleware
      const projectBelongsToUser = project?.author.id === ctx.session?.user.id

      if (
        !project ||
        (project.hidden &&
          !projectBelongsToUser &&
          ctx.session?.user.role !== 'ADMIN')
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No project with id '${id}'`,
        })
      }

      const result: {
        donationTotal: Prisma.Decimal
        donationCount: number
      }[] = await ctx.prisma.$queryRaw`
        SELECT
            COALESCE(SUM(amount), 0) AS "donationTotal",
            count(1) AS "donationCount"
        FROM
            "Donation"
        WHERE
            "projectId" = ${id}
            AND "state" = 'CONFIRMED'
      `
      const { startDate, endDate } = getQuarterDates()
      const quarterDonationTotal = await getQuarterDonationTotal(
        ctx,
        id,
        startDate,
        endDate,
      )

      return {
        ...project,
        ...result[0],
        quarterDonationTotal,
      }
    }),
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const query = slugify(input.query, ' & ')
      const projects = await ctx.prisma.project.findMany({
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
        orderBy: {
          _relevance: {
            fields: ['title'],
            search: query,
            sort: 'desc',
          },
        },
      })

      return projects.map(({ id, ...rest }) => ({
        id,
        link: '/project/' + id,
        ...rest,
      }))
    }),
  add: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        content: z.string().min(1),
        actionStart: z.date().nullable(),
        actionEnd: z.date().nullable(),
        paymentUrl: z.string(),
        fundingGoal: z.string(),
        tags: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          id: input.id,
          title: input.title,
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          actionStart: input.actionStart,
          actionEnd: input.actionEnd,
          paymentUrl: input.paymentUrl,
          fundingGoal: input.fundingGoal ?? '0',
          tags: input.tags,
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
      emitNewProjectEvents(ctx, project)

      return project
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        data: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
          actionStart: z.date().nullable(),
          actionEnd: z.date().nullable(),
          paymentUrl: z.string(),
          fundingGoal: z.string(),
          tags: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input
      const updatedproject = await ctx.prisma.project.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          contentHtml: markdownToHtml(data.content),
          actionStart: data.actionStart,
          actionEnd: data.actionEnd,
          paymentUrl: data.paymentUrl,
          fundingGoal: data.fundingGoal,
          tags: data.tags,
        },
      })

      return updatedproject
    }),
  like: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
      await ctx.prisma.likedProject.create({
        data: {
          project: {
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
      await ctx.prisma.likedProject.delete({
        where: {
          projectId_userId: {
            projectId: id,
            userId: ctx.session!.user.id,
          },
        },
      })

      return id
    }),
  hide: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
      const project = await ctx.prisma.project.update({
        where: { id },
        data: {
          hidden: true,
        },
        select: {
          id: true,
        },
      })
      return project
    }),
  unhide: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
      const project = await ctx.prisma.project.update({
        where: { id },
        data: {
          hidden: false,
        },
        select: {
          id: true,
        },
      })
      return project
    }),
  topContributors: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input: { id } }) => {
      const isAdmin = ctx.session?.user.role === 'ADMIN'
      return await ctx.prisma.contribution.findMany({
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              userScore: true,
              prefersAnonymity: true,
            },
          },
          totalAmount: true,
          contribution: true,
        },
        where: {
          projectId: id,
          user: isAdmin
            ? undefined
            : {
                prefersAnonymity: false,
              },
        },
        orderBy: {
          contribution: 'desc',
        },
        take: 10,
      })
    }),
})

async function emitNewProjectEvents(
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
      prefersProjectNotifications: true,
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
        type: EventType.PROJECT,
        parameters: {
          objectId: id,
          objectType: 'project',
          objectTitle: title,
          text: `**New project by ${author.name}:** “${summary}”`,
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
