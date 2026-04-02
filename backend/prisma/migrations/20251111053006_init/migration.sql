/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `MStockImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MStockImage_name_key" ON "MStockImage"("name");
