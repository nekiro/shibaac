-- CreateTable
CREATE TABLE `player_preydata` (
    `player_id` INTEGER NOT NULL,
    `data` BLOB NOT NULL,

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `player_preydata` ADD CONSTRAINT `player_preydata_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
