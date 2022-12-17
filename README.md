<img src="public/images/logo-light.svg" width="150" />

This is a simple tool that allows members to issue certificates. Features include a simple **Markdown-based** editor with preview, **image drag and drop**, comments and likes, **search**, a clean responsive layout with **dark mode support**, and an admin role for hiding certificates.

## Setup

## Local dependencies

- Node.js

  Node versions > 16 can currently cause this [segmentation fault](https://github.com/prisma/prisma/issues/10649).

  The Node version required is specified in `package.json` and `.nvmrc`.

  To use the correct version, install `nvm`, then run those commands:

  ```sh
  nvm install
  nvm use
  ```

- docker-compose

  Linux Mint: `sudo apt install docker-compose`

### Install project dependencies

```bash
npm install
```

### Prepare the database

- Set up the environment variables:

```bash
cp .env.example .env
```

Ask @Telofy for the Google client credentials. Put them in the `.env` in those two lines:

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

- Start the database

```bash
docker-compose up -d
```

- Create the database schema:

```bash
npx prisma migrate deploy
```

### Launch the app

```bash
npm run dev
```
