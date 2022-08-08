-- AlterTable
ALTER TABLE "Comment" RENAME COLUMN "postId" TO "certificateId";

-- AlterTable
ALTER TABLE "Holding" RENAME COLUMN "postId" TO "certificateId";

-- AlterTable
ALTER TABLE "Transaction" RENAME COLUMN "postId" TO "certificateId";

-- AlterTable
ALTER TABLE "LikedPosts" RENAME TO "LikedCertificate";

-- AlterTable
ALTER TABLE "Post" RENAME TO "Certificate";

-- AlterTable
ALTER TABLE "Certificate" RENAME CONSTRAINT "Post_pkey" TO "Certificate_pkey";

-- AlterTable
ALTER TABLE "LikedCertificate" RENAME CONSTRAINT "LikedPosts_pkey" TO "LikedCertificate_pkey";

-- AlterTable
ALTER TABLE "LikedCertificate" RENAME COLUMN "postId" TO "certificateId";

-- RenameIndex
ALTER INDEX "Post_authorId_idx" RENAME TO "Certificate_authorId_idx";

-- RenameIndex
ALTER INDEX "Comment_postId_idx" RENAME TO "Comment_certificateId_idx";

-- RenameIndex
ALTER INDEX "Holding_postId_idx" RENAME TO "Holding_certificateId_idx";

-- RenameIndex
ALTER INDEX "LikedPosts_userId_idx" RENAME TO "LikedCertificate_userId_idx";

-- RenameIndex
ALTER INDEX "Transaction_postId_idx" RENAME TO "Transaction_certificateId_idx";

-- RenameIndex
ALTER INDEX "LikedPosts_postId_idx" RENAME TO "LikedCertificate_certificateId_idx";
