/*
  Warnings:

  - You are about to alter the column `level` on the `bazarListings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `bazarListings` MODIFY `level` INTEGER NOT NULL;
