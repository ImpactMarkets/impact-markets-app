-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('COMMENT', 'DONATION', 'CREATED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EventType" NOT NULL,
    "parameters" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

