#!/bin/bash

set -e
set -x

source .env

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

makemigrations () {
    dir=prisma/migrations/$(date +%Y%m%d%H%M%S)_$1
    mkdir $dir
    PGPASSWORD=empty createdb -U im-app -h 127.0.0.1 -p 54321 im-app-temp --owner im-app
    npx prisma migrate diff \
        --from-migrations prisma/migrations \
        --shadow-database-url ${DATABASE_URL}-temp \
        --to-schema-datamodel prisma/schema.prisma \
        --script \
        > $dir/migration.sql
    PGPASSWORD=empty dropdb -U im-app -h 127.0.0.1 -p 54321 im-app-temp
}

deploy () {
    npm install
    npx prisma generate
    npm run build
    npx prisma migrate resolve --applied 20220807000000_init || true
    npx prisma migrate deploy
    sudo supervisorctl restart im-app-$1
}

import () {
    pg_restore --no-owner -d postgresql://im-app:empty@127.0.0.1:54321/im-app "$1"
    npx prisma migrate resolve --applied 20220807000000_init || true
    npx prisma migrate deploy
}

case "$1" in
    makemigrations)
        makemigrations $2
        ;;
    deploy-prod)
        deploy prod
        ;;
    deploy-staging)
        deploy staging
        ;;
    import)
        import $2
        ;;
esac
