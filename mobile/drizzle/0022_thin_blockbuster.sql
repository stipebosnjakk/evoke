CREATE TABLE `task_completions` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`completed_at` integer NOT NULL,
	`completion_date` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `task_completion_once_per_day` ON `task_completions` (`task_id`,`completion_date`);