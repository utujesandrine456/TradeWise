/*
  Warnings:

  - You are about to drop the column `name` on the `MTrader` table. All the data in the column will be lost.
  - Added the required column `noti_message` to the `MNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noti_title` to the `MNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noti_type` to the `MNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterpriseName` to the `MTrader` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ENProductUnit" AS ENUM ('KG', 'Pieces', 'Liters');

-- CreateEnum
CREATE TYPE "public"."ENNotificationImpact" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "public"."ENNotificationFilterType" AS ENUM ('INFO', 'WARNING', 'SUCCESS');

-- AlterTable
ALTER TABLE "public"."MCategory" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."MNotification" ADD COLUMN     "filterType" "public"."ENNotificationFilterType" NOT NULL DEFAULT 'INFO',
ADD COLUMN     "impact" "public"."ENNotificationImpact" NOT NULL DEFAULT 'Medium',
ADD COLUMN     "noti_message" VARCHAR(255) NOT NULL,
ADD COLUMN     "noti_title" VARCHAR(20) NOT NULL,
ADD COLUMN     "noti_type" VARCHAR(20) NOT NULL,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."MProduct" ADD COLUMN     "unit" "public"."ENProductUnit" NOT NULL DEFAULT 'Pieces';

-- AlterTable
ALTER TABLE "public"."MTrader" DROP COLUMN "name",
ADD COLUMN     "enterpriseName" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- CreateTable
CREATE TABLE "public"."MPricesOfProduct" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MPricesOfProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MPricesOfProduct_productId_createdAt_idx" ON "public"."MPricesOfProduct"("productId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."MPricesOfProduct" ADD CONSTRAINT "MPricesOfProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."MProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
