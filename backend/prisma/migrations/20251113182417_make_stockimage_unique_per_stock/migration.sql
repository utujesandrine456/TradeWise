/*
  Warnings:

  - A unique constraint covering the columns `[name,stockId]` on the table `MStockImage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MStockImage_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "MStockImage_name_stockId_key" ON "MStockImage"("name", "stockId");
