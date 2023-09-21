/*
  Warnings:

  - You are about to drop the column `rkey` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `rec_key` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accounts` DROP COLUMN `rkey`,
    ADD COLUMN `rec_key` VARCHAR(191) NOT NULL;
