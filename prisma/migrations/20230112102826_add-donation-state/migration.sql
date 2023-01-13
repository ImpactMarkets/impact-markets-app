-- CreateEnum
CREATE TYPE "DonationState" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- AlterTable
ALTER TABLE "Donation"
ADD COLUMN "state" "DonationState" NOT NULL DEFAULT 'PENDING';