-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_certificateId_fkey";

-- DropIndex
DROP INDEX "Comment_certificateId_idx";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "attributedImpactVersion",
    DROP COLUMN "unique",
    ADD COLUMN "projectId" TEXT;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT TRUE,
    "credits" DECIMAL(65, 30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "actionStart" TIMESTAMP(3) NOT NULL,
    "actionEnd" TIMESTAMP(3),
    "tags" TEXT,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikedProject" (
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LikedProject_pkey" PRIMARY KEY ("projectId", "userId")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65, 30) NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- Create initial projects
INSERT INTO "Project" (
        "id",
        "title",
        "content",
        "contentHtml",
        "hidden",
        "credits",
        "createdAt",
        "updatedAt",
        "authorId",
        "actionStart",
        "actionEnd",
        "tags"
    )
SELECT "Certificate"."id",
    "Certificate"."title",
    "Certificate"."content",
    "Certificate"."contentHtml",
    "Certificate"."hidden",
    "Certificate"."credits",
    "Certificate"."createdAt",
    "Certificate"."updatedAt",
    "Certificate"."authorId",
    "Certificate"."actionStart",
    "Certificate"."actionEnd",
    "Certificate"."tags"
FROM "Certificate";

-- Update certificates
-- Little hack to get the project ID into the certificate
-- They will not continue to be identical
UPDATE "Certificate"
SET "projectId" = "Certificate"."id";

-- AlterTable
ALTER TABLE "Comment"
ADD COLUMN "projectId" TEXT;

-- Hack: see below
UPDATE "Comment"
SET "projectId" = "certificateId";

-- AlterTable
ALTER TABLE "Comment"
ALTER COLUMN "projectId"
SET NOT NULL,
    DROP COLUMN "certificateId";

-- CreateIndex
CREATE INDEX "Project_authorId_idx" ON "Project"("authorId");

-- CreateIndex
CREATE INDEX "LikedProject_projectId_idx" ON "LikedProject"("projectId");

-- CreateIndex
CREATE INDEX "LikedProject_userId_idx" ON "LikedProject"("userId");

-- CreateIndex
CREATE INDEX "Donation_projectId_idx" ON "Donation"("projectId");

-- CreateIndex
CREATE INDEX "Donation_userId_idx" ON "Donation"("userId");

-- CreateIndex
CREATE INDEX "Comment_projectId_idx" ON "Comment"("projectId");

-- AddForeignKey
ALTER TABLE "Project"
ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate"
ADD CONSTRAINT "Certificate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedProject"
ADD CONSTRAINT "LikedProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedProject"
ADD CONSTRAINT "LikedProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation"
ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation"
ADD CONSTRAINT "Donation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;