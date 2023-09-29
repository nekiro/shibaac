-- DropForeignKey
ALTER TABLE `BazarBids` DROP FOREIGN KEY `BazarBids_bazarListingId_fkey`;

-- AddForeignKey
ALTER TABLE `BazarBids` ADD CONSTRAINT `BazarBids_bazarListingId_fkey` FOREIGN KEY (`bazarListingId`) REFERENCES `bazarListings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
