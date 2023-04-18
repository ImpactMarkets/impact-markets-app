import { sha512 } from 'crypto-hash'

import { TRPCError } from '@trpc/server'

import { MiddlewareFunction } from './router'

// https://stackoverflow.com/questions/73763655/trpc-how-to-encapsulate-middleware/74279975#74279975

export const permissionMiddleware: MiddlewareFunction = async ({
  ctx,
  path,
  rawInput,
  next,
}) => {
  // Rules
  // I had to embed them here because I couldn’t access the types of ctx, etc. outside
  // https://stackoverflow.com/questions/73763655/trpc-how-to-encapsulate-middleware
  // I’ve taken some cues from https://github.com/omar-dulaimi/trpc-shield, but didn’t use the
  // library itself because it does some odd things such as discard the first segment of the path
  // This is needed for Prettier to process this file:
  // https://github.com/trivago/prettier-plugin-sort-imports/issues/113#issuecomment-1226730519

  // Alternatives to && and || that first assert that the parameters are all already booleans.
  // This prevents (the truthy) Promise<boolean> from slipping through, which may evaluate to false.
  const or = (...args: boolean[]) => args.some((x) => x)
  const and = (...args: boolean[]) => args.every((x) => x)

  const allow = async () => true

  const isAuthenticated = async () => {
    return !!ctx.session
  }

  const isAdmin = async () => {
    return ctx.session?.user.role === 'ADMIN'
  }

  const certificateBelongsToUser = async () => {
    interface certificateInput {
      id: string
    }
    const { id } = <certificateInput>rawInput
    const certificate = await ctx.prisma.certificate.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    })
    return certificate?.authorId === ctx.session!.user.id
  }

  const projectBelongsToUser = async () => {
    interface projectInput {
      id: string
    }
    const { id } = <projectInput>rawInput
    const project = await ctx.prisma.project.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    })
    return project?.authorId === ctx.session!.user.id
  }

  const donationBelongsToUser = async () => {
    const id = <number>rawInput
    const donation = await ctx.prisma.donation.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    })
    return donation?.userId === ctx.session!.user.id
  }

  const donationProjectBelongsToUser = async () => {
    const id = <number>rawInput
    const donation = await ctx.prisma.donation.findUnique({
      where: { id },
      select: {
        project: {
          select: {
            authorId: true,
          },
        },
      },
    })
    return donation?.project.authorId === ctx.session!.user.id
  }

  const commentBelongsToUser = async () => {
    interface commentInput {
      id: number
    }
    const { id } = <commentInput>rawInput
    const comment = await ctx.prisma.comment.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    })
    return comment?.authorId === ctx.session!.user.id
  }

  const holdingBelongsToUser = async () => {
    interface holdingInput {
      id: number
    }
    const { id } = <holdingInput>rawInput
    const holding = await ctx.prisma.holding.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    })
    return holding?.userId === ctx.session!.user.id
  }

  const sellingHoldingBelongsToUser = async () => {
    const id = <number>rawInput
    const transaction = await ctx.prisma.transaction.findUnique({
      where: { id },
      select: {
        sellingHolding: {
          select: {
            userId: true,
          },
        },
      },
    })
    return transaction?.sellingHolding.userId === ctx.session!.user.id
  }

  const buyingHoldingBelongsToUser = async () => {
    const id = <number>rawInput
    const transaction = await ctx.prisma.transaction.findUnique({
      where: { id },
      select: {
        buyingHolding: {
          select: {
            userId: true,
          },
        },
      },
    })
    return transaction?.buyingHolding.userId === ctx.session!.user.id
  }

  const requestComesFromLocalhost = async () => {
    const expectedHash =
      '9a71f29fc25843711e279ec1da9ef43eb455ea13592d2b1888449f52b6c19ef995e7ec591a8868544e4b650f83946da39f3f7607ee0fa655abe521eecd36753f'
    if (typeof ctx.req.headers.authentication === 'string') {
      const hash = await sha512(ctx.req.headers.authentication)
      return hash === expectedHash
    }
  }

  // Permissions

  const permissions = {
    'certificate.feed': allow,
    'certificate.detail': allow,
    'certificate.search': allow,
    'certificate.add': isAuthenticated,
    'certificate.edit': async () =>
      and(
        await isAuthenticated(),
        or(await isAdmin(), await certificateBelongsToUser())
      ),
    'certificate.like': isAuthenticated,
    'certificate.unlike': isAuthenticated,
    'certificate.hide': isAdmin,
    'certificate.unhide': isAdmin,
    'project.feed': allow,
    'project.detail': allow,
    'project.search': allow,
    'project.add': isAuthenticated,
    'project.edit': async () =>
      and(
        await isAuthenticated(),
        or(await isAdmin(), await projectBelongsToUser())
      ),
    'project.like': isAuthenticated,
    'project.unlike': isAuthenticated,
    'project.hide': isAdmin,
    'project.unhide': isAdmin,
    'comment.add': isAuthenticated,
    'comment.edit': async () =>
      and(
        await isAuthenticated(),
        or(await isAdmin(), await commentBelongsToUser())
      ),
    'comment.delete': async () =>
      and(
        await isAuthenticated(),
        or(await isAdmin(), await commentBelongsToUser())
      ),
    'holding.feed': allow,
    'holding.edit': async () =>
      and(
        await isAuthenticated(),
        or(await isAdmin(), await holdingBelongsToUser())
      ),
    'donation.feed': isAuthenticated,
    'donation.add': isAuthenticated,
    'donation.confirm': async () =>
      and(
        await isAuthenticated(),
        or(await isAdmin(), await donationProjectBelongsToUser())
      ),
    'donation.cancel': async () =>
      and(
        await isAuthenticated(),
        or(
          await isAdmin(),
          await donationProjectBelongsToUser(),
          await donationBelongsToUser()
        )
      ),
    'transaction.feed': isAuthenticated,
    'transaction.add': isAuthenticated,
    'transaction.confirm': async () =>
      and(
        await isAuthenticated(),
        or(await isAdmin(), await sellingHoldingBelongsToUser())
      ),
    'transaction.cancel': async () =>
      and(
        await isAuthenticated(),
        or(
          await isAdmin(),
          await buyingHoldingBelongsToUser(),
          await sellingHoldingBelongsToUser()
        )
      ),
    'user.topDonors': allow,
    'user.profile': allow,
    'user.edit': isAuthenticated, // Always edits the same user
    'user.update-avatar': isAuthenticated, // Always edits the same user
    'user.preferences': isAuthenticated, // Always edits the same user
    'user.mentionList': isAuthenticated,
    'job.sendEmails': requestComesFromLocalhost,
    'job.deleteCompletedNotifications': requestComesFromLocalhost,
  }

  // https://bobbyhadz.com/blog/typescript-no-index-signature-with-parameter-of-type-string
  const permission =
    permissions[path as keyof typeof permissions] || (() => false)

  if (!(await permission())) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({ ctx })
}
