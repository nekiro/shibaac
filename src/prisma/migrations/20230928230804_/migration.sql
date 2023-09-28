-- CreateTable
CREATE TABLE `bazarListings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `characterPage` VARCHAR(191) NOT NULL,
    `highlight` BOOLEAN NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `world` VARCHAR(191) NOT NULL,
    `pvpType` VARCHAR(191) NOT NULL,
    `battlEyeStatus` VARCHAR(191) NOT NULL,
    `remainingTime` VARCHAR(191) NOT NULL,
    `endingAt` VARCHAR(191) NOT NULL,
    `coins` INTEGER NOT NULL,
    `equipedItems` JSON NOT NULL,
    `skills` JSON NOT NULL,
    `quests` JSON NOT NULL,

    UNIQUE INDEX `bazarListings_playerId_key`(`playerId`),
    INDEX `idx_bazarListings_playerId`(`playerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bazarListings` ADD CONSTRAINT `bazarListings_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
