import Image from 'next/image'
import * as React from 'react'

export const Comparisons = () => (
  <>
    <div className="max-w-screen-lg m-auto items-center flex mb-20 mt-12 flex-col sm:flex-row">
      <div className="basis-full m-6">
        <Image
          src="/images/collaborating.png"
          alt="Charity evaluation"
          width={512}
          height={255}
          object-fit="contain"
          unoptimized
        />
      </div>
      <div className="basis-full">
        <div className="text-xl font-bold mb-4">
          It’s like a charity evaluator for all cause areas
        </div>
        <div>
          Charity evaluators have sophisticated and trusted processes, but they
          can’t scale down to projects so small and numerous that the evaluation
          costs more than what they can absorb in funding. Charity evaluators
          also don’t exist for many cause areas. But only because there is no
          one who can evaluate <em>all</em> these projects, doesn’t mean that
          there is no one who can evaluate <em>any</em> of them. We aggregate
          the knowledge that is already out there.
        </div>
      </div>
    </div>
    <div className="max-w-screen-lg m-auto flex items-center mb-20 mt-12 flex-col sm:flex-row-reverse">
      <div className="basis-full m-6">
        <Image
          src="/images/sustaining.png"
          alt="Sustainable investing"
          width={512}
          height={503}
          object-fit="contain"
          unoptimized
        />
      </div>
      <div className="basis-full">
        <div className="text-xl font-bold mb-4">
          It’s like carbon credits for any kind of positive impact
        </div>
        <div>
          Carbon credits (or “offsets”) are an asset like money, but just like
          money they are also a way to keep score. Our donor score can be seen
          as a kind of “impact credit,” a generalized carbon credit. Once our
          scoring algorithm has matured we may actually introduce such a
          playmoney “impact credit,” so that top donors can double as
          evaluators.
        </div>
      </div>
    </div>
    <div className="max-w-screen-lg m-auto items-center flex mb-20 mt-12 flex-col sm:flex-row">
      <div className="basis-full m-6 flex-col sm:flex-row">
        <Image
          src="/images/saving.png"
          alt="Savings"
          width={512}
          height={269}
          object-fit="contain"
          unoptimized
        />
      </div>
      <div className="basis-full">
        <div className="text-xl font-bold mb-4">
          It’s like getting paid as a grantmaker
        </div>
        <div>
          Your donations inform the giving of individuals and foundations – a
          multiplier on the money that you can give yourself. If a funder
          provides cash prizes, you may even receive a literal payment for your
          work. And since the score rewards donation prescience as much as size,
          you can even make a surplus to pay your rent.
        </div>
      </div>
    </div>
  </>
)