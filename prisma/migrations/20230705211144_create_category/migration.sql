-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('COMMENT', 'Q_AND_A', 'REASONING', 'ENDORSEMENT');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "category" "CommentType" DEFAULT 'COMMENT';
