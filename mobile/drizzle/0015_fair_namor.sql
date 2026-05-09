PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_list_order` (
	`scope_id` text NOT NULL,
	`task_id` text NOT NULL,
	`order_key` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`scope_id`, `task_id`)
);
--> statement-breakpoint
INSERT INTO `__new_list_order`("scope_id", "task_id", "order_key", "created_at", "updated_at") SELECT "scope_id", "task_id", "order_key", "created_at", "updated_at" FROM `list_order`;--> statement-breakpoint
DROP TABLE `list_order`;--> statement-breakpoint
ALTER TABLE `__new_list_order` RENAME TO `list_order`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `index_scope_order` ON `list_order` (`scope_id`,`order_key`);