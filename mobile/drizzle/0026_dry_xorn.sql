ALTER TABLE `projects` ADD `is_archived` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `archived_at`;