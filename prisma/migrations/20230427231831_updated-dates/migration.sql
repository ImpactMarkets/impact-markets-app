-- AlterTable
ALTER TABLE "Comment"
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01';

-- AlterTable
ALTER TABLE "Donation"
    ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01',
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01';

-- AlterTable
ALTER TABLE "User"
    ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01',
    ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01';

