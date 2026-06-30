/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_slug_key" ON "Users"("slug");
