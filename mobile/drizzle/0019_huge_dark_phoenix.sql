CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`description` text,
	`start_date` text,
	`deadline` text,
	`priority` text,
	`color` text,
	`is_completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
