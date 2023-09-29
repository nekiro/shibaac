-- CreateTable
CREATE TABLE `BazarBids` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bidderAccountId` INTEGER NOT NULL,
    `bidderPlayerName` VARCHAR(191) NULL,
    `amount` INTEGER NOT NULL,
    `bazarListingId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_BazarBids_bidderId`(`bidderAccountId`),
    INDEX `idx_BazarBids_bazarListingId`(`bazarListingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BazarBids` ADD CONSTRAINT `BazarBids_bazarListingId_fkey` FOREIGN KEY (`bazarListingId`) REFERENCES `bazarListings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
