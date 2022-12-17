DELETE FROM "LikedCertificate"
WHERE "certificateId" IN (
        SELECT likes."certificateId"
        FROM "LikedCertificate" likes
            LEFT JOIN "Certificate" cert ON likes."certificateId" = cert.id
        WHERE cert.id IS NULL
    );

DELETE FROM "Transaction"
WHERE id IN (
        SELECT transaction.id
        FROM "Transaction" transaction
            LEFT JOIN "Holding" holding ON transaction."buyingHoldingId" = holding.id
        WHERE holding.id IS NULL
    );

-- AlterTable
ALTER TABLE "Holding"
ALTER COLUMN "target"
SET DEFAULT 1000000;

-- AddForeignKey
ALTER TABLE "Account"
ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session"
ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate"
ADD CONSTRAINT "Certificate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedCertificate"
ADD CONSTRAINT "LikedCertificate_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedCertificate"
ADD CONSTRAINT "LikedCertificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateIssuer"
ADD CONSTRAINT "CertificateIssuer_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateIssuer"
ADD CONSTRAINT "CertificateIssuer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding"
ADD CONSTRAINT "Holding_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holding"
ADD CONSTRAINT "Holding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_sellingHoldingId_fkey" FOREIGN KEY ("sellingHoldingId") REFERENCES "Holding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_buyingHoldingId_fkey" FOREIGN KEY ("buyingHoldingId") REFERENCES "Holding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;