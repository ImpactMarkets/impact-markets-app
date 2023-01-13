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
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          image: true,
          title: true,
          proofUrl: true,
          paymentUrl: true,
          email: ctx.session?.user.role === 'ADMIN',
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No profile with id '${id}'`,
        })
      }

      return user
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
      image: z.string().nullish(),
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
    }),
    async resolve({ input: { prefersDetailView, prefersAnonymity }, ctx }) {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session!.user.id },
        data: {
          prefersDetailView: prefersDetailView,
          prefersAnonymity: prefersAnonymity,
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
    async resolve({ ctx }) {
      const users: {
        id: string
        name: string
        image: string
        prefersAnonymity: boolean
        totalCredits: Prisma.Decimal
      }[] = await ctx.prisma.$queryRaw`
        SELECT
          "id",
          "name",
          "image",
          "prefersAnonymity",
          SUM(("contribution" / "contributionTotal") * "credits") as "totalCredits"
        FROM (
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
            "amount" / "runningTotal" as "contribution",
            SUM("amount" / "runningTotal")
              OVER (PARTITION BY "projectId") as "contributionTotal"
          FROM (
            SELECT
              "User"."id",
              "User"."name",
              "User"."image",
              "User"."prefersAnonymity",
              "Donation"."amount",
              "Donation"."projectId",
              "Project"."credits",
              (100 + SUM("Donation"."amount")
                OVER (ORDER BY time ASC)) as "runningTotal",
              (100 + SUM("Donation"."amount")
                OVER (PARTITION BY "Donation"."projectId")) as "projectTotal"
            FROM "Donation"
            JOIN "User" ON "User"."id" = "Donation"."userId"
            JOIN "Project" ON "Donation"."projectId" = "Project"."id"
            WHERE "Project"."credits" > 0 and "Donation"."state" = 'CONFIRMED'
          ) subtotals
        ) contributions
        GROUP BY "id", "name", "image", "prefersAnonymity"
        ORDER BY "totalCredits" DESC
        LIMIT 100;
      `
      return users.map(({ name, prefersAnonymity, ...rest }) => ({
        name: prefersAnonymity ? name[0] + '. Anonymous' : name,
        ...rest,
      }))
    },
  })
