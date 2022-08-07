-- CreateEnum
CREATE TYPE "HoldingType" AS ENUM ('OWNERSHIP', 'RESERVATION', 'CONSUMPTION');

-- AlterEnum
ALTER TYPE "Right" ADD VALUE 'RECOGNITION';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "unique" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Holdings" (
    "postId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "HoldingType" NOT NULL DEFAULT 'OWNERSHIP',
    "size" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Holdings_pkey" PRIMARY KEY ("postId","userId","type")
);

-- CreateIndex
CREATE INDEX "Holdings_postId_idx" ON "Holdings"("postId");

-- CreateIndex
CREATE INDEX "Holdings_userId_idx" ON "Holdings"("userId");

-- CreateIndex
CREATE INDEX "Holdings_type_idx" ON "Holdings"("type");
