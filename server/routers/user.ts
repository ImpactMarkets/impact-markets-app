import { z } from 'zod'

import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createProtectedRouter } from '../createProtectedRouter'

export const userRouter = createProtectedRouter()
  .query('profile', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input
      const isOwnProfile = ctx.session?.userId === id
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          image: true,
          title: true,
          proofUrl: true,
          paymentUrl: true,
          prefersAnonymity: true,
          prefersEventNotifications: true,
          email: ctx.session?.user.role === 'ADMIN',
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No profile with id '${id}'`,
        })
      }

      return {
        ...user,
        name:
          user.prefersAnonymity && !isOwnProfile
            ? user.name[0] + '. Anonymous'
            : user.name,
      }
    },
  })
  .mutation('edit', {
    input: z.object({
      name: z.string().min(1),
      title: z.string().optional(),
      proofUrl: z.string().optional(),
      paymentUrl: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session!.user.id },
        data: {
          name: input.name,
          title: input.title,
          proofUrl: input.proofUrl,
          paymentUrl: input.paymentUrl,
        },
      })

      return user
    },
  })
  .mutation('update-avatar', {
    input: z.object({
      image: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session!.user.id },
        data: {
          image: input.image,
        },
      })

      return user
    },
  })
  .mutation('preferences', {
    input: z.object({
      prefersDetailView: z.boolean().optional(),
      prefersAnonymity: z.boolean().optional(),
      prefersEventNotifications: z.boolean().optional(),
    }),
    async resolve({
      input: { prefersDetailView, prefersAnonymity, prefersEventNotifications },
      ctx,
    }) {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session!.user.id },
        data: {
          prefersDetailView: prefersDetailView,
          prefersAnonymity: prefersAnonymity,
          prefersEventNotifications: prefersEventNotifications,
        },
      })

      return user
    },
  })
  .query('mentionList', {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: 'asc',
        },
      })

      return users
    },
  })
  .query('topRetirers', {
    async resolve({ ctx }) {
      const users: {
        id: string
        name: string
        image: string
        credits: Prisma.Decimal
      }[] = await ctx.prisma.$queryRaw`
        SELECT
          "User"."id",
          "User"."name",
          "User"."image",
          SUM("Certificate"."credits" * "Holding"."size") as "credits"
        FROM "User"
        JOIN "Holding" ON "User"."id" = "Holding"."userId"
        JOIN "Certificate" ON "Holding"."certificateId" = "Certificate"."id"
        WHERE "Certificate"."credits" > 0 and "Holding"."type" = 'CONSUMPTION'
        GROUP BY "User"."id", "User"."name", "User"."image"
        ORDER BY "credits" DESC;
      `
      return users
    },
  })
  .query('topDonors', {
    input: z.object({
      ignoreSize: z.boolean().optional(),
      pastDays: z.number().optional(),
    }),
    async resolve({ ctx, input: { ignoreSize = false, pastDays = 1e6 } }) {
      const users: {
        id: string
        name: string
        image: string
        prefersAnonymity: boolean
        totalCredits: Prisma.Decimal
      }[] = await ctx.prisma.$queryRaw`
        WITH
          raw_donations AS (
            SELECT
              "User"."id",
              "User"."name",
              "User"."image",
              "User"."prefersAnonymity",
              CASE
                WHEN ${ignoreSize} THEN 100
                ELSE "Donation"."amount"
              END as "amount",
              "Donation"."projectId",
              "Donation"."time",
              "Project"."credits"
            FROM "Donation"
            JOIN "User" ON "User"."id" = "Donation"."userId"
            JOIN "Project" ON "Donation"."projectId" = "Project"."id"
            WHERE
              "Project"."credits" > 0 AND
              "Donation"."state" = 'CONFIRMED' AND
              "Donation"."time" > now() - make_interval(days => ${pastDays}::int)
            ORDER BY "Donation"."projectId" ASC, "Donation"."time" ASC
          ),
          donations AS (
            SELECT
              "id",
              "name",
              "image",
              "prefersAnonymity",
              "projectId",
              "credits",
              "amount",
              (100 + SUM("amount")
                OVER (
                  PARTITION BY "projectId"
                  ORDER BY "time" ASC, "id" ASC
                )
              ) as "runningTotal",
              (100 + SUM("amount")
                OVER (
                  PARTITION BY "projectId"
                )
              ) as "projectTotal"
            FROM raw_donations
        ),
        contributions AS (
          SELECT
            "id",
            "name",
            "image",
            "amount",
            "projectId",
            "credits",
            "prefersAnonymity",
            "runningTotal",
            "projectTotal",
            "amount" / "runningTotal"::float as "contribution",
            SUM("amount" / "runningTotal"::float)
              OVER (PARTITION BY "projectId") as "contributionTotal"
          FROM donations
        )
        SELECT
          "id",
          "name",
          "image",
          "prefersAnonymity",
          SUM(("contribution" / "contributionTotal") * "credits")::numeric as "totalCredits"
        FROM contributions
        GROUP BY "id", "name", "image", "prefersAnonymity"
        ORDER BY "totalCredits" DESC
        LIMIT 100;
      `
      return users.map(({ name, image, prefersAnonymity, ...rest }) => ({
        name: prefersAnonymity ? name[0] + '. Anonymous' : name,
        image: prefersAnonymity ? '' : image,
        ...rest,
      }))
    },
  })
