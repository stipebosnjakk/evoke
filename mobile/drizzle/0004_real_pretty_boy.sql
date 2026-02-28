CREATE TABLE `list_order` (
	`container_id` text NOT NULL,
	`task_id` text NOT NULL,
	`order_key` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`container_id`, `task_id`)
);
--> statement-breakpoint
CREATE INDEX `index_container_order` ON `list_order` (`container_id`,`order_key`);