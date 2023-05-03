-- CreateEnum
CREATE TYPE "BountyStatus" AS ENUM(
    'ACTIVE',
    'CLAIMED',
    'CLOSED'
);

-- AlterTable
ALTER TABLE "Comment"
    ADD COLUMN "bountyId" TEXT,
    ALTER COLUMN "projectId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project"
    ADD COLUMN "solvesBountyId" TEXT,
    ALTER COLUMN "hidden" SET DEFAULT FALSE;

-- CreateTable
CREATE TABLE "Bounty"(
    "id" text NOT NULL,
    "title" varchar(255) NOT NULL,
    "content" text NOT NULL,
    "contentHtml" text NOT NULL,
    "size" DECIMAL(65, 30) NOT NULL,
    "deadline" timestamp(3),
    "tags" text NOT NULL DEFAULT '',
    "status" "BountyStatus" NOT NULL DEFAULT 'ACTIVE',
    "sourceUrl" text NOT NULL DEFAULT '',
    "hidden" boolean NOT NULL DEFAULT FALSE,
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) NOT NULL,
    "authorId" text NOT NULL,
    CONSTRAINT "Bounty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikedBounty"(
    "bountyId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LikedBounty_pkey" PRIMARY KEY ("bountyId", "userId")
);

-- CreateIndex
CREATE INDEX "Bounty_authorId_idx" ON "Bounty"("authorId");

-- CreateIndex
CREATE INDEX "LikedBounty_bountyId_idx" ON "LikedBounty"("bountyId");

-- CreateIndex
CREATE INDEX "LikedBounty_userId_idx" ON "LikedBounty"("userId");

-- CreateIndex
CREATE INDEX "Comment_bountyId_idx" ON "Comment"("bountyId");

-- AddForeignKey
ALTER TABLE "Bounty"
    ADD CONSTRAINT "Bounty_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedBounty"
    ADD CONSTRAINT "LikedBounty_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedBounty"
    ADD CONSTRAINT "LikedBounty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment"
    ADD CONSTRAINT "Comment_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "Bounty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

