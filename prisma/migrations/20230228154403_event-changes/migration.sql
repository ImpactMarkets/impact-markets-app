-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM(
    'COMMENT',
    'DONATION',
    'PROJECT',
    'BOUNTY'
);
ALTER TABLE "Event"
    ALTER COLUMN "type" TYPE "EventType_new"
    USING ("type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "EventType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Event"
    DROP COLUMN "recipient",
    ADD COLUMN "recipientId" TEXT NOT NULL,
    DROP COLUMN "parameters",
    ADD COLUMN "parameters" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "Event"
    ADD CONSTRAINT "Event_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

