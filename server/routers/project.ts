import slugify from 'slugify'
import { z } from 'zod'

import { CERT_SORT_KEYS, CertSortKey } from '@/lib/constants'
import { markdownToHtml } from '@/lib/editor'
import { postToSlackIfEnabled } from '@/lib/slack'
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createProtectedRouter } from '../createProtectedRouter'

const getOrderBy = (
  orderByKey: CertSortKey | undefined
):
  | Prisma.Enumerable<Prisma.projectOrderByWithRelationAndSearchRelevanceInput>
  | undefined => {
  const orderOptions = {
    actionStart: { actionStart: Prisma.SortOrder.desc },
    actionEnd: { actionEnd: Prisma.SortOrder.desc },
    supporterCount: {
      holdings: {
        // Sadly not supported:
        // where: {
        //   size: { gt: 0 },
        //   type: { in: ['OWNERSHIP', 'CONSUMPTION'] },
        // },
        _count: Prisma.SortOrder.desc,
      },
    },
  }
  const orderBy = orderByKey && orderOptions[orderByKey]
  if (!orderBy) {
    return { createdAt: Prisma.SortOrder.desc }
  }
  return orderBy
}

export const projectRouter = createProtectedRouter()
  .query('feed', {
    input: z
      .object({
        take: z.number().min(1).max(50).optional(),
        skip: z.number().min(1).optional(),
        authorId: z.string().optional(),
        filterTags: z.string().optional(),
        orderBy: z.enum(CERT_SORT_KEYS).optional(),
      })
      .optional(),
    async resolve({ input, ctx }) {
      const take = input?.take ?? 50
      const skip = input?.skip
      const baseQuery: Array<Prisma.projectWhereInput> | undefined =
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
        orderBy: getOrderBy(input?.orderBy),
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
          issuers: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          holdings: {
            select: {
              id: true,
              type: true,
              size: true,
              user: true,
              sellTransactions: { where: { state: 'PENDING' } },
            },
            where: { size: { gt: 0 } },
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
        // For the redirect from old to new project URLs
        where: isNaN(Number(id)) ? { id } : { oldId: Number(id) },
        select: {
          id: true,
          oldId: true,
          title: true,
          content: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
          attributedImpactVersion: true,
          counterfactual: true,
          location: true,
          rights: true,
          actionStart: true,
          actionEnd: true,
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
          issuers: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  email: true,
                },
              },
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

      return project
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
          hidden: false,
          title: { search: query },
          content: { search: query },
        },
        select: {
          id: true,
          title: true,
        },
      })

      return projects
    },
  })
  .mutation('add', {
    input: z.object({
      id: z.string().min(1),
      title: z.string().min(1),
      content: z.string().min(1),
      attributedImpactVersion: z.string().min(1),
      counterfactual: z.string(),
      location: z.string(),
      rights: z.string(),
      actionStart: z.date(),
      actionEnd: z.date(),
      tags: z.string(),
      issuerEmails: z.string(),
      valuation: z.instanceof(Prisma.Decimal),
      target: z.instanceof(Prisma.Decimal),
    }),
    async resolve({ ctx, input }) {
      const project = await ctx.prisma.project.create({
        data: {
          id: input.id,
          title: input.title,
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          attributedImpactVersion: input.attributedImpactVersion,
          counterfactual: input.counterfactual,
          location: input.location,
          rights: 'RETROACTIVE_FUNDING',
          actionStart: input.actionStart,
          actionEnd: input.actionEnd,
          tags: input.tags,
          author: {
            connect: {
              id: ctx.session!.user.id,
            },
          },
        },
      })
      await ctx.prisma.holding.create({
        data: {
          projectId: project.id,
          userId: ctx.session!.user.id,
          type: 'OWNERSHIP',
          size: 1,
          cost: 0,
          valuation: input.valuation,
          target: input.target,
        },
      })
      const issuerEmails = input.issuerEmails
        .split(',')
        .concat([ctx.session!.user.email])
      const issuers = await ctx.prisma.user.findMany({
        where: { email: { in: issuerEmails } },
      })
      await ctx.prisma.projectIssuer.createMany({
        data: issuers.map((issuer) => {
          return { projectId: project.id, userId: issuer.id }
        }),
        skipDuplicates: true,
      })

      await postToSlackIfEnabled({
        project,
        authorName: ctx.session!.user.name,
      })

      return project
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.string().min(1),
      data: z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        attributedImpactVersion: z.string().min(1),
        counterfactual: z.string(),
        location: z.string(),
        rights: z.string(),
        actionStart: z.date(),
        actionEnd: z.date(),
        issuerEmails: z.string(),
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
          attributedImpactVersion: data.attributedImpactVersion,
          counterfactual: data.counterfactual,
          location: data.location,
          rights: 'RETROACTIVE_FUNDING',
          actionStart: data.actionStart,
          actionEnd: data.actionEnd,
          tags: data.tags,
        },
      })

      const issuerEmails = input.data.issuerEmails
        .split(',')
        .concat([ctx.session!.user.email])
      // Delete all existing projectIssuer associations for this project, and create
      // new ones based on the input
      const issuers = await ctx.prisma.user.findMany({
        where: { email: { in: issuerEmails } },
      })
      ctx.prisma.$transaction([
        ctx.prisma.projectIssuer.deleteMany({
          where: { projectId: updatedproject.id },
        }),
        ctx.prisma.projectIssuer.createMany({
          data: issuers.map((issuer) => {
            return { projectId: updatedproject.id, userId: issuer.id }
          }),
          skipDuplicates: true,
        }),
      ])

      return updatedproject
    },
  })
  .mutation('like', {
    input: z.string().min(1),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.likedproject.create({
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
      await ctx.prisma.likedproject.delete({
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
