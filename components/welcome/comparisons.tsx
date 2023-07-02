import Image from 'next/image'
import * as React from 'react'

export const Comparisons = () => (
  <>
    <div className="flex justify-center my-12 text-3xl font-bold">
      AI Safety Impact Markets is a …
    </div>
    <div className="max-w-screen-lg m-auto items-center flex mb-20 flex-col sm:flex-row">
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
          Crowdsourced charity evaluator
        </div>
        <div className="[hyphens:auto]">
          Charity evaluators have sophisticated and trusted processes, but they
          can’t scale down to projects so small and numerous that the evaluation
          costs more than what they can absorb in funding. Charity evaluators
          also don’t exist for many cause areas such as AI safety. But only
          because there is no one who can evaluate <em>all</em> these projects,
          doesn’t mean that there is no one who can evaluate <em>any</em> of
          them. We aggregate the knowledge that is already out there.
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
          Currency of existential security
        </div>
        <div className="[hyphens:auto]">
          Carbon credits (or “offsets”) are an asset like money, but just like
          money they are also a way to keep score. Our donor score can be seen
          as a kind of “impact credit,” a generalized carbon credit. Once our
          scoring algorithm has matured we want to introduce such a playmoney
          “impact credit,” the Impact Mark, so that top donors can double as
          evaluators. As AI safety enters the mainstream, it’ll become more and
          more important to provide a scalable method to render donation
          recommendations.
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
          Network of grantmakers/regrantors
        </div>
        <div className="[hyphens:auto]">
          Your donations inform the giving of individuals and foundations – a
          multiplier on the money that you can give yourself. One day, laws
          permitting, we want to make it possible for you to even get paid in
          cash for your work. Our score rewards donation prescience as much as
          size, so you will then be able to generate a surplus to pay your rent.
        </div>
      </div>
    </div>
  </>
)
