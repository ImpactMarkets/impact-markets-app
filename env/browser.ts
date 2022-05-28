import { bool, envsafe, str } from 'envsafe'

// FIXME: Reading of the .env file in the browser process doesn’t seem to work
const ATTRIBUTED_IMPACT_RECOMMENDED_VERSION='0.2'

const DESCRIPTION_PROMPTS=`## Fundamental Justification

### What did you do?

### What positive impact did you expect before you started the project? What were unusually good and unusually bad possible outcomes? (Please avoid hindsight bias and take the interests of all sentient beings into account.)

### What actual outcomes are you aware of?

### Who can make a legitimate claim to a fraction of the impact, and have you talked to them?

### Who are the current owners of the impact and what fraction do they each own?

## Procedural Questions

### What is your minimum valuation under which you’ll not sell any shares in your impact?

### What would you have done had there been no chance to get retro funding? (This helps us assess our impact but has no effect on our evaluation of the certificate’s impact.)

### What can we improve about this process?
`

export const browserEnv = envsafe({
  NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD: bool({
    input: process.env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD,
    default: false,
  }),
  ATTRIBUTED_IMPACT_RECOMMENDED_VERSION: str({
      input: process.env.ATTRIBUTED_IMPACT_RECOMMENDED_VERSION,
    default: ATTRIBUTED_IMPACT_RECOMMENDED_VERSION,
  }),
  DESCRIPTION_PROMPTS: str({
    input: process.env.DESCRIPTION_PROMPTS,
    default: DESCRIPTION_PROMPTS,
  }),
})
