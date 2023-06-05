-- AlterEnum
BEGIN;
UPDATE
    "Donation"
SET
    "state" = 'CONFIRMED'
WHERE
    "state" = 'PENDING';
CREATE TYPE "DonationState_new" AS ENUM(
    'CONFIRMED',
    'REJECTED'
);
ALTER TABLE "Donation"
    ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Donation"
    ALTER COLUMN "state" TYPE "DonationState_new"
    USING ("state"::text::"DonationState_new");
ALTER TYPE "DonationState" RENAME TO "DonationState_old";
ALTER TYPE "DonationState_new" RENAME TO "DonationState";
DROP TYPE "DonationState_old";
ALTER TABLE "Donation"
    ALTER COLUMN "state" SET DEFAULT 'CONFIRMED';
COMMIT;

