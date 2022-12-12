-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "proof";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "paymentUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "proofUrl" TEXT NOT NULL DEFAULT '';

