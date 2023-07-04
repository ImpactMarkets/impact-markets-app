-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "prefersBountyNotifications" BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN "prefersProjectNotifications" BOOLEAN NOT NULL DEFAULT FALSE;

