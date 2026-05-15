/*
  Warnings:

  - You are about to drop the column `description` on the `TypesSupplies` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LayoutType" AS ENUM ('FULL', 'HALF');

-- AlterTable
ALTER TABLE "TypesSupplies" DROP COLUMN "description",
ADD COLUMN     "layout" "LayoutType" NOT NULL DEFAULT 'FULL';
