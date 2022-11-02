import { bool, envsafe } from 'envsafe'

// Variable names must start with NEXT_PUBLIC_
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
export const browserEnv = envsafe({
  NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD: bool({
    input: process.env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD,
    default: false,
  }),
})
