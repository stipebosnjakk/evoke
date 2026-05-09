PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`is_completed` integer DEFAULT false NOT NULL,
	`completed_at_utc` integer,
	`is_deleted` integer DEFAULT false NOT NULL,
	`deleted_at_utc` integer,
	`status` text,
	`project_id` text,
	`section_id` text,
	`area_id` text,
	`start_date` text,
	`start_time_min` integer,
	`duration_min` integer,
	`deadline` text,
	`repeat` text,
	`is_inbox` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "description", "created_at", "updated_at", "is_completed", "completed_at_utc", "is_deleted", "deleted_at_utc", "status", "project_id", "section_id", "area_id", "start_date", "start_time_min", "duration_min", "deadline", "repeat", "is_inbox") SELECT "id", "title", "description", "created_at", "updated_at", "is_completed", "completed_at_utc", "is_deleted", "deleted_at_utc", "status", "project_id", "section_id", "area_id", "start_date", "start_time_min", "duration_min", "deadline", "repeat", "is_inbox" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;