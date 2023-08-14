import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { Barlow_Condensed, Open_Sans } from 'next/font/google'
import * as React from 'react'

import { browserEnv } from '@/env/browser'
import { emotionCache } from '@/lib/emotionCache'
import { transformer } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { AppRouter } from '@/server/routers/_app'
import { MantineProvider } from '@mantine/core'
import { Provider as RollbarProvider } from '@rollbar/react'
import TawkMessengerReact from '@tawk.to/tawk-messenger-react'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { TRPCError } from '@trpc/server'

import '../styles/globals.css'

// https://github.com/timolins/react-hot-toast/issues/46#issuecomment-1368169443
const Toaster = dynamic(
  () => import('react-hot-toast').then((c) => c.Toaster),
  {
    ssr: false,
  }
)

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '700'],
})
const openSans = Open_Sans({
  subsets: ['latin'],
})

type AppPropsWithAuthAndLayout = AppProps & {
  Component: NextPageWithAuthAndLayout
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuthAndLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  const rollbarConfig = {
    accessToken: browserEnv.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
    enabled: process.env.NODE_ENV === 'production',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      client: {
        javascript: {
          source_map_enabled: true,
        },
      },
      environment: process.env.NODE_ENV,
    },
  }

  return (
    <RollbarProvider config={rollbarConfig}>
      <MantineProvider
        emotionCache={emotionCache}
        withCSSVariables
        withGlobalStyles
        withNormalizeCSS
      >
        <SessionProvider session={session} refetchOnWindowFocus>
          <ThemeProvider
            forcedTheme="light"
            attribute="class"
            disableTransitionOnChange
          >
            {/* Hack because the default variable definitions don’t seem to work because they
              are namespaced within the class openSans.variable */}
            <style jsx global>{`
              body {
                --font-barlow-condensed: ${barlowCondensed.style.fontFamily};
                --font-open-sans: ${openSans.style.fontFamily};
              }
            `}</style>
            <Toaster
              toastOptions={{
                duration: 5000,
                className: 'text-xs',
                style: {
                  maxWidth: '100%',
                },
              }}
            />
            {Component.auth ? (
              <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
            ) : (
              getLayout(<Component {...pageProps} />)
            )}
            <TawkMessengerReact
              propertyId="6477604974285f0ec46ec1c0"
              widgetId="1h1p508cl"
            />
          </ThemeProvider>
        </SessionProvider>
      </MantineProvider>
    </RollbarProvider>
  )
}

function Auth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  React.useEffect(() => {
    if (status === 'loading') return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, status])

  if (isUser) {
    return <>{children}</>
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return null
}

function getBaseUrl() {
  if (process.browser) {
    return ''
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: (failureCount, error: any) => {
              const trcpErrorCode = error?.data?.code as TRPCError['code']
              if (trcpErrorCode === 'NOT_FOUND') {
                return false
              }
              if (failureCount < 3) {
                return true
              }
              return false
            },
          },
        },
      },
    }
  },
})(MyApp)
