-- DropForeignKey
ALTER TABLE
    "Certificate" DROP CONSTRAINT "Certificate_projectId_fkey";

-- AlterTable
ALTER TABLE
    "Certificate" DROP COLUMN "projectId";