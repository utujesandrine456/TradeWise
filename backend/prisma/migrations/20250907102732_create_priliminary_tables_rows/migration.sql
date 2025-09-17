-- CreateTable
CREATE TABLE "public"."MTrader" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MTrader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MStock" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traderId" TEXT NOT NULL,

    CONSTRAINT "MStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MProduct" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,

    CONSTRAINT "MProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MNotification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traderId" TEXT NOT NULL,

    CONSTRAINT "MNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MTrader_email_key" ON "public"."MTrader"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MStock_traderId_key" ON "public"."MStock"("traderId");

-- AddForeignKey
ALTER TABLE "public"."MStock" ADD CONSTRAINT "MStock_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "public"."MTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MProduct" ADD CONSTRAINT "MProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."MCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MProduct" ADD CONSTRAINT "MProduct_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "public"."MStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MNotification" ADD CONSTRAINT "MNotification_traderId_fkey" FOREIGN KEY ("traderId") REFERENCES "public"."MTrader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
