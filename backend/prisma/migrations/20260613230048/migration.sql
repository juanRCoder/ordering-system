/*
  Warnings:

  - You are about to drop the column `type_supply_id` on the `Supplies` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `Supplies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Supplies" DROP CONSTRAINT "Supplies_type_supply_id_fkey";

-- AlterTable
ALTER TABLE "Supplies" DROP COLUMN "type_supply_id",
ADD COLUMN     "category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Supplies" ADD CONSTRAINT "Supplies_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
