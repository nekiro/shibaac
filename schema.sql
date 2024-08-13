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
