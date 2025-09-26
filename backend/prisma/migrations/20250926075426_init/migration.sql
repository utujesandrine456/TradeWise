-- CreateEnum
CREATE TYPE "public"."SendMessage" AS ENUM ('Email', 'Phone');

-- CreateEnum
CREATE TYPE "public"."EUnitType" AS ENUM ('Piece', 'Kilogram', 'Litre');

-- CreateEnum
CREATE TYPE "public"."ENTransactionType" AS ENUM ('Purchase', 'Sale');

-- CreateEnum
CREATE TYPE "public"."ENFinancialType" AS ENUM ('Credit', 'Debit');

-- CreateEnum
CREATE TYPE "public"."ENNotificationImpact" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "public"."ENNotificationFilterType" AS ENUM ('INFO', 'WARNING', 'SUCCESS');

-- CreateTable
CREATE TABLE "public"."MTrader" (
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
CREATE TABLE "public"."MTraderSettings" (
    "id" TEXT NOT NULL,
    "enterpriseDescription" VARCHAR(255) NOT NULL,
    "logo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "evaluationPeriod" INTEGER NOT NULL DEFAULT 7,
    "deleteSoldStockAfterEvaluationPeriod" BOOLEAN NOT NULL DEFAULT false,
    "ussdCode" TEXT NOT NULL,
    "sendMessage" "public"."SendMessage" NOT NULL DEFAULT 'Email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traderId" TEXT NOT NULL,

    CONSTRAINT "MTraderSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MStock" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "markAsBought" BOOLEAN NOT NULL DEFAULT false,
    "traderId" TEXT NOT NULL,

    CONSTRAINT "MStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MSoldStock" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MSoldStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MStockImage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "MStockImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MProduct" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "unit" "public"."EUnitType" NOT NULL DEFAULT 'Piece',
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockImageId" TEXT NOT NULL,

    CONSTRAINT "MProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MBuyList" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "quantity" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "MBuyList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MTransaction" (
    "id" TEXT NOT NULL,
    "type" "public"."ENTransactionType" NOT NULL DEFAULT 'Sale',
    "description" TEXT NOT NULL,
    "secondParty" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "MTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MTransactionProduct" (
    "transactionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MTransactionProduct_pkey" PRIMARY KEY ("transactionId","productId")
);

-- CreateTable
CREATE TABLE "public"."MFinancial" (
    "id" TEXT NOT NULL,
    "type" "public"."ENFinancialType" NOT NULL DEFAULT 'Credit',
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "collateral" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stockId" TEXT NOT NULL,
    "transactionId" TEXT,

    CONSTRAINT "MFinancial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MNotification" (
    "id" TEXT NOT NULL,
    "noti_title" VARCHAR(20) NOT NULL,
    "noti_message" VARCHAR(255) NOT NULL,
    "impact" "public"."ENNotificationImpact" NOT NULL DEFAULT 'Medium',
    "filterType" "public"."ENNotificationFilterType" NOT NULL DEFAULT 'INFO',
    "noti_type" VARCHAR(20) NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traderId" TEXT NOT NULL,

    CONSTRAINT "MNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_sold_stock_products" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_sold_stock_products_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MTrader_email_key" ON "public"."MTrader"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MTrader_phone_key" ON "public"."MTrader"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "MTraderSettings_traderId_key" ON "public"."MTraderSettings"("traderId");

-- CreateIndex
CREATE UNIQUE INDEX "MStock_traderId_key" ON "public"."MStock"("traderId");

-- CreateIndex
CREATE INDEX "_sold_stock_products_B_index" ON "public"."_sold_stock_products"("B");

-- AddForeignKey
ALTER TABLE "public"."MTraderSettings" ADD CONSTRAINT "MTraderSettings_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "public"."MTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MStock" ADD CONSTRAINT "MStock_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "public"."MTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MStockImage" ADD CONSTRAINT "MStockImage_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."MStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MProduct" ADD CONSTRAINT "MProduct_stockImageId_fkey" FOREIGN KEY ("stockImageId") REFERENCES "public"."MStockImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MBuyList" ADD CONSTRAINT "MBuyList_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."MStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MTransaction" ADD CONSTRAINT "MTransaction_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."MStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MTransactionProduct" ADD CONSTRAINT "MTransactionProduct_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."MTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MFinancial" ADD CONSTRAINT "MFinancial_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."MStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MFinancial" ADD CONSTRAINT "MFinancial_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."MTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MNotification" ADD CONSTRAINT "MNotification_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "public"."MTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_sold_stock_products" ADD CONSTRAINT "_sold_stock_products_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."MProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_sold_stock_products" ADD CONSTRAINT "_sold_stock_products_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."MSoldStock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
