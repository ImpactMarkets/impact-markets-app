// This page is necessary for server-side error reporting to Rollbar from Next.
// This page only loads in production mode.
// https://docs.rollbar.com/docs/nextjs#server-side-error-reporting-with-nextjs

function Error({ statusCode }) {
  return (
    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
      {statusCode
        ? `A server error ${statusCode} occurred`
        : 'An error occurred on client'}
    </p>
  )
}
Error.getInitialProps = ({ req, res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  // Only require Rollbar (and environment variable) and report error if we're on the server
  if (!process.browser) {
    console.log('Reporting error to Rollbar...')

    /* eslint-disable @typescript-eslint/no-var-requires */
    const Rollbar = require('rollbar')
    const { serverEnv } = require('@/env/server')
    /* eslint-enable @typescript-eslint/no-var-requires */

    const rollbar = new Rollbar(serverEnv.ROLLBAR_SERVER_TOKEN)
    err = err ? err : statusCode.toString() // 'err' is null for 404
    rollbar.error(err, req, (rollbarError) => {
      if (rollbarError) {
        console.error('Rollbar error reporting failed:')
        console.error(rollbarError)
        return
      }
      console.log('Reported error to Rollbar')
    })
  }
  return { statusCode }
}
export default Error
