CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` char(8) NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(128) NOT NULL,
	`type` enum('user','manager','admin','chief') NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_user_id_unique` UNIQUE(`user_id`)
);
