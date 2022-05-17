import { bool, envsafe, str } from 'envsafe'

export const browserEnv = envsafe({
  NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD: bool({
    input: process.env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD,
    default: false,
  }),
  ATTRIBUTED_IMPACT_RECOMMENDED_VERSION: str({
    input: process.env.ATTRIBUTED_IMPACT_RECOMMENDED_VERSION,
    default: '0.0.2',
  }),
})
