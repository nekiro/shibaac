-- CreateTable
CREATE TABLE `boosted_creature` (
    `boostname` TEXT NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `raceid` VARCHAR(191) NOT NULL,
    `looktype` INTEGER NOT NULL DEFAULT 136,
    `lookfeet` INTEGER NOT NULL DEFAULT 0,
    `looklegs` INTEGER NOT NULL DEFAULT 0,
    `lookhead` INTEGER NOT NULL DEFAULT 0,
    `lookbody` INTEGER NOT NULL DEFAULT 0,
    `lookaddons` INTEGER NOT NULL DEFAULT 0,
    `lookmount` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
