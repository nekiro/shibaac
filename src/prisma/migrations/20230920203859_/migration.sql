-- CreateTable
CREATE TABLE `account_bans` (
    `account_id` INTEGER NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `banned_at` BIGINT NOT NULL,
    `expires_at` BIGINT NOT NULL,
    `banned_by` INTEGER NOT NULL,

    INDEX `banned_by`(`banned_by`),
    PRIMARY KEY (`account_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL,
    `password` CHAR(40) NOT NULL,
    `secret` CHAR(16) NULL,
    `type` INTEGER NOT NULL DEFAULT 1,
    `coins` INTEGER NOT NULL DEFAULT 0,
    `premium_ends_at` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `email` VARCHAR(255) NOT NULL,
    `creation` INTEGER NOT NULL DEFAULT 0,
    `twoFASecret` VARCHAR(191) NULL,
    `twoFAEnabled` BOOLEAN NOT NULL,
    `resetToken` VARCHAR(191) NULL,

    UNIQUE INDEX `name`(`name`),
    UNIQUE INDEX `accounts_email_key`(`email`),
    UNIQUE INDEX `accounts_resetToken_key`(`resetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `group_id` INTEGER NOT NULL DEFAULT 1,
    `account_id` INTEGER NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `vocation` INTEGER NOT NULL DEFAULT 0,
    `health` INTEGER NOT NULL DEFAULT 150,
    `healthmax` INTEGER NOT NULL DEFAULT 150,
    `experience` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `lookbody` INTEGER NOT NULL DEFAULT 0,
    `lookfeet` INTEGER NOT NULL DEFAULT 0,
    `lookhead` INTEGER NOT NULL DEFAULT 0,
    `looklegs` INTEGER NOT NULL DEFAULT 0,
    `looktype` INTEGER NOT NULL DEFAULT 136,
    `lookaddons` INTEGER NOT NULL DEFAULT 0,
    `lookmount` INTEGER NOT NULL DEFAULT 0,
    `lookmounthead` INTEGER NOT NULL DEFAULT 0,
    `lookmountbody` INTEGER NOT NULL DEFAULT 0,
    `lookmountlegs` INTEGER NOT NULL DEFAULT 0,
    `lookmountfeet` INTEGER NOT NULL DEFAULT 0,
    `direction` TINYINT UNSIGNED NOT NULL DEFAULT 2,
    `maglevel` INTEGER NOT NULL DEFAULT 0,
    `mana` INTEGER NOT NULL DEFAULT 0,
    `manamax` INTEGER NOT NULL DEFAULT 0,
    `manaspent` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `soul` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `town_id` INTEGER NOT NULL DEFAULT 1,
    `posx` INTEGER NOT NULL DEFAULT 0,
    `posy` INTEGER NOT NULL DEFAULT 0,
    `posz` INTEGER NOT NULL DEFAULT 0,
    `conditions` BLOB NULL,
    `cap` INTEGER NOT NULL DEFAULT 400,
    `sex` INTEGER NOT NULL DEFAULT 0,
    `lastlogin` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `lastip` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `save` TINYINT NOT NULL DEFAULT 1,
    `skull` TINYINT NOT NULL DEFAULT 0,
    `skulltime` BIGINT NOT NULL DEFAULT 0,
    `lastlogout` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `blessings` TINYINT NOT NULL DEFAULT 0,
    `onlinetime` BIGINT NOT NULL DEFAULT 0,
    `deletion` BIGINT NOT NULL DEFAULT 0,
    `balance` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `offlinetraining_time` SMALLINT UNSIGNED NOT NULL DEFAULT 43200,
    `offlinetraining_skill` INTEGER NOT NULL DEFAULT -1,
    `stamina` SMALLINT UNSIGNED NOT NULL DEFAULT 2520,
    `skill_fist` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_fist_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_club` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_club_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_sword` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_sword_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_axe` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_axe_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_dist` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_dist_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_shielding` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_shielding_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `skill_fishing` INTEGER UNSIGNED NOT NULL DEFAULT 10,
    `skill_fishing_tries` BIGINT UNSIGNED NOT NULL DEFAULT 0,

    UNIQUE INDEX `name`(`name`),
    INDEX `account_id`(`account_id`),
    INDEX `vocation`(`vocation`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players_online` (
    `player_id` INTEGER NOT NULL,

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `player_deaths` (
    `player_id` INTEGER NOT NULL,
    `time` BIGINT NOT NULL DEFAULT 0,
    `level` INTEGER NOT NULL DEFAULT 1,
    `killed_by` VARCHAR(255) NOT NULL,
    `is_player` BOOLEAN NOT NULL DEFAULT true,
    `mostdamage_by` VARCHAR(100) NOT NULL,
    `mostdamage_is_player` BOOLEAN NOT NULL DEFAULT false,
    `unjustified` BOOLEAN NOT NULL DEFAULT false,
    `mostdamage_unjustified` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `towns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `posx` INTEGER NOT NULL DEFAULT 0,
    `posy` INTEGER NOT NULL DEFAULT 0,
    `posz` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `name`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aac_news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorId` INTEGER NOT NULL,
    `playerNick` VARCHAR(255) NULL,
    `imageUrl` VARCHAR(255) NULL,

    INDEX `idx_authorId`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guilds` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` INTEGER NOT NULL DEFAULT 1,
    `name` VARCHAR(191) NOT NULL,
    `ownerid` INTEGER NOT NULL,
    `creationdata` DATETIME(3) NOT NULL,
    `motd` VARCHAR(191) NOT NULL DEFAULT '',
    `residence` INTEGER NOT NULL DEFAULT 0,
    `balance` BIGINT NOT NULL DEFAULT 0,
    `points` INTEGER NOT NULL DEFAULT 0,
    `logoUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `guilds_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_ranks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_invites` (
    `player_id` INTEGER NOT NULL,
    `guild_id` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_wars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guild1` INTEGER NOT NULL,
    `guild2` INTEGER NOT NULL,
    `name1` VARCHAR(191) NOT NULL,
    `name2` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `started` BIGINT NOT NULL DEFAULT 0,
    `ended` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guildwar_kills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `killer` VARCHAR(191) NOT NULL,
    `target` VARCHAR(191) NOT NULL,
    `killerguild` INTEGER NOT NULL,
    `targetguild` INTEGER NOT NULL,
    `warid` INTEGER NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_membership` (
    `player_id` INTEGER NOT NULL,
    `guild_id` INTEGER NOT NULL,
    `rank_id` INTEGER NOT NULL,
    `nick` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `guild_membership_player_id_guild_id_key`(`player_id`, `guild_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `houses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner` INTEGER NOT NULL,
    `paid` INTEGER NOT NULL DEFAULT 0,
    `warnings` INTEGER NOT NULL DEFAULT 0,
    `name` VARCHAR(191) NOT NULL,
    `rent` INTEGER NOT NULL DEFAULT 0,
    `town_id` INTEGER NOT NULL DEFAULT 0,
    `bid` INTEGER NOT NULL DEFAULT 0,
    `bid_end` INTEGER NOT NULL DEFAULT 0,
    `last_bid` INTEGER NOT NULL DEFAULT 0,
    `highest_bidder` INTEGER NOT NULL DEFAULT 0,
    `size` INTEGER NOT NULL DEFAULT 0,
    `guildId` INTEGER NULL,
    `beds` INTEGER NOT NULL DEFAULT 0,

    INDEX `owner`(`owner`),
    INDEX `town_id`(`town_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `house_lists` (
    `house_id` INTEGER NOT NULL,
    `listid` INTEGER NOT NULL,
    `list` VARCHAR(191) NOT NULL,

    INDEX `house_id`(`house_id`),
    PRIMARY KEY (`house_id`, `listid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `paymentId` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `purchases_paymentId_key`(`paymentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shop_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `itemid` INTEGER NOT NULL,
    `count` INTEGER NOT NULL,
    `coins` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `accountId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account_bans` ADD CONSTRAINT `account_bans_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_bans` ADD CONSTRAINT `account_bans_ibfk_2` FOREIGN KEY (`banned_by`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `players` ADD CONSTRAINT `players_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `players_online` ADD CONSTRAINT `players_online_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `player_deaths` ADD CONSTRAINT `player_deaths_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aac_news` ADD CONSTRAINT `aac_news_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guilds` ADD CONSTRAINT `guilds_ownerid_fkey` FOREIGN KEY (`ownerid`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_ranks` ADD CONSTRAINT `guild_ranks_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_invites` ADD CONSTRAINT `guild_invites_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_invites` ADD CONSTRAINT `guild_invites_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_wars` ADD CONSTRAINT `guild_wars_guild1_fkey` FOREIGN KEY (`guild1`) REFERENCES `guilds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_wars` ADD CONSTRAINT `guild_wars_guild2_fkey` FOREIGN KEY (`guild2`) REFERENCES `guilds`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guildwar_kills` ADD CONSTRAINT `guildwar_kills_warid_fkey` FOREIGN KEY (`warid`) REFERENCES `guild_wars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_membership` ADD CONSTRAINT `guild_membership_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_membership` ADD CONSTRAINT `guild_membership_guild_id_fkey` FOREIGN KEY (`guild_id`) REFERENCES `guilds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guild_membership` ADD CONSTRAINT `guild_membership_rank_id_fkey` FOREIGN KEY (`rank_id`) REFERENCES `guild_ranks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `house_lists` ADD CONSTRAINT `house_lists_house_id_fkey` FOREIGN KEY (`house_id`) REFERENCES `houses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchases` ADD CONSTRAINT `purchases_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shop_orders` ADD CONSTRAINT `shop_orders_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
