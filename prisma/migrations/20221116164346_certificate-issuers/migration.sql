-- CreateTable
CREATE TABLE "CertificateIssuer" (
    "certificateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CertificateIssuer_pkey" PRIMARY KEY ("certificateId", "userId")
);

-- CreateIndex
CREATE INDEX "CertificateIssuer_certificateId_idx" ON "CertificateIssuer"("certificateId");

-- CreateIndex
CREATE INDEX "CertificateIssuer_userId_idx" ON "CertificateIssuer"("userId");

INSERT INTO "CertificateIssuer" ("certificateId", "userId")
SELECT "Certificate"."id",
    "Certificate"."authorId"
FROM "Certificate";