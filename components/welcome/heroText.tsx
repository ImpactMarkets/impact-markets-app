import { Container, Text, Title } from '@mantine/core'

import { buttonClasses } from '../button'
import { ButtonLink } from '../buttonLink'

export function HeroText() {
  return (
    <Container className="max-w-[1400px] pb-24 text-center">
      <div>
        <Title className="text-[40px] mb-2">
          The AI Safety
          <div>
            <span className="text-[#0e73cc]">Charity Evaluator</span>
          </div>
        </Title>

        <Container className="max-w-[600px]">
          <Text size="lg" color="dimmed">
            Find or promote the best early-stage AI safety projects
          </Text>
        </Container>

        <div className="inline-flex flex-wrap gap-1 justify-center mt-6">
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
    </Container>
  )
}
