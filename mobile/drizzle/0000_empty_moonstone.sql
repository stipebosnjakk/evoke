CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`completed_at` integer,
	`is_deleted` integer DEFAULT false NOT NULL,
	`status` text,
	`project_id` text,
	`section_id` text,
	`area_id` text,
	`start_date` integer,
	`due_date` integer,
	`sort_order` real NOT NULL,
	`duration_min` integer,
	`recurrence_rule` text
);
