-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "impactEnd",
    DROP COLUMN "impactStart",
    ALTER COLUMN "hidden"
SET DEFAULT true;
-- AlterTable
ALTER TABLE "Holding"
ADD COLUMN "target" DECIMAL(65, 30) NOT NULL DEFAULT 100000,
    ALTER COLUMN "valuation"
SET DEFAULT 1;