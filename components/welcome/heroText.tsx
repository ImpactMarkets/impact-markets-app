import { Tooltip } from '@/lib/mantine'

import { buttonClasses } from '../button'
import { ButtonLink } from '../buttonLink'

export function HeroText() {
  return (
    <div className="max-w-[1400px] mb-12 text-center">
      <div>
        <h1 className="text-5xl font-display font-medium">
          The AI Safety
          <div>
            <span className="text-[#0e73cc]">Charity Evaluator</span>
          </div>
        </h1>

        <div className="my-8 mx-auto text-lg text-center prose">
          <p>
            The{' '}
            <Tooltip
              className="hint"
              label="Yelp … publishes crowd-sourced reviews about businesses. —Wikipedia"
            >
              <span>Yelp</span>
            </Tooltip>{' '}
            for charities: Find or{' '}
            <span className="text-[#0e73cc]">promote</span> the best AI safety
            projects,
            <br />
            <span className="text-[#0e73cc]">
              regrant $600,000 from almost 50 donors
            </span>
          </p>
        </div>

        <div className="inline-flex flex-wrap gap-1 justify-center">
          <ButtonLink href="/why" variant="primary">
            Read the FAQs
          </ButtonLink>
          <ButtonLink href="/projects" variant="primary">
            Explore the projects
          </ButtonLink>
          <a
            href="https://airtable.com/shr1eRlbcr43os6SX"
            className={buttonClasses({ variant: 'highlight' })}
            target="_blank"
            rel="noreferrer"
          >
            Register your interest
          </a>
        </div>
      </div>
    </div>
  )
}
