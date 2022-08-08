-- CreateEnum
CREATE TYPE "HoldingType" AS ENUM ('OWNERSHIP', 'RESERVATION', 'CONSUMPTION');

-- AlterEnum
ALTER TYPE "Right" ADD VALUE 'RECOGNITION';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "unique" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Holding" (
    "postId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "HoldingType" NOT NULL DEFAULT 'OWNERSHIP',
    "size" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Holding_pkey" PRIMARY KEY ("postId","userId","type")
);

-- CreateIndex
CREATE INDEX "Holding_postId_idx" ON "Holding"("postId");

-- CreateIndex
CREATE INDEX "Holding_userId_idx" ON "Holding"("userId");

-- CreateIndex
CREATE INDEX "Holding_type_idx" ON "Holding"("type");
