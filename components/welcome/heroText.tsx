import { Tooltip } from '@/lib/mantine'

import { ButtonLink } from '../buttonLink'

export function HeroText() {
  return (
    <div className="max-w-[1400px] mb-12 text-center">
      <div>
        <h1 className="text-5xl font-display font-medium">
          Your Crowdsourced{' '}
          <div>
            <span className="text-highlight">Charity Evaluator</span>
          </div>
        </h1>

        <div className="my-8 mx-auto text-lg text-center prose">
          <p>
            The{' '}
            <Tooltip label="AngelList allows newbie angel investors to follow seasoned angel investors">
              <span className="hint">AngelList</span>
            </Tooltip>{' '}
            for philanthropy: Follow expert grantmakers with your donations.
          </p>
        </div>

        <div className="inline-flex flex-wrap gap-1 justify-center">
          <ButtonLink href="/projects" variant="highlight">
            Explore the projects
          </ButtonLink>
          <ButtonLink
            className="mr-2"
            href="https://impactmarkets.substack.com/"
          >
            Read the blog
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}
