ALTER TABLE `projects` ADD `is_deleted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `deleted_at_utc` integer;