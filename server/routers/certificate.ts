import slugify from 'slugify'
import { z } from 'zod'

import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { CERTIFICATE_SORT_KEYS, CertificateSortKey } from '@/lib/constants'
import { markdownToHtml } from '@/lib/editor'

import { protectedProcedure } from '../procedures'
import { router } from '../router'

const getOrderBy = (
  orderByKey: CertificateSortKey | undefined,
):
  | Prisma.Enumerable<Prisma.CertificateOrderByWithRelationAndSearchRelevanceInput>
  | undefined => {
  const orderOptions = {
    createdAt: { createdAt: Prisma.SortOrder.desc },
    actionStart: { actionStart: Prisma.SortOrder.desc },
    actionEnd: { actionEnd: Prisma.SortOrder.desc },
    likeCount: {
      likedBy: {
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

export const certificateRouter = router({
  feed: protectedProcedure
    .input(
      z
        .object({
          take: z.number().min(1).max(60).optional(),
          skip: z.number().min(1).optional(),
          authorId: z.string().optional(),
          filterTags: z.string().optional(),
          orderBy: z.enum(CERTIFICATE_SORT_KEYS).optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const take = input?.take ?? 60
      const skip = input?.skip
      const baseQuery: Array<Prisma.CertificateWhereInput> | undefined =
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

      const certificates = await ctx.prisma.certificate.findMany({
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
        },
      })

      const certificateCount = await ctx.prisma.certificate.count({
        where,
      })

      return {
        certificates,
        certificateCount,
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
      const certificate = await ctx.prisma.certificate.findUnique({
        // For the redirect from old to new certificate URLs
        where: isNaN(Number(id)) ? { id } : { oldId: Number(id) },
        select: {
          id: true,
          oldId: true,
          title: true,
          content: true,
          contentHtml: true,
          createdAt: true,
          hidden: true,
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
              contact: true,
              bio: true,
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
          _count: {
            select: {
              likedBy: true,
            },
          },
        },
      })

      const certificateBelongsToUser =
        certificate?.author.id === ctx.session?.user.id

      if (
        !certificate ||
        (certificate.hidden &&
          !certificateBelongsToUser &&
          ctx.session?.user.role !== 'ADMIN')
      ) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No certificate with id '${id}'`,
        })
      }

      return certificate
    }),
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const query = slugify(input.query, ' & ')
      const certificates = await ctx.prisma.certificate.findMany({
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

      return certificates
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        data: z.object({
          title: z.string().min(1),
          content: z.string().min(1),
          counterfactual: z.string(),
          location: z.string(),
          rights: z.string(),
          actionStart: z.date(),
          actionEnd: z.date(),
          issuerEmails: z.string(),
          tags: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input
      const updatedCertificate = await ctx.prisma.certificate.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
          contentHtml: markdownToHtml(data.content),
          counterfactual: data.counterfactual,
          location: data.location,
          rights: 'RETROACTIVE_FUNDING',
          actionStart: data.actionStart,
          actionEnd: data.actionEnd,
          tags: data.tags,
        },
        include: {
          author: true,
        },
      })

      const issuerEmails = input.data.issuerEmails
        .split(',')
        .concat([updatedCertificate.author.email || ''])
      // Delete all existing certificateIssuer associations for this certificate, and create
      // new ones based on the input
      const issuers = await ctx.prisma.user.findMany({
        where: { email: { in: issuerEmails } },
      })
      ctx.prisma.$transaction([
        ctx.prisma.certificateIssuer.deleteMany({
          where: { certificateId: updatedCertificate.id },
        }),
        ctx.prisma.certificateIssuer.createMany({
          data: issuers.map((issuer) => {
            return { certificateId: updatedCertificate.id, userId: issuer.id }
          }),
          skipDuplicates: true,
        }),
      ])

      return updatedCertificate
    }),
  like: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
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
    }),
  unlike: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
      await ctx.prisma.likedCertificate.delete({
        where: {
          certificateId_userId: {
            certificateId: id,
            userId: ctx.session!.user.id,
          },
        },
      })

      return id
    }),
  hide: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
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
    }),
  unhide: protectedProcedure
    .input(z.string().min(1))
    .mutation(async ({ input: id, ctx }) => {
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
    }),
})
