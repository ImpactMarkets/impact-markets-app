import { useSession } from 'next-auth/react'
import Head from 'next/head'
import * as React from 'react'

import { Tabs } from '@mantine/core'
import { Prisma } from '@prisma/client'
import { IconTrophy } from '@tabler/icons-react'

import { Author } from '@/components/author'
import { Heading1 } from '@/components/heading1'
import { Layout } from '@/components/layout'
import { PageLoader } from '@/components/utils'
import { Tooltip } from '@/lib/mantine'
import { num } from '@/lib/text'
import { trpc } from '@/lib/trpc'
import type { NextPageWithAuthAndLayout } from '@/lib/types'

const RankingPage: NextPageWithAuthAndLayout = () => {
  const { data: session } = useSession()
  const isAdmin = session?.user.role === 'ADMIN'
  return (
    <div className="max-w-screen-lg mx-auto">
      <Head>
        <title>AI Safety GiveWiki – Ranking</title>
      </Head>

      <Heading1>Top Donor Ranking</Heading1>

      <p className="py-6 text-sm">
        The algorithm behind this ranking is still under active development and
        subject to change. It takes into account the{' '}
        <Tooltip
          multiline
          w={400}
          label={
            <span>
              This is a bit unfortunate, but it is necessary as a proxy for the
              donors’ confidence. We don’t want donors to get high scores for
              randomly sending out tiny donations. Neither do we want tiny
              donations to have the power to erase the incentives for the next
              donor or many projects might never get funded.
            </span>
          }
        >
          <span className="hint">size of the donation</span>
        </Tooltip>
        ,{' '}
        <Tooltip
          multiline
          w={400}
          label={
            <span>
              This is in terms of the order of the donations. It rewards donors
              who add the most information to the market.
            </span>
          }
        >
          <span className="hint">how early it was made</span>
        </Tooltip>
        , and{' '}
        <Tooltip
          multiline
          w={400}
          label={
            <span>
              We do retroactive evaluations. It’s much easier to check whether
              something happened (and is of decent quality) than whether
              something will happen. That means that donors can only receive
              positive scores for a project once the project has actually
              produced something.
            </span>
          }
        >
          <span className="hint">how well the project panned out</span>
        </Tooltip>
        . It highlights donors with great foresight even if they are not rich.
      </p>

      <Tabs defaultValue="rankingWithSizesAllTime">
        <Tabs.List>
          <Tabs.Tab value="rankingWithSizesAllTime">Top donors</Tabs.Tab>
          {isAdmin && (
            <Tabs.Tab value="rankingWithSizesLastYear">Last 365 days</Tabs.Tab>
          )}
          {isAdmin && (
            <Tabs.Tab value="rankingWithAnonymous">Complete</Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="rankingWithSizesAllTime" pt="xs">
          <Ranking />
        </Tabs.Panel>
        {isAdmin && (
          <Tabs.Panel value="rankingWithSizesLastYear" pt="xs">
            <Ranking pastDays={365} />
          </Tabs.Panel>
        )}
        {isAdmin && (
          <Tabs.Panel value="rankingWithAnonymous" pt="xs">
            <Ranking includeAnonymous />
          </Tabs.Panel>
        )}
      </Tabs>
    </div>
  )
}

const Ranking = ({
  pastDays,
  includeAnonymous = false,
}: {
  pastDays?: 365
  ignoreSize?: boolean
  includeAnonymous?: boolean
}) => {
  const rankingQuery = trpc.user.topDonors.useQuery({
    pastDays,
    includeAnonymous,
  })

  if (rankingQuery.data) {
    const zero = new Prisma.Decimal(0)
    const one = new Prisma.Decimal(1)
    return (
      <>
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
                        {user.userScore == null
                          ? '0' // Should never happen
                          : user.userScore?.score === zero ||
                            user.userScore?.score >= one
                          ? num(user.userScore.score, 0)
                          : '< 1'}
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

  return <PageLoader />
}

RankingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default RankingPage
