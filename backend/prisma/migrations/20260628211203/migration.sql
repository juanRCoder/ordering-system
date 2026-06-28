/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Supplies` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Supplies` table. All the data in the column will be lost.
  - You are about to drop the column `imagen_public_id` on the `Supplies` table. All the data in the column will be lost.
  - You are about to drop the column `imagen_url` on the `Supplies` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Supplies` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Supplies` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Supplies` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SuppliesOrders` table. All the data in the column will be lost.
  - You are about to drop the column `supply_id` on the `SuppliesOrders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SuppliesOrders` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Users` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Supplies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_supply_id` to the `SuppliesOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SuppliesOrders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SupplyOrigin" AS ENUM ('PLATFORM', 'ADMIN');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE_TRIAL', 'MONTHLY', 'SEMI_ANNUAL', 'ANNUAL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'SUPER_ADMIN';

-- DropForeignKey
ALTER TABLE "SuppliesOrders" DROP CONSTRAINT "SuppliesOrders_supply_id_fkey";

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "admin_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Supplies" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "imagen_public_id",
DROP COLUMN "imagen_url",
DROP COLUMN "price",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creator_admin_id" TEXT,
ADD COLUMN     "image_public_id" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "origin" "SupplyOrigin" NOT NULL DEFAULT 'PLATFORM',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SuppliesOrders" DROP COLUMN "createdAt",
DROP COLUMN "supply_id",
DROP COLUMN "updatedAt",
ADD COLUMN     "admin_supply_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "business_name" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "plan_type" "PlanType" NOT NULL DEFAULT 'FREE_TRIAL',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "discount_porcent" INTEGER DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSupplies" (
    "id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "supply_id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "status" "StatusSupply" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSupplies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_admin_id_key" ON "Subscriptions"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSupplies_admin_id_supply_id_key" ON "AdminSupplies"("admin_id", "supply_id");

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplies" ADD CONSTRAINT "Supplies_creator_admin_id_fkey" FOREIGN KEY ("creator_admin_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSupplies" ADD CONSTRAINT "AdminSupplies_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSupplies" ADD CONSTRAINT "AdminSupplies_supply_id_fkey" FOREIGN KEY ("supply_id") REFERENCES "Supplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuppliesOrders" ADD CONSTRAINT "SuppliesOrders_admin_supply_id_fkey" FOREIGN KEY ("admin_supply_id") REFERENCES "AdminSupplies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
