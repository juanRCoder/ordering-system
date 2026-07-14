/*
  Warnings:

  - A unique constraint covering the columns `[order_id,admin_supply_id]` on the table `SuppliesOrders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SuppliesOrders_order_id_admin_supply_id_key" ON "SuppliesOrders"("order_id", "admin_supply_id");
