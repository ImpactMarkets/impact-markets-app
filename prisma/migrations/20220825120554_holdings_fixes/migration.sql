-- CreateEnum
CREATE TYPE "TransactionState" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- DropIndex
DROP INDEX "Transaction_certificateId_idx";

-- DropIndex
DROP INDEX "Transaction_receiverId_idx";

-- DropIndex
DROP INDEX "Transaction_senderId_idx";

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN "cuid" TEXT;

-- AlterTable
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_pkey",
ADD COLUMN "cost" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN "id" SERIAL NOT NULL,
ALTER COLUMN "size" SET DEFAULT 0,
ADD CONSTRAINT "Holding_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "certificateId",
DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN "buyingHoldingId" INTEGER NOT NULL,
ADD COLUMN "consume" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "sellingHoldingId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN "id" SERIAL NOT NULL,
DROP COLUMN "state",
ADD COLUMN "state" "TransactionState" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Holding_certificateId_userId_type_key" ON "Holding"("certificateId", "userId", "type");

-- CreateIndex
CREATE INDEX "Transaction_sellingHoldingId_idx" ON "Transaction"("sellingHoldingId");

-- CreateIndex
CREATE INDEX "Transaction_buyingHoldingId_idx" ON "Transaction"("buyingHoldingId");