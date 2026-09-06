CREATE TABLE `together` (
	`mode` text PRIMARY KEY NOT NULL,
	`round` integer DEFAULT 0 NOT NULL,
	`him` text,
	`her` text,
	`plan` integer,
	`updated` integer NOT NULL
);
