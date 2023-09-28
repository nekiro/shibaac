/*
  Warnings:

  - Added the required column `vocation` to the `bazarListings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bazarListings` ADD COLUMN `vocation` INTEGER NOT NULL;
