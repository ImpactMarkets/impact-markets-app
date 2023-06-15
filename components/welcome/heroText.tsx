import { Container, Text, Title, createStyles } from '@mantine/core'

import { buttonClasses } from '../button'
import { ButtonLink } from '../buttonLink'

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 0,
    paddingBottom: 80,

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  dots: {
    position: 'absolute',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    '@media (max-width: 755px)': {
      display: 'none',
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
  },

  description: {
    textAlign: 'center',

    '@media (max-width: 520px)': {
      fontSize: theme.fontSizes.md,
    },
  },
}))

export function HeroText() {
  const { classes } = useStyles()

  return (
    <Container className="max-w-[1400px] pb-24 text-center">
      <div className={classes.inner}>
        <Title className={classes.title}>
          The AI Safety
          <div>
            <Text component="span" className={classes.highlight} inherit>
              Charity Evaluator
            </Text>
          </div>
        </Title>

        <Container className="max-w-[600px]">
          <Text size="lg" color="dimmed">
            Find or promote the best early-stage AI safety projects
          </Text>
        </Container>

        <div className="mt-6">
          <ButtonLink href="/why" variant="primary" className="mr-2">
            Read the FAQs
          </ButtonLink>
          <ButtonLink href="/projects" variant="primary" className="mr-2">
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
