ALTER TABLE `projects` ADD `status` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `completed_at` integer;--> statement-breakpoint
ALTER TABLE `projects` ADD `archived_at` integer;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `description`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `start_date`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `deadline`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `priority`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `is_completed`;