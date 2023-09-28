/*
  Warnings:

  - Added the required column `charms` to the `bazarListings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bazarListings` ADD COLUMN `charms` JSON NOT NULL;
