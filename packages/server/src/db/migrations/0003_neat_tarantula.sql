ALTER TABLE `passwords` MODIFY COLUMN `time_post` datetime NOT NULL DEFAULT '2024-09-17 19:43:30.406';--> statement-breakpoint
ALTER TABLE `passwords` MODIFY COLUMN `user_id` char(8);