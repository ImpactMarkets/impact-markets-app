-- AlterTable
ALTER TABLE
    "Project"
ADD
    COLUMN "fundingGoal" DECIMAL(65, 30) NOT NULL DEFAULT 0;