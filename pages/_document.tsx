import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import Rollbar from 'rollbar'

import { ColorSchemeScript } from '@mantine/core'

class MyDocument extends Document {
  // The guide sees this code in _error.tsx, but that somehow doesn’t get executed at least for some
  // errors. A seemingly outdated SE answer suggests that the _document.tsx getInitialProps might
  // override the _error.tsx getInitialProps. I’m unconvinced, but in any case, this seems to work.
  // https://docs.rollbar.com/docs/nextjs#server-side-error-reporting-with-nextjs
  // https://stackoverflow.com/questions/51316537/getinitialprops-never-gets-called
  static async reportErrorToRollbar(ctx: DocumentContext) {
    const { req, res, err } = ctx
    const statusCode = res ? res.statusCode : 404

    let rollbarToken
    if (typeof window === 'undefined') {
      const { serverEnv } = await import('@/env/server')
      rollbarToken = serverEnv.ROLLBAR_SERVER_TOKEN
    } else {
      const { browserEnv } = await import('@/env/browser')
      rollbarToken = browserEnv.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN
    }

    const rollbar = new Rollbar({ accessToken: rollbarToken })
    const message = err ? err : statusCode.toString() // 'err' is null for 404
    rollbar.error(message, req, (rollbarError) => {
      if (rollbarError) {
        console.error(`Rollbar error reporting failed: ${rollbarError}`)
      } else {
        console.log('Reported error to Rollbar')
      }
    })
  }

  static async getInitialProps(ctx: DocumentContext) {
    const { res, err } = ctx
    const initialProps = await Document.getInitialProps(ctx)
    const statusCode = res ? res.statusCode : 404

    // Only require Rollbar (and environment variable) and report error in production
    if ((err || statusCode >= 500) && process.env.NODE_ENV === 'production') {
      MyDocument.reportErrorToRollbar(ctx)
    }

    return {
      ...initialProps,
      err: { statusCode, name: err?.name }, // Used in _error.tsx
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <ColorSchemeScript />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.webmanifest" />
          <meta name="theme-color" content="#ff455d" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
