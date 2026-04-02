/*
  Warnings:

  - You are about to drop the column `deleteSoldStockAfterEvaluationPeriod` on the `MTraderSettings` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationPeriod` on the `MTraderSettings` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `MTraderSettings` table. All the data in the column will be lost.
  - You are about to drop the column `logo_PublicId` on the `MTraderSettings` table. All the data in the column will be lost.
  - You are about to drop the column `sendMessage` on the `MTraderSettings` table. All the data in the column will be lost.
  - You are about to drop the column `ussdCode` on the `MTraderSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pTId]` on the table `MTrader` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EPaymentMethod" AS ENUM ('Cash', 'Credit_Card', 'Debit_Card', 'Bank_Transfer', 'Mobile_Money', 'PayPal', 'Check', 'Crypto');

-- AlterTable
ALTER TABLE "MTrader" ADD COLUMN     "pTId" TEXT;

-- AlterTable
ALTER TABLE "MTraderSettings" DROP COLUMN "deleteSoldStockAfterEvaluationPeriod",
DROP COLUMN "evaluationPeriod",
DROP COLUMN "logoUrl",
DROP COLUMN "logo_PublicId",
DROP COLUMN "sendMessage",
DROP COLUMN "ussdCode",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "anualRevenue" DOUBLE PRECISION,
ADD COLUMN     "businessHours" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "competitors" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "goals" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "numberOfEmployees" INTEGER,
ADD COLUMN     "paymentMethod" "EPaymentMethod",
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "targetMarket" TEXT,
ADD COLUMN     "website" TEXT;

-- DropEnum
DROP TYPE "public"."SendMessage";

-- CreateIndex
CREATE UNIQUE INDEX "MTrader_pTId_key" ON "MTrader"("pTId");
