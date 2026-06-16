/*
  Warnings:

  - You are about to drop the column `type_pay` on the `Orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'YAPE');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('LOCAL', 'WHATSAPP');

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "type_pay",
ADD COLUMN     "order_type" "OrderType" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "payment_type" "PaymentType" DEFAULT 'CASH';

-- DropEnum
DROP TYPE "TypePayment";
