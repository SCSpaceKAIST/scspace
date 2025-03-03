CREATE TABLE `ask` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`time_post` timestamp NOT NULL DEFAULT (now()),
	`time_edit` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`state` int NOT NULL DEFAULT 1,
	`comment` text,
	`commenter_id` int,
	CONSTRAINT `ask_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faq` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`question` varchar(255) NOT NULL,
	`answer` text NOT NULL,
	`time_post` timestamp NOT NULL DEFAULT (now()),
	`time_edit` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faq_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notice` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`time_post` timestamp NOT NULL DEFAULT (now()),
	`time_edit` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`important` boolean NOT NULL DEFAULT false,
	`user_id` int NOT NULL,
	CONSTRAINT `notice_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`password` varchar(10) NOT NULL,
	`space_id` int NOT NULL,
	`time_post` timestamp NOT NULL DEFAULT (now()),
	`time_edit` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`changed` boolean NOT NULL DEFAULT false,
	`user_id` int NOT NULL,
	CONSTRAINT `password_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservation` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`team_id` int,
	`space_id` int NOT NULL,
	`time_from` timestamp NOT NULL,
	`time_to` timestamp NOT NULL,
	`time_post` timestamp NOT NULL DEFAULT (now()),
	`time_edit` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`comment` varchar(300),
	`state` int NOT NULL DEFAULT 1,
	`worker_need` int NOT NULL DEFAULT 1,
	CONSTRAINT `reservation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservation_content` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reservation_id` int NOT NULL,
	`space_type` int NOT NULL,
	`event_name` varchar(255) NOT NULL,
	`organization_name` varchar(255),
	`contents` varchar(255),
	`participant_number` int,
	`inner_participant_number` int,
	`outer_participant_number` int,
	`event_purpose` varchar(255),
	`food` varchar(255),
	`desk` int,
	`chair` int,
	`lobby` boolean,
	`work_complete` boolean,
	CONSTRAINT `reservation_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservation_content_array_element` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`reservation_id` int NOT NULL,
	`element` int NOT NULL,
	`element_type` int NOT NULL,
	CONSTRAINT `reservation_content_array_element_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `semester` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`date_from` timestamp NOT NULL,
	`date_to` timestamp NOT NULL,
	`year` int NOT NULL,
	`season` int NOT NULL,
	`type` int NOT NULL,
	CONSTRAINT `semester_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `space` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`name_eng` varchar(100) NOT NULL,
	`space_type` int NOT NULL,
	CONSTRAINT `space_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `space_introduction` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`space_type` int NOT NULL,
	`intro_type` int NOT NULL,
	`info` json NOT NULL,
	CONSTRAINT `space_introduction_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(70) NOT NULL,
	`delegator_id` int NOT NULL,
	`time_register` timestamp NOT NULL DEFAULT (now()),
	`semester_id` int NOT NULL,
	CONSTRAINT `team_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_member` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`team_id` int NOT NULL,
	`user_id` int NOT NULL,
	`joined` boolean NOT NULL DEFAULT false,
	CONSTRAINT `team_member_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`kaist_uid` varchar(50) NOT NULL,
	`user_sso_id` varchar(50),
	`name_kr` varchar(128),
	`name_en` varchar(128),
	`user_number` varchar(128),
	`email` varchar(128),
	`type` int NOT NULL DEFAULT 1,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_kaist_uid_unique` UNIQUE(`kaist_uid`)
);
