import * as React from 'react'

import { Prisma } from '@prisma/client'
import { IconTrophy } from '@tabler/icons-react'

import { Tooltip } from '@/lib/mantine'
import { num } from '@/lib/text'
import { RouterOutput, trpc } from '@/lib/trpc'

import { Author } from '../author'

export function TopContributors({
  project,
}: {
  project: RouterOutput['project']['detail']
}) {
  const rankingQuery = trpc.project.topContributors.useQuery({
    id: project.id,
  })
  const ranking = rankingQuery.data ?? []
  const zero = new Prisma.Decimal(0)
  return (
    <>
      {ranking.length === 0 ? (
        <div className="text-center text-secondary border rounded my-3 py-3">
          There have not been any donations from visible users.
        </div>
      ) : (
        <div className="flow-root">
          <div className="flex justify-center">
            <table>
              <thead className="text-sm">
                <tr>
                  <td className="pb-6 w-10"></td>
                  <td className="pb-6 w-64">Donor</td>
                  <td className="pb-6 pl-6 text-right">Amount</td>
                  <td className="pb-6 pl-6 text-right">Contribution</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {ranking.map(({ user, totalAmount, contribution }, index) => (
                  <tr
                    key={user.id}
                    className={user.prefersAnonymity ? 'opacity-50' : ''}
                  >
                    <td className="w-10 text-sm pb-3">{index + 1}</td>
                    <td className="w-64">
                      <Tooltip
                        label={
                          <>
                            Donor score: {num(user.userScore?.score ?? zero, 0)}
                          </>
                        }
                      >
                        <span>
                          <Author author={user} />
                        </span>
                      </Tooltip>
                    </td>
                    <td className="text-right pl-6">
                      $
                      {totalAmount == null
                        ? '0' // Should never happen
                        : num(totalAmount, 0)}
                    </td>
                    <td className="text-right pl-6">
                      {contribution == null
                        ? '0' // Should never happen
                        : num(contribution.times(100), 0)}
                      %
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
