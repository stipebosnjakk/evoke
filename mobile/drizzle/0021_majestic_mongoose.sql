PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_list_order` (
	`scope_id` text NOT NULL,
	`item_id` text NOT NULL,
	`order_key` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	PRIMARY KEY(`scope_id`, `item_id`)
);
--> statement-breakpoint
INSERT INTO `__new_list_order`("scope_id", "item_id", "order_key", "created_at", "updated_at") SELECT "scope_id", "item_id", "order_key", "created_at", "updated_at" FROM `list_order`;--> statement-breakpoint
DROP TABLE `list_order`;--> statement-breakpoint
ALTER TABLE `__new_list_order` RENAME TO `list_order`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `index_scope_order` ON `list_order` (`scope_id`,`order_key`);--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`completed_at` integer,
	`archived_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "name", "color", "status", "completed_at", "archived_at", "created_at", "updated_at") SELECT "id", "name", "color", "status", "completed_at", "archived_at", "created_at", "updated_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;