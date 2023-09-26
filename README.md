<img src="public/images/logo-light.svg" width="150" />

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

### FAQ and Common Problems

- I pulled main and now I'm getting a lot of type errors on files I didn't touch when I try to commit. How do I fix this?

Try running `npx prisma generate`. These may be from schema changes someone else made that haven't propagated on your local instance yet. Sometimes you also need to restart the dev server after regenerating the client.

### Styles

This project uses [Tailwind CSS](https://tailwindcss.com/docs) and [Mantine] (https://mantine.dev/) to handle styles. If at all possible, please use Tailwind for styling components, even Mantine components, so we don’t incur so much complexity from mixing the two systems.

To make changes to default Tailwind CSS values, modify the `tailwind.config.js` file located at the root of the project.
