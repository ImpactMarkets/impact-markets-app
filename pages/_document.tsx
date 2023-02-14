import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'

import { emotionCache } from '@/lib/emotionCache'
import { ServerStyles, createStylesServer } from '@mantine/next'

const stylesServer = createStylesServer(emotionCache)

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: [
        <ServerStyles
          html={initialProps.html}
          server={stylesServer}
          key="styles"
        />,
        initialProps.styles,
      ],
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
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
