-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `tournamentBalance` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `players` ADD COLUMN `bonusrerollcount` BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN `onlinepoint` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `onlinepointtrie` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `quick_loot_fallback` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `rewardTokens` INTEGER NOT NULL DEFAULT 0;
