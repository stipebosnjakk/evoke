PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`completed_at` text,
	`is_deleted` integer DEFAULT false NOT NULL,
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
INSERT INTO `__new_tasks`("id", "title", "description", "created_at", "updated_at", "completed_at", "is_deleted", "status", "project_id", "section_id", "area_id", "start_date", "start_time_min", "duration_min", "deadline", "repeat", "is_inbox") SELECT "id", "title", "description", "created_at", "updated_at", "completed_at", "is_deleted", "status", "project_id", "section_id", "area_id", "start_date", "start_time_min", "duration_min", "deadline", "repeat", "is_inbox" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;