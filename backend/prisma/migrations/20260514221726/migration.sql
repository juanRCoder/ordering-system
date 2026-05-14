-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusSupply" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "StatusOrder" AS ENUM ('PENDING', 'FINISHED');

-- CreateEnum
CREATE TYPE "TypePayment" AS ENUM ('CASH', 'YAPE');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" "Roles" DEFAULT 'USER',
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TypesSupplies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TypesSupplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "status" "StatusSupply" NOT NULL DEFAULT 'AVAILABLE',
    "imagen_url" TEXT,
    "type_supply_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "guest_name" TEXT NOT NULL,
    "status" "StatusOrder" NOT NULL DEFAULT 'PENDING',
    "observations" TEXT,
    "type_payment" "TypePayment" DEFAULT 'CASH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuppliesOrders" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuppliesOrders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Supplies" ADD CONSTRAINT "Supplies_type_supply_id_fkey" FOREIGN KEY ("type_supply_id") REFERENCES "TypesSupplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuppliesOrders" ADD CONSTRAINT "SuppliesOrders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuppliesOrders" ADD CONSTRAINT "SuppliesOrders_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "Supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
