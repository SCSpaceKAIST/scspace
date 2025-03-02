CREATE TABLE `asks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` int,
	`timePost` datetime NOT NULL,
	`timeEdit` datetime,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`state` enum('wait','receive','solve') NOT NULL,
	`comment` text,
	`commenterId` int,
	CONSTRAINT `asks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`question` varchar(255) NOT NULL,
	`answer` text NOT NULL,
	`timePost` datetime NOT NULL,
	`timeEdit` datetime,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notices` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`timePost` datetime NOT NULL,
	`timeEdit` datetime,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`important` tinyint NOT NULL DEFAULT 0,
	`userId` char(8) NOT NULL,
	CONSTRAINT `notices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passwords` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`password` char(10) NOT NULL,
	`spaceId` int NOT NULL,
	`timePost` datetime NOT NULL DEFAULT '2024-12-28 11:23:41.295',
	`timeEdit` datetime NOT NULL,
	`changed` tinyint NOT NULL DEFAULT 0,
	`userId` int,
	CONSTRAINT `passwords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`reservation_id` serial AUTO_INCREMENT NOT NULL,
	`userId` char(8) NOT NULL,
	`teamId` int,
	`spaceId` int NOT NULL,
	`timeFrom` datetime NOT NULL,
	`timeTo` datetime NOT NULL,
	`timePost` datetime NOT NULL,
	`content` json,
	`comment` varchar(300),
	`state` enum('grant','wait','received','rejected') NOT NULL DEFAULT 'wait',
	`workerNeed` enum('unnecessary','required','completed','failed') NOT NULL DEFAULT 'unnecessary',
	CONSTRAINT `reservations_reservation_id` PRIMARY KEY(`reservation_id`)
);
--> statement-breakpoint
CREATE TABLE `semesters` (
	`semesterId` char(3) NOT NULL,
	`dateFrom` datetime NOT NULL,
	`dateTo` datetime NOT NULL,
	`year` int NOT NULL,
	`season` enum('봄','가을'),
	CONSTRAINT `semesters_semesterId` PRIMARY KEY(`semesterId`)
);
--> statement-breakpoint
CREATE TABLE `space_introductions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`spaceType` enum('individual','piano','seminar','dance','group','mirae','sumi','open','work') NOT NULL,
	`introType` enum('introduction','usage','caution','shortintro') NOT NULL,
	`info` json NOT NULL,
	CONSTRAINT `space_introductions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spaces` (
	`spaceId` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`nameEng` varchar(100) NOT NULL,
	`spaceType` enum('individual','piano','seminar','dance','group','mirae','sumi','open','work') NOT NULL,
	CONSTRAINT `spaces_spaceId` PRIMARY KEY(`spaceId`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`userId` char(8) NOT NULL,
	`joined` boolean NOT NULL,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`teamId` serial AUTO_INCREMENT NOT NULL,
	`name` char(70) NOT NULL,
	`delegatorId` char(8) NOT NULL,
	`timeRegister` datetime NOT NULL,
	`semesterId` char(3) NOT NULL,
	CONSTRAINT `teams_teamId` PRIMARY KEY(`teamId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(20) NOT NULL,
	`name` varchar(128),
	`email` varchar(128),
	`type` enum('user','manager','admin','chief') NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_userId_unique` UNIQUE(`userId`)
);
