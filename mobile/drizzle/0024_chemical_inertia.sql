ALTER TABLE `tasks` DROP COLUMN `is_deleted`;--> statement-breakpoint
ALTER TABLE `tasks` DROP COLUMN `deleted_at_utc`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `is_deleted`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `deleted_at_utc`;