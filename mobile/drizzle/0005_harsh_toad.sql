ALTER TABLE `tasks` RENAME COLUMN "recurrence_rule" TO "repeat";--> statement-breakpoint
ALTER TABLE `tasks` ADD `description` text;