import { NextPageContext } from 'next'
import Error from 'next/error'

import { Layout } from '@/components/layout'

const CustomError = ({ statusCode }: { statusCode: number }) => {
  return <Error statusCode={statusCode} />
}

CustomError.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

CustomError.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default CustomError
