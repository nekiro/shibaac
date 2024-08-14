CREATE TABLE aac_news (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    content     LONGTEXT NOT NULL,
    createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    authorId    INT UNSIGNED NOT NULL,
    playerNick  VARCHAR(255),
    imageUrl    VARCHAR(255),
    playersId   INT UNSIGNED,
    INDEX idx_authorId (authorId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `accounts` 
ADD COLUMN `rec_key` VARCHAR(255),
ADD COLUMN `twoFASecret` VARCHAR(255),
ADD COLUMN `twoFAEnabled` BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX `accounts_rec_key_unique` ON `accounts` (`rec_key`);

ALTER TABLE player_deaths
ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE player_items
ADD COLUMN id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;

ALTER TABLE guilds
ADD COLUMN banner_url VARCHAR(255);

CREATE TABLE bazar_listings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    playerId INT UNIQUE,
    name VARCHAR(255),
    level INT,
    vocation INT,
    characterPage VARCHAR(255),
    highlight BOOLEAN,
    country VARCHAR(255),
    world INT,
    pvpType VARCHAR(255),
    battlEyeStatus VARCHAR(255),
    remainingTime VARCHAR(255),
    endingAt VARCHAR(255),
    coins INT,
    equipedItems JSON,
    skills JSON,
    quests JSON,
    charms JSON,
    extras JSON,
    oldAccountId INT,
    CONSTRAINT fk_bazarListings_playerId FOREIGN KEY (playerId) REFERENCES players(id),
    INDEX idx_bazarListings_playerId (playerId)
);

CREATE TABLE bazar_bids (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bidderAccountId INT,
    bidderPlayerName VARCHAR(255),
    amount INT,
    bazarListingId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_BazarBids_bazarListingId FOREIGN KEY (bazarListingId) REFERENCES bazar_listings(id) ON DELETE CASCADE,
    INDEX idx_BazarBids_bidderId (bidderAccountId),
    INDEX idx_BazarBids_bazarListingId (bazarListingId)
);

CREATE TABLE player_charms (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    player_guid      INT NOT NULL,
    charm_points     VARCHAR(250),
    charm_expansion  BOOLEAN,
    rune_wound       INT,
    rune_enflame     INT,
    rune_poison      INT,
    rune_freeze      INT,
    rune_zap         INT,
    rune_curse       INT,
    rune_cripple     INT,
    rune_parry       INT,
    rune_dodge       INT,
    rune_adrenaline  INT,
    rune_numb        INT,
    rune_cleanse     INT,
    rune_bless       INT,
    rune_scavenge    INT,
    rune_gut         INT,
    rune_low_blow    INT,
    rune_divine      INT,
    rune_vamp        INT,
    rune_void        INT,
    UsedRunesBit     VARCHAR(250),
    UnlockedRunesBit VARCHAR(250),
    `tracker list`   BLOB
);
