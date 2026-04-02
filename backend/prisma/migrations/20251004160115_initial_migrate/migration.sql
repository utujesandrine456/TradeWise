-- CreateEnum
CREATE TYPE "SendMessage" AS ENUM ('Email', 'Phone');

-- CreateEnum
CREATE TYPE "EUnitType" AS ENUM ('Piece', 'Kilogram', 'Litre');

-- CreateEnum
CREATE TYPE "ENTransactionType" AS ENUM ('Purchase', 'Sale');

-- CreateEnum
CREATE TYPE "ENFinancialType" AS ENUM ('Credit', 'Debit');

-- CreateEnum
CREATE TYPE "ENNotificationImpact" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "ENNotificationFilterType" AS ENUM ('INFO', 'WARNING', 'SUCCESS');

-- CreateTable
CREATE TABLE "MTrader" (
    "id" TEXT NOT NULL,
    "enterpriseName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "resetPasswordToken" TEXT,
    "verifyAccountToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "verifyAccountExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MTrader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MTraderSettings" (
    "id" TEXT NOT NULL,
    "enterpriseDescription" VARCHAR(255) NOT NULL,
    "logo_PublicId" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RWF',
    "evaluationPeriod" INTEGER NOT NULL DEFAULT 7,
    "deleteSoldStockAfterEvaluationPeriod" BOOLEAN NOT NULL DEFAULT false,
    "ussdCode" TEXT NOT NULL,
    "sendMessage" "SendMessage" NOT NULL DEFAULT 'Email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traderId" TEXT NOT NULL,

    CONSTRAINT "MTraderSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MStock" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "markAsBought" BOOLEAN NOT NULL DEFAULT false,
    "traderId" TEXT NOT NULL,

    CONSTRAINT "MStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MStockImage" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "unit" "EUnitType" NOT NULL DEFAULT 'Piece',
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "MStockImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MProduct" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "brand" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockImageId" TEXT NOT NULL,

    CONSTRAINT "MProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MBuyList" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "quantity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "MBuyList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MTransaction" (
    "id" TEXT NOT NULL,
    "type" "ENTransactionType" NOT NULL DEFAULT 'Sale',
    "description" TEXT NOT NULL,
    "secondParty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "MTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MFinancial" (
    "id" TEXT NOT NULL,
    "type" "ENFinancialType" NOT NULL DEFAULT 'Credit',
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "collateral" TEXT,
    "isPaidBack" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,
    "transactionId" TEXT,

    CONSTRAINT "MFinancial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MNotification" (
    "id" TEXT NOT NULL,
    "noti_title" VARCHAR(20) NOT NULL,
    "noti_message" VARCHAR(255) NOT NULL,
    "impact" "ENNotificationImpact" NOT NULL DEFAULT 'Medium',
    "filterType" "ENNotificationFilterType" NOT NULL DEFAULT 'INFO',
    "noti_type" VARCHAR(20) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traderId" TEXT NOT NULL,

    CONSTRAINT "MNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_transaction_products" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_transaction_products_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MTrader_email_key" ON "MTrader"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MTrader_phone_key" ON "MTrader"("phone");

-- CreateIndex
CREATE INDEX "MTrader_email_idx" ON "MTrader"("email");

-- CreateIndex
CREATE INDEX "MTrader_phone_idx" ON "MTrader"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "MTraderSettings_traderId_key" ON "MTraderSettings"("traderId");

-- CreateIndex
CREATE UNIQUE INDEX "MStock_traderId_key" ON "MStock"("traderId");

-- CreateIndex
CREATE UNIQUE INDEX "MStockImage_name_stockId_key" ON "MStockImage"("name", "stockId");

-- CreateIndex
CREATE INDEX "_transaction_products_B_index" ON "_transaction_products"("B");

-- AddForeignKey
ALTER TABLE "MTraderSettings" ADD CONSTRAINT "MTraderSettings_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "MTrader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MStock" ADD CONSTRAINT "MStock_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "MTrader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MStockImage" ADD CONSTRAINT "MStockImage_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "MStock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MProduct" ADD CONSTRAINT "MProduct_stockImageId_fkey" FOREIGN KEY ("stockImageId") REFERENCES "MStockImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MBuyList" ADD CONSTRAINT "MBuyList_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "MStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MTransaction" ADD CONSTRAINT "MTransaction_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "MStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MFinancial" ADD CONSTRAINT "MFinancial_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "MStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MFinancial" ADD CONSTRAINT "MFinancial_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "MTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MNotification" ADD CONSTRAINT "MNotification_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "MTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_transaction_products" ADD CONSTRAINT "_transaction_products_A_fkey" FOREIGN KEY ("A") REFERENCES "MProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_transaction_products" ADD CONSTRAINT "_transaction_products_B_fkey" FOREIGN KEY ("B") REFERENCES "MTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
