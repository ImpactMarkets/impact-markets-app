-- AlterTable
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_pkey",
    ADD COLUMN "oldId" INTEGER,
    ALTER COLUMN "id" DROP DEFAULT,
    ALTER COLUMN "id"
SET DATA TYPE TEXT,
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_oldId_key" ON "Certificate"("oldId");

DROP SEQUENCE "Post_id_seq";

-- AlterTable
ALTER TABLE "Comment"
ALTER COLUMN "certificateId"
SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Holding"
ALTER COLUMN "certificateId"
SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "LikedCertificate" DROP CONSTRAINT "LikedCertificate_pkey",
    ALTER COLUMN "certificateId"
SET DATA TYPE TEXT,
    ADD CONSTRAINT "LikedCertificate_pkey" PRIMARY KEY ("certificateId", "userId");

UPDATE "Certificate"
SET "oldId" = "id"::int;

UPDATE "Comment"
SET "certificateId" = "Certificate"."cuid"
FROM "Certificate"
WHERE "Comment"."certificateId" = "Certificate"."id";

UPDATE "Holding"
SET "certificateId" = "Certificate"."cuid"
FROM "Certificate"
WHERE "Holding"."certificateId" = "Certificate"."id";

UPDATE "LikedCertificate"
SET "certificateId" = "Certificate"."cuid"
FROM "Certificate"
WHERE "LikedCertificate"."certificateId" = "Certificate"."id";

UPDATE "Certificate"
SET "id" = "cuid";

ALTER TABLE "Certificate" DROP COLUMN "cuid";