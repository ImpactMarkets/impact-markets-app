import Head from 'next/head'
import * as React from 'react'

import { Author } from '@/components/author'
import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { num } from '@/lib/text'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'
import { IconTrophy } from '@tabler/icons'

const Ranking: NextPageWithAuthAndLayout = () => {
  const rankingQuery = trpc.useQuery(['user.topDonors'])

  if (rankingQuery.data) {
    return (
      <>
        <Head>
          <title>Impact Markets – Ranking</title>
        </Head>

        <Heading1>Top Donor Ranking</Heading1>

        <p className="py-6 text-sm">
          The algorithm behind this ranking is still under active development
          and subject to change. It takes into account the size of the donation,
          how early it was made, and how well the project panned out. It
          highlights donors with great foresight even if they are not rich.
        </p>

        {rankingQuery.data.length === 0 ? (
          <div className="text-center text-secondary border rounded my-10 py-20 px-10">
            There have been either no donations or no evaluations yet.
          </div>
        ) : (
          <div className="flow-root">
            <div className="flex justify-center">
              <table>
                <thead className="text-sm">
                  <tr>
                    <td className="pb-6 w-10"></td>
                    <td className="pb-6 w-64">Donor</td>
                    <td className="pb-6 text-right">Score</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {rankingQuery.data.map((user, index) => (
                    <tr key={user.id}>
                      <td className="w-10 text-sm pb-3">{index + 1}</td>
                      <td className="w-64">
                        <Author author={user} />
                      </td>
                      <td className="text-right">
                        {num(user.totalCredits, 0)}
                      </td>
                      <td className="w-10 text-right">
                        {index < 3 && (
                          <IconTrophy
                            className="inline"
                            color={['#D4AF37', '#C0C0C0', '#CD7F32'][index]}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    )
  }

  if (rankingQuery.isError) {
    return <div>Error: {rankingQuery.error.message}</div>
  }

  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-center gap-4 mt-6">
        <table>
          <thead>
            <tr>
              <td>
                <div className="pb-6 w-10 h-4 bg-gray-200 rounded dark:bg-gray-700" />
              </td>
              <td>
                <div className="pb-6 w-64 h-4 bg-gray-200 rounded dark:bg-gray-700" />
              </td>
              <td>
                <div className="pb-6 w-24 h-4 bg-gray-200 rounded dark:bg-gray-700" />
              </td>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, idx) => (
              <tr key={idx}>
                <td>
                  <div className="w-8 h-8 bg-gray-200 rounded dark:bg-gray-700" />
                </td>
                <td>
                  <div className="w-60 h-12 bg-gray-200 rounded dark:bg-gray-700" />
                </td>
                <td>
                  <div className="w-24 h-8 bg-gray-200 rounded dark:bg-gray-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Ranking.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default Ranking
