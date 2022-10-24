import { z } from 'zod'

import { markdownToHtml } from '@/lib/editor'
import { postToSlackIfEnabled } from '@/lib/slack'
import { TRPCError } from '@trpc/server'

import { createProtectedRouter } from '../create-protected-router'

export const certificateRouter = createProtectedRouter()
  .query('feed', {
    input: z
      .object({
        take: z.number().min(1).max(50).optional(),
        skip: z.number().min(1).optional(),
        authorId: z.string().optional(),
      })
      .optional(),
    async resolve({ input, ctx }) {
      const take = input?.take ?? 50
      const skip = input?.skip
      const where = {
        hidden: ctx.isUserAdmin ? undefined : false,
        authorId: input?.authorId,
      }

      const certificates = await ctx.prisma.certificate.findMany({
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
        where,
        select: {
          id: true,
          title: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
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

      const certificateCount = await ctx.prisma.certificate.count({
        where,
      })

      return {
        certificates,
        certificateCount,
      }
    },
  })
  .query('detail', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input
      const certificate = await ctx.prisma.certificate.findUnique({
        where: { id },
        select: {
          id: true,
          cuid: true,
          title: true,
          content: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
          attributedImpactVersion: true,
          counterfactual: true,
          proof: true,
          location: true,
          rights: true,
          actionStart: true,
          actionEnd: true,
          impactStart: true,
          impactEnd: true,
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
          comments: {
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

      const certificateBelongsToUser =
        certificate?.author.id === ctx.session!.user.id

      if (
        !certificate ||
        (certificate.hidden && !certificateBelongsToUser && !ctx.isUserAdmin)
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No certificate with id '${id}'`,
        })
      }

      return certificate
    },
  })
  .query('search', {
    input: z.object({
      query: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      const certificates = await ctx.prisma.certificate.findMany({
        take: 10,
        where: {
          hidden: false,
          title: { search: input.query },
          content: { search: input.query },
        },
        select: {
          id: true,
          title: true,
        },
      })

      return certificates
    },
  })
  .mutation('add', {
    input: z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      attributedImpactVersion: z.string().min(1),
      counterfactual: z.string().min(1),
      proof: z.string(),
      location: z.string(),
      rights: z.string(),
      actionStart: z.string().min(1),
      actionEnd: z.string().min(1),
      tags: z.string(),
    }),
    async resolve({ ctx, input }) {
      const certificate = await ctx.prisma.certificate.create({
        data: {
          title: input.title,
          content: input.content,
          contentHtml: markdownToHtml(input.content),
          attributedImpactVersion: input.attributedImpactVersion,
          counterfactual: input.counterfactual,
          proof: input.proof,
          location: input.location,
          rights: 'RETROACTIVE_FUNDING',
          actionStart: new Date(input.actionStart),
          actionEnd: new Date(input.actionEnd),
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
          certificateId: certificate.id,
          userId: ctx.session!.user.id,
          type: 'OWNERSHIP',
          size: 1,
          cost: 0,
        },
      })

      await postToSlackIfEnabled({
        certificate,
        authorName: ctx.session!.user.name,
      })

      return certificate
    },
  })
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        attributedImpactVersion: z.string().min(1),
        counterfactual: z.string().min(1),
        proof: z.string(),
        location: z.string(),
        rights: z.string(),
        actionStart: z.string().min(1),
        actionEnd: z.string().min(1),
        tags: z.string(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input
      const updatedCertificate = await ctx.prisma.certificate.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          contentHtml: markdownToHtml(data.content),
          attributedImpactVersion: data.attributedImpactVersion,
          counterfactual: data.counterfactual,
          proof: data.proof,
          location: data.location,
          rights: 'RETROACTIVE_FUNDING',
          actionStart: new Date(data.actionStart),
          actionEnd: new Date(data.actionEnd),
          tags: data.tags,
        },
      })

      return updatedCertificate
    },
  })
  .mutation('like', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.likedCertificate.create({
        data: {
          certificate: {
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
    input: z.number(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.likedCertificate.delete({
        where: {
          certificateId_userId: {
            certificateId: id,
            userId: ctx.session!.user.id,
          },
        },
      })

      return id
    },
  })
  .mutation('hide', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      const certificate = await ctx.prisma.certificate.update({
        where: { id },
        data: {
          hidden: true,
        },
        select: {
          id: true,
        },
      })
      return certificate
    },
  })
  .mutation('unhide', {
    input: z.number(),
    async resolve({ input: id, ctx }) {
      const certificate = await ctx.prisma.certificate.update({
        where: { id },
        data: {
          hidden: false,
        },
        select: {
          id: true,
        },
      })
      return certificate
    },
  })
