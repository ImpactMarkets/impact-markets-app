import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { serverEnv } from '@/env/server'
import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { Role } from '@prisma/client'

// Helpful example: https://github.com/mikemajara/nextjs-prisma-next-auth-credentials/blob/main/pages/api/auth/%5B...nextauth%5D.ts

export const authOptions: NextAuthOptions = {
  // debug: true,
  adapter: PrismaAdapter(prisma),
  secret: serverEnv.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // TODO: Use signIn to handle blocking users
    session: async ({ session, user, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: (user || token).id,
          role: (user || token).role,
        },
      }
    },
  },
}

if (serverEnv.MOCK_LOGIN) {
  authOptions.providers.push(
    CredentialsProvider({
      credentials: { password: { label: 'Password', type: 'password' } },
      async authorize() {
        return await prisma.user.findUniqueOrThrow({
          where: { email: 'impactmarkets.io@gmail.com' },
        })
      },
    })
  )
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: Role
    }
  }

  interface User {
    role: Role
  }
}
