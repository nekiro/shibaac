/*
  Warnings:

  - You are about to alter the column `world` on the `bazarListings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `bazarListings` MODIFY `world` INTEGER NOT NULL;
