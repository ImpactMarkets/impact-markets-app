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
    const { id } = <
      {
        id: string
      }
    >rawInput
    const certificate = await ctx.prisma.certificate.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    })
    return certificate?.authorId === ctx.session!.user.id
  }

  const projectBelongsToUser = async () => {
    const { id } = <
      {
        id: string
      }
    >rawInput
    const project = await ctx.prisma.project.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    })
    return project?.authorId === ctx.session!.user.id
  }

  const bountyBelongsToUser = async () => {
    const { id } = <
      {
        id: string
      }
    >rawInput
    const bounty = await ctx.prisma.bounty.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    })
    return bounty?.authorId === ctx.session!.user.id
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
    const { id } = <
      {
        id: number
      }
    >rawInput
    if (id == null) {
      // Prevents weird error even when id is a number: Argument where of type
      // CommentWhereUniqueInput needs at least one argument.
      return false
    }
    const comment = await ctx.prisma.comment.findUnique({
      where: { id },
      select: {
        authorId: true,
      },
    })
    return comment?.authorId === ctx.session!.user.id
  }

  const holdingBelongsToUser = async () => {
    const { id } = <
      {
        id: number
      }
    >rawInput
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
    // In my testing, the IP address from a local request is "::ffff:127.0.0.1".
    // I'm not sure what the "::ffff:" prefix is about, but regardless it seems we can just check
    // the suffix to make sure the request is coming from localhost.
    return ctx.req.socket.remoteAddress?.endsWith('127.0.0.1')
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
    'bounty.feed': allow,
    'bounty.detail': allow,
    'bounty.search': allow,
    'bounty.add': isAuthenticated,
    'bounty.edit': async () =>
      and(
        await isAuthenticated(),
        or(await isAdmin(), await bountyBelongsToUser())
      ),
    'bounty.like': isAuthenticated,
    'bounty.unlike': isAuthenticated,
    'bounty.hide': isAdmin,
    'bounty.unhide': isAdmin,
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
