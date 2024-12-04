CREATE TABLE `aac_news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` varchar(255) NOT NULL,
	`authorId` int,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`imageUrl` varchar(255),
	`playerNick` varchar(255),
	PRIMARY KEY(`id`),
	FOREIGN KEY (`authorId`) REFERENCES `accounts`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
ALTER TABLE `accounts` ADD `rec_key` varchar(255) DEFAULT NULL UNIQUE;
--> statement-breakpoint
ALTER TABLE `accounts` ADD `coins` int(11) NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `accounts` ADD `created_at` int(11) NOT NULL DEFAULT 0;