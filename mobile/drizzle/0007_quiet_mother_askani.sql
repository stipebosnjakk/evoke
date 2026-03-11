PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`created_at` integer,
	`updated_at` integer,
	`completed_at` integer,
	`is_deleted` integer DEFAULT false,
	`status` text,
	`project_id` text,
	`section_id` text,
	`area_id` text,
	`start_date` text,
	`start_time_min` integer,
	`due_time_min` integer,
	`deadline` text,
	`repeat` text
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "description", "created_at", "updated_at", "completed_at", "is_deleted", "status", "project_id", "section_id", "area_id", "start_date", "start_time_min", "due_time_min", "deadline", "repeat") SELECT "id", "title", "description", "created_at", "updated_at", "completed_at", "is_deleted", "status", "project_id", "section_id", "area_id", "start_date", "start_time_min", "due_time_min", "deadline", "repeat" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;