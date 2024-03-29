import { bool, envsafe, invalidEnvError, makeValidator, str } from 'envsafe'

import { browserEnv } from './browser'

if (typeof window !== 'undefined') {
  throw new Error('This should not be included on the client side')
}

const googleParser = makeValidator<string>((input) => {
  if (process.env.AUTH_PROVIDER === 'google' && input === '') {
    throw invalidEnvError('google config', input)
  }
  return input
})

const githubParser = makeValidator<string>((input) => {
  if (process.env.AUTH_PROVIDER === 'github' && input === '') {
    throw invalidEnvError('github config', input)
  }
  return input
})

const oktaParser = makeValidator<string>((input) => {
  if (process.env.AUTH_PROVIDER === 'okta' && input === '') {
    throw invalidEnvError('okta config', input)
  }
  return input
})

const cloudinaryParser = makeValidator<string>((input) => {
  if (browserEnv.NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD && input === '') {
    throw invalidEnvError('cloudinary config', input)
  }
  return input
})

const rollbarParser = makeValidator<string>((input) => {
  if (process.env.ROLLBAR_SERVER_TOKEN && input === '') {
    throw invalidEnvError('rollbar server config', input)
  }
  return input
})

export const serverEnv = {
  ...browserEnv,
  ...envsafe({
    DATABASE_URL: str(),
    NEXT_APP_URL: str({
      allowEmpty: true,
      devDefault: 'http://localhost:3000',
    }),
    NEXTAUTH_SECRET: str({
      devDefault: 'foobar',
    }),
    DEBUG: bool({ default: false }),
    MOCK_LOGIN: bool({ default: false }),
    EMAIL_ANYONE: bool({ default: false }),
    GOOGLE_CLIENT_ID: googleParser({ allowEmpty: true, default: '' }),
    GOOGLE_CLIENT_SECRET: googleParser({ allowEmpty: true, default: '' }),
    GITHUB_ID: githubParser({ allowEmpty: true, default: '' }),
    GITHUB_SECRET: githubParser({ allowEmpty: true, default: '' }),
    GITHUB_ALLOWED_ORG: githubParser({ allowEmpty: true, default: '' }),
    OKTA_CLIENT_ID: oktaParser({ allowEmpty: true, default: '' }),
    OKTA_CLIENT_SECRET: oktaParser({ allowEmpty: true, default: '' }),
    OKTA_ISSUER: oktaParser({ allowEmpty: true, default: '' }),
    CLOUDINARY_CLOUD_NAME: cloudinaryParser({ allowEmpty: true, default: '' }),
    CLOUDINARY_API_KEY: cloudinaryParser({ allowEmpty: true, default: '' }),
    CLOUDINARY_API_SECRET: cloudinaryParser({ allowEmpty: true, default: '' }),
    ROLLBAR_SERVER_TOKEN: rollbarParser({
      allowEmpty: false,
      devDefault: 'foobar',
    }),
    IMPACT_MARKETS_USER: rollbarParser({ allowEmpty: false, devDefault: '' }),
  }),
}
