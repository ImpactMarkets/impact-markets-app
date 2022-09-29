<img src="public/images/logo-light.svg" width="150" />

This is a simple tool that allows members to issue certificates. Features include a simple **Markdown-based** editor with preview, **image drag and drop**, comments and likes, **search**, a clean responsive layout with **dark mode support**, and an admin role for hiding certificates.

<img src="public/images/screenshot.png" width="690" />

## Setup

## Local dependencies

- Node.js

  Note: Node versions > 16 can currently cause this [segmentation fault](https://github.com/prisma/prisma/issues/10649).

- docker-compose

  Linux Mint: `apt install docker-compose`

### Install project dependencies

```bash
npm install
```

### Prepare the database

- Set up the environment variables:

```bash
cp .env.example .env
```

- Start the database

```bash
docker-compose up -d
```

- Create the database schema:

```bash
DATABASE_URL=postgresql://im-app:empty@127.0.0.1/im-app npx prisma migrate deploy
```

### Configure authentication

GitHub and Okta authentication settings are available as defaults, but thanks to NextAuth.js, you can configure your Beam instance with most other common authentication providers.

- [Configuring GitHub authentication](doc/github_setup.md)
- [Configuring Okta authentication](doc/okta_setup.md)

Beam uses [NextAuth.js](https://next-auth.js.org/), so if you prefer to use one of the [many providers](https://next-auth.js.org/providers/) it supports, you can customize your own installation. Simply update the [`lib/auth.ts`](/lib/auth.ts#L11) file to add your own provider.

### Enable image uploads (optional)

To enable image uploads, set the environment variable `NEXT_PUBLIC_ENABLE_IMAGE_UPLOAD` to `true`.

Beam uses Cloudinary for storing uploaded images. You can [sign up for a free account](https://cloudinary.com/users/register/free).

- On your Cloudinary dashboard, look for these values under your account settings: **Cloud Name**, **API Key**, **API Secret**.
- Update `.env` with the following variables:
  - `CLOUDINARY_CLOUD_NAME`: **Cloud Name**
  - `CLOUDINARY_API_KEY`: **API Key**
  - `CLOUDINARY_API_SECRET`: **API Secret**

### Configure Slack notifications (optional)

If you'd like to have new certificates published to a Slack channel, follow [these instructions](doc/slack_setup.md).

## Running the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Authenticating with GitHub

## Deploying to Vercel

One-click deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fplanetscale%2Fbeam)

⚠️ Remember to update your callback URLs after deploying.
