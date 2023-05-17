import { Context } from 'server/context'
import slugify from 'slugify'
import { z } from 'zod'

import { PROJECT_SORT_KEYS, ProjectSortKey } from '@/lib/constants'
import { markdownToHtml } from '@/lib/editor'
import { Prisma, User } from '@prisma/client'
import { EventStatus, EventType, Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createProtectedRouter } from '../createProtectedRouter'

const getOrderBy = (
  orderByKey: ProjectSortKey | undefined
): Prisma.ProjectOrderByWithRelationAndSearchRelevanceInput => {
  const { desc } = Prisma.SortOrder
  const { last } = Prisma.NullsOrder
  const orderOptions = {
    createdAt: { createdAt: desc },
    actionStart: { actionStart: { sort: desc, nulls: last } },
    actionEnd: { actionEnd: { sort: desc, nulls: last } },
    supporterCount: {
      donations: {
        _count: desc,
      },
    },
  }
  const orderBy = orderByKey && orderOptions[orderByKey]
  if (!orderBy) {
    return { createdAt: desc }
  }
  return orderBy
}

export const projectRouter = createProtectedRouter()
  .query('feed', {
    input: z
      .object({
        take: z.number().min(1).max(60).optional(),
        skip: z.number().min(1).optional(),
        authorId: z.string().optional(),
        filterTags: z.string().optional(),
        orderBy: z.enum(PROJECT_SORT_KEYS).optional(),
      })
      .optional(),
    async resolve({ input, ctx }) {
      const take = input?.take ?? 60
      const skip = input?.skip
      const baseQuery: Array<Prisma.ProjectWhereInput> | undefined =
        ctx.session?.user.role === 'ADMIN'
          ? undefined
          : [{ hidden: false }, { authorId: ctx.session?.user.id }]
      const where = {
        OR: baseQuery,
        AND: input?.filterTags
          ? input.filterTags.split(',').map((tag) => ({
              tags: {
                contains: tag.toLowerCase(),
              },
            }))
          : undefined,
        authorId: input?.authorId,
      }

      const projects = await ctx.prisma.project.findMany({
        take,
        skip,
        orderBy: [getOrderBy(input?.orderBy), { id: Prisma.SortOrder.asc }],
        where,
        select: {
          id: true,
          title: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
          tags: true,
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

      return {
        projects,
        projectCount,
      }
    },
  })
  .query('detail', {
    input: z.object({
      id: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
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
          tags: true,
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              paymentUrl: true,
              proofUrl: true,
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

      return { ...project, ...result[0] }
    },
  })
  .query('search', {
    input: z.object({
      query: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
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
      })

      return projects.map(({ id, ...rest }) => ({
        id,
        link: '/project/' + id,
        ...rest,
      }))
    },
  })
  .mutation('add', {
    input: z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      content: z.string().min(1),
      actionStart: z.date().nullable(),
      actionEnd: z.date().nullable(),
      paymentUrl: z.string(),
      tags: z.string(),
    }),
    async resolve({ ctx, input }) {
      const project = await ctx.prisma.project.create({
        data: {
          id: input.id,
          title: input.title,
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          actionStart: input.actionStart,
          actionEnd: input.actionEnd,
          paymentUrl: input.paymentUrl,
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
        },
      })

      // We don't wait for the events to emit before continuing.
      emitNewProjectEvents(ctx, project)

      return project
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.string().min(1),
      data: z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        actionStart: z.date().nullable(),
        actionEnd: z.date().nullable(),
        paymentUrl: z.string(),
        tags: z.string(),
      }),
    }),
    async resolve({ ctx, input }) {
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
          tags: data.tags,
        },
      })

      return updatedproject
    },
  })
  .mutation('like', {
    input: z.string().min(1),
    async resolve({ input: id, ctx }) {
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
    },
  })
  .mutation('unlike', {
    input: z.string().min(1),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.likedProject.delete({
        where: {
          projectId_userId: {
            projectId: id,
            userId: ctx.session!.user.id,
          },
        },
      })

      return id
    },
  })
  .mutation('hide', {
    input: z.string().min(1),
    async resolve({ input: id, ctx }) {
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
    },
  })
  .mutation('unhide', {
    input: z.string().min(1),
    async resolve({ input: id, ctx }) {
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
    },
  })

async function emitNewProjectEvents(
  ctx: Context,
  {
    id,
    title,
    author,
  }: {
    id: string
    title: string
    author: User
  }
) {
  const adminUsers = await ctx.prisma.user.findMany({
    where: {
      role: Role.ADMIN,
    },
    select: {
      id: true,
    },
  })

  for (const adminUser of adminUsers) {
    await ctx.prisma.event.create({
      data: {
        type: EventType.PROJECT,
        parameters: {
          objectId: id,
          objectType: 'project',
          objectTitle: title,
          text: `Project created by **${author.name}**`,
        },
        status: EventStatus.PENDING,
        recipient: {
          connect: {
            id: adminUser.id,
          },
        },
      },
    })
  }
}
