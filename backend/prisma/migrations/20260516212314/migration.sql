/*
  Warnings:

  - You are about to drop the column `type_payment` on the `Orders` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Supplies` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `SuppliesOrders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "type_payment",
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "type_pay" "TypePayment" DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "Supplies" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "SuppliesOrders" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
