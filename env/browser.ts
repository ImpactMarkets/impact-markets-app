import { bool, envsafe, str } from 'envsafe'

// FIXME: Reading of the .env file in the browser process doesn’t seem to work
const ATTRIBUTED_IMPACT_RECOMMENDED_VERSION='0.2'

const DESCRIPTION_PROMPTS=`## Fundamental Justification

### What did you do?

### What was the expected outcome of your action when you were still planning it, based on your knowledge and understanding at the time? What were the 1-in-1000 best and worst outcomes?

### What effects did those outcomes have? You can limit this to effects that any sentient being might plausibly care about.

### What was the actual outcome of your action? How do you evaluate that outcome morally, taking into account all effects that any sentient being at any point in time might plausibly care about?

### Who can make a legitimate claim to a fraction of the impact, and have you made a contract with them that stipulates the fraction?

### Who are the current owners of the impact and what fraction do they each own?

## Extra Credit

### What would you have done had there been no chance to get retro funding? (This helps us assess our impact but has no effect on our evaluation of the certificate’s impact.)
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
