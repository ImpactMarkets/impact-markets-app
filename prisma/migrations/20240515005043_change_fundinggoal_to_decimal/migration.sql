/*
  Warnings:

  - You are about to alter the column `fundingGoal` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "fundingGoal" SET DATA TYPE DECIMAL(65,30);
