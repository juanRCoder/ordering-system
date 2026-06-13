/*
  Warnings:

  - You are about to drop the column `observations` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the `TypesSupplies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Supplies" DROP CONSTRAINT "Supplies_type_supply_id_fkey";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "observations";

-- AlterTable
ALTER TABLE "SuppliesOrders" ADD COLUMN     "observations" TEXT;

-- DropTable
DROP TABLE "TypesSupplies";

-- DropEnum
DROP TYPE "LayoutType";

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Supplies" ADD CONSTRAINT "Supplies_type_supply_id_fkey" FOREIGN KEY ("type_supply_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
