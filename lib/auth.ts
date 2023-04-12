import type { DefaultSession, NextAuthOptions, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'

import { serverEnv } from '@/env/server'
import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { PrismaClient } from '@prisma/client'
import { Role } from '@prisma/client'

// Helpful example: https://github.com/mikemajara/nextjs-prisma-next-auth-credentials/blob/main/pages/api/auth/%5B...nextauth%5D.ts

export const authOptions: NextAuthOptions = {
  debug: serverEnv.DEBUG,
  adapter: PrismaAdapter(prisma),
  secret: serverEnv.NEXTAUTH_SECRET,
  theme: {
    colorScheme: 'light',
    logo: '/images/logo-light.svg',
  },
  providers: [
    GoogleProvider({
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // Magic links are valid for 10 min only
    }),
  ],
  callbacks: {
    // TODO: Use signIn to handle blocking of users
    session: async ({ session, token, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: (user || token).id,
          role: (user || token).role,
          image: (user || token).image,
          email: (user || token).email,
          prefersDetailView: (user || token).prefersDetailView,
          prefersAnonymity: (user || token).prefersAnonymity,
          prefersEventNotifications: (user || token).prefersEventNotifications,
        },
      } as Session
    },
  },
}

if (serverEnv.MOCK_LOGIN) {
  // TODO: I couldn’t get the DB-based mock login to work, so I’m using this
  authOptions.session = { strategy: 'jwt' }
  authOptions.providers.push(
    CredentialsProvider({
      name: 'Mock Login',
      credentials: {},
      authorize: async () => ({}),
    })
  )
  authOptions.callbacks!.jwt = async ({ token }) => {
    const email = 'mock.user@example.com'
    const name = 'Mock User'
    const image = serverEnv.NEXT_APP_URL + '/images/logo-min-light.png'
    const role = Role.USER
    const user = await prisma.user.upsert({
      select: {
        id: true,
        name: true,
        role: true,
        image: true,
        email: true,
        prefersDetailView: true,
        prefersAnonymity: true,
        prefersEventNotifications: true,
      },
      where: { email },
      create: { email, name, image, role },
      update: { email, name, image, role },
    })
    return { ...token, ...user }
  }
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: Role
      prefersDetailView: boolean
      prefersAnonymity: boolean
      prefersEventNotifications: boolean
    }
    expires: string
  }

  interface User {
    role: Role
  }
}
