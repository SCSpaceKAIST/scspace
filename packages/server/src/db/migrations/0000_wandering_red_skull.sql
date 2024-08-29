CREATE TABLE `asks` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` char(8) NOT NULL,
	`time_post` datetime NOT NULL,
	`time_edit` datetime,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`state` enum('wait','receive','solve') NOT NULL,
	`comment` text,
	`commenter_id` char(8),
	CONSTRAINT `asks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`question` varchar(255) NOT NULL,
	`answer` text NOT NULL,
	`time_post` datetime NOT NULL,
	`time_edit` datetime,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notices` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`time_post` datetime NOT NULL,
	`time_edit` datetime,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`important` tinyint NOT NULL DEFAULT 0,
	`user_id` char(8) NOT NULL,
	CONSTRAINT `notices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passwords` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`password` char(10) NOT NULL,
	`space_id` int NOT NULL,
	`time_edit` datetime NOT NULL,
	`changed` tinyint NOT NULL DEFAULT 0,
	CONSTRAINT `passwords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`reservation_id` serial AUTO_INCREMENT NOT NULL,
	`user_id` char(8) NOT NULL,
	`team_id` int,
	`space_id` int NOT NULL,
	`time_from` datetime NOT NULL,
	`time_to` datetime NOT NULL,
	`time_post` datetime NOT NULL,
	`content` json,
	`comment` varchar(300),
	`state` enum('grant','wait','received','rejected') NOT NULL DEFAULT 'wait',
	`worker_need` enum('unnecessary','required','completed','failed') NOT NULL DEFAULT 'unnecessary',
	CONSTRAINT `reservations_reservation_id` PRIMARY KEY(`reservation_id`)
);
--> statement-breakpoint
CREATE TABLE `semesters` (
	`semester_id` char(3) NOT NULL,
	`date_from` datetime NOT NULL,
	`date_to` datetime NOT NULL,
	`year` int NOT NULL,
	`season` enum('봄','가을'),
	CONSTRAINT `semesters_semester_id` PRIMARY KEY(`semester_id`)
);
--> statement-breakpoint
CREATE TABLE `space_introductions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`space_type` enum('individual','piano','seminar','dance','group','mirae','sumi','open','work') NOT NULL,
	`intro_type` enum('introduction','usage','caution','shortintro') NOT NULL,
	`info` json NOT NULL,
	CONSTRAINT `space_introductions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spaces` (
	`space_id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`name_eng` varchar(100) NOT NULL,
	`space_type` enum('individual','piano','seminar','dance','group','mirae','sumi','open','work') NOT NULL,
	CONSTRAINT `spaces_space_id` PRIMARY KEY(`space_id`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`team_id` int NOT NULL,
	`user_id` char(8) NOT NULL,
	`joined` boolean NOT NULL,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`team_id` serial AUTO_INCREMENT NOT NULL,
	`name` char(70) NOT NULL,
	`delegator_id` char(8) NOT NULL,
	`time_register` datetime NOT NULL,
	`semester_id` char(3) NOT NULL,
	CONSTRAINT `teams_team_id` PRIMARY KEY(`team_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` char(8) NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(128) NOT NULL,
	`type` enum('user','manager','admin','chief') NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_user_id_unique` UNIQUE(`user_id`)
);
