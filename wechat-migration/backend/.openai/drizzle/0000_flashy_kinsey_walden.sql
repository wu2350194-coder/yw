CREATE TABLE `attempts` (
	`ip` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`until` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`author` text NOT NULL,
	`date` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`mood` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`expires` integer NOT NULL
);
