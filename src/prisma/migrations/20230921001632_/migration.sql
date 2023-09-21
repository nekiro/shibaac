/*
  Warnings:

  - A unique constraint covering the columns `[rec_key]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `accounts` MODIFY `rec_key` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `accounts_rec_key_key` ON `accounts`(`rec_key`);
