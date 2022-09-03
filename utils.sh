#!/bin/bash

set -e

source .env

makemigrations () {
    dir=prisma/migrations/$(date +%Y%m%d%H%M%S)_holdings_fixes
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

migrate () {
    psql -v ON_ERROR_STOP=1 -U im-web2-app -d im-web2-app -f prisma/migrations/$1/migration.sql
    npx prisma migrate resolve --applied $1
}

deploy () {
    npm install
    npm run build
    sudo supervisorctl restart im-web2-app-$1
}

case "$1" in
    makemigrations)
        makemigrations
        ;;
    migrate)
        migrate $2
        ;;
    deploy-prod)
        deploy prod
        ;;
    deploy-beta)
        deploy beta
        ;;
esac
