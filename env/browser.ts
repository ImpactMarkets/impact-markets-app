import { bool, envsafe, str } from 'envsafe'

const NEXT_PUBLIC_ATTRIBUTED_IMPACT_RECOMMENDED_VERSION = '0.3'

const NEXT_PUBLIC_DESCRIPTION_PROMPTS = `**What is the action that this certificate is about?**

**Might someone feel that the action is not morally good according to their values?**

**Has the action ever been risky?**

**What is the complete list of all collaborators and how much have they each contributed?**

**What is your minimum valuation for selling any shares in your impact? (Optional.)**

**What would you have done had there been no chance to get retro funding? (This doesn’t affect our evaluation of your impact.) (Optional.)**

**What can we improve about this process? (Optional.)**

`

// Variable names must start with NEXT_PUBLIC_
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
export const browserEnv = envsafe({
  NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD: bool({
    input: process.env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD,
    default: false,
  }),
  NEXT_PUBLIC_ATTRIBUTED_IMPACT_RECOMMENDED_VERSION: str({
    input: process.env.NEXT_PUBLIC_ATTRIBUTED_IMPACT_RECOMMENDED_VERSION,
    default: NEXT_PUBLIC_ATTRIBUTED_IMPACT_RECOMMENDED_VERSION,
  }),
  NEXT_PUBLIC_DESCRIPTION_PROMPTS: str({
    input: process.env.NEXT_PUBLIC_DESCRIPTION_PROMPTS,
    default: NEXT_PUBLIC_DESCRIPTION_PROMPTS,
  }),
})
