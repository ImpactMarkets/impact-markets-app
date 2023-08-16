import { z } from 'zod'

import { TRPCError } from '@trpc/server'

import { protectedProcedure } from '../procedures'
import { router } from '../router'

export const userRouter = router({
  profile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input
      const isOwnProfile = ctx.session?.user.id === id
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          image: true,
          title: true,
          proofUrl: true,
          paymentUrl: true,
          contact: true,
          bio: true,
          prefersAnonymity: true,
          prefersEventNotifications: true,
          donations: {
            select: {
              id: true,
              amount: true,
              time: true,
              state: true,
              project: {
                select: {
                  id: true,
                  title: true,
                  hidden: true,
                },
              },
            },
          },
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
    }),
  edit: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        title: z.string().optional(),
        proofUrl: z.string().optional(),
        paymentUrl: z.string().optional(),
        contact: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session!.user.id },
        data: {
          name: input.name,
          title: input.title,
          proofUrl: input.proofUrl,
          paymentUrl: input.paymentUrl,
          contact: input.contact,
          bio: input.bio,
        },
      })

      return user
    }),
  updateAvatar: protectedProcedure
    .input(
      z.object({
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session!.user.id },
        data: {
          image: input.image,
        },
      })

      return user
    }),
  preferences: protectedProcedure
    .input(
      z.object({
        prefersDetailView: z.boolean().optional(),
        prefersAnonymity: z.boolean().optional(),
        prefersEventNotifications: z.boolean().optional(),
        prefersProjectNotifications: z.boolean().optional(),
        prefersBountyNotifications: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session!.user.id },
        data: input,
      })

      return user
    }),
  mentionList: protectedProcedure.query(async ({ ctx }) => {
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
  }),
  topDonors: protectedProcedure
    .input(
      z.object({
        pastDays: z.literal(365).optional(),
        includeAnonymous: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input: { pastDays, includeAnonymous } }) => {
      const scoreField = pastDays ? 'score365' : 'score'

      // This first sends the normal query with the UserScore fields missing from SELECT, and then sends a second query to get the UserScore fields. Wtf?
      // SELECT "public"."User"."id", "public"."User"."name", "public"."User"."image" FROM "public"."User" LEFT JOIN "public"."UserScore" AS "orderby_1_UserScore" ON ("public"."User"."id" = "orderby_1_UserScore"."userId") WHERE ("public"."User"."prefersAnonymity" = $1 AND ("public"."User"."id") IN (SELECT "t0"."id" FROM "public"."User" AS "t0" INNER JOIN "public"."UserScore" AS "j0" ON ("j0"."userId") = ("t0"."id") WHERE ("j0"."score365" > $2 AND "t0"."id" IS NOT NULL))) ORDER BY "orderby_1_UserScore"."score365" DESC LIMIT $3 OFFSET $4
      // SELECT "public"."UserScore"."userId", "public"."UserScore"."score", "public"."UserScore"."score365" FROM "public"."UserScore" WHERE "public"."UserScore"."userId" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) OFFSET $13
      return await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          userScore: true,
        },
        where: {
          prefersAnonymity: includeAnonymous ? undefined : false,
          userScore: {
            [scoreField]: { gt: 0 },
          },
        },
        orderBy: {
          userScore: {
            [scoreField]: 'desc',
          },
        },
        take: 100,
      })
    }),
})
