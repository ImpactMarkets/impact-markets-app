import { bool, envsafe, str } from 'envsafe'

// Variable names must start with NEXT_PUBLIC_
// https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser
export const browserEnv = envsafe({
  NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD: bool({
    input: process.env.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD,
    default: false,
  }),
  NEXT_PUBLIC_INTERCOM_APP_ID: str({
    input: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
    default: '',
  }),
  NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: str({
    input: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
    default: '',
  }),
})
