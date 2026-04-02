-- CreateIndex
CREATE INDEX "MFinancial_stockId_idx" ON "MFinancial"("stockId");

-- CreateIndex
CREATE INDEX "MFinancial_type_idx" ON "MFinancial"("type");

-- CreateIndex
CREATE INDEX "MFinancial_isPaidBack_idx" ON "MFinancial"("isPaidBack");

-- CreateIndex
CREATE INDEX "MFinancial_createdAt_idx" ON "MFinancial"("createdAt");

-- CreateIndex
CREATE INDEX "MFinancial_stockId_isPaidBack_idx" ON "MFinancial"("stockId", "isPaidBack");

-- CreateIndex
CREATE INDEX "MFinancial_stockId_createdAt_idx" ON "MFinancial"("stockId", "createdAt");

-- CreateIndex
CREATE INDEX "MNotification_traderId_idx" ON "MNotification"("traderId");

-- CreateIndex
CREATE INDEX "MNotification_read_idx" ON "MNotification"("read");

-- CreateIndex
CREATE INDEX "MNotification_filterType_idx" ON "MNotification"("filterType");

-- CreateIndex
CREATE INDEX "MNotification_createdAt_idx" ON "MNotification"("createdAt");

-- CreateIndex
CREATE INDEX "MNotification_traderId_read_idx" ON "MNotification"("traderId", "read");

-- CreateIndex
CREATE INDEX "MStockImage_stockId_idx" ON "MStockImage"("stockId");

-- CreateIndex
CREATE INDEX "MStockImage_notified_idx" ON "MStockImage"("notified");

-- CreateIndex
CREATE INDEX "MStockImage_quantity_idx" ON "MStockImage"("quantity");

-- CreateIndex
CREATE INDEX "MStockImage_stockId_notified_idx" ON "MStockImage"("stockId", "notified");

-- CreateIndex
CREATE INDEX "MTransaction_stockId_idx" ON "MTransaction"("stockId");

-- CreateIndex
CREATE INDEX "MTransaction_type_idx" ON "MTransaction"("type");

-- CreateIndex
CREATE INDEX "MTransaction_createdAt_idx" ON "MTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "MTransaction_stockId_type_idx" ON "MTransaction"("stockId", "type");

-- CreateIndex
CREATE INDEX "MTransaction_stockId_createdAt_idx" ON "MTransaction"("stockId", "createdAt");
