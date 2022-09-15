#!/bin/bash

set -e
set -x

source .env

makemigrations () {
    dir=prisma/migrations/$(date +%Y%m%d%H%M%S)_$1
    mkdir $dir
    createdb im-web2-app-temp --owner im-web2-app
    npx prisma migrate diff \
        --from-migrations prisma/migrations \
        --shadow-database-url ${DATABASE_URL}-temp \
        --to-schema-datamodel prisma/schema.prisma \
        --script \
        > $dir/migration.sql
    dropdb im-web2-app-temp
}

deploy () {
    npm install
    npx prisma generate
    npm run build
    npx prisma migrate resolve --applied 20220807000000_init || true
    npx prisma migrate deploy
    sudo supervisorctl restart im-web2-app-$1
}

case "$1" in
    makemigrations)
        makemigrations $2
        ;;
    deploy-prod)
        deploy prod
        ;;
    deploy-beta)
        deploy beta
        ;;
esac
