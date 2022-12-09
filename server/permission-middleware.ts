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

  const isAuthenticated = () => {
    return !!ctx.session
  }

  const isAdmin = () => {
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

  // Permissions

  const permissions = {
    'certificate.feed': () => true,
    'certificate.detail': () => true,
    'certificate.search': () => true,
    'certificate.add': isAuthenticated,
    'certificate.edit': () =>
      isAuthenticated() && (isAdmin() || certificateBelongsToUser()),
    'certificate.like': isAuthenticated,
    'certificate.unlike': isAuthenticated,
    'certificate.hide': isAdmin,
    'certificate.unhide': isAdmin,
    'comment.add': isAuthenticated,
    'comment.edit': () =>
      isAuthenticated() && (isAdmin() || commentBelongsToUser()),
    'comment.delete': () =>
      isAuthenticated() && (isAdmin() || commentBelongsToUser()),
    'holding.feed': () => true,
    'holding.edit': () =>
      isAuthenticated() && (isAdmin() || holdingBelongsToUser()),
    'transaction.feed': isAuthenticated,
    'transaction.add': isAuthenticated,
    'transaction.confirm': () =>
      isAuthenticated() && (isAdmin() || sellingHoldingBelongsToUser()),
    'transaction.cancel': () =>
      isAuthenticated() &&
      (isAdmin() ||
        buyingHoldingBelongsToUser() ||
        sellingHoldingBelongsToUser()),
    'user.profile': () => true,
    'user.edit': isAuthenticated, // Always edits the same user
    'user.update-avatar': isAuthenticated, // Always edits the same user
    'user.preferences': isAuthenticated, // Always edits the same user
    'user.mentionList': isAuthenticated,
  }

  // https://bobbyhadz.com/blog/typescript-no-index-signature-with-parameter-of-type-string
  const permission =
    permissions[path as keyof typeof permissions] || (() => false)

  if (!(await permission())) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({ ctx })
}
