CREATE TABLE `content_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateName` varchar(255) NOT NULL,
	`templateType` varchar(100) NOT NULL,
	`templatePrompt` text,
	`templateStructure` text,
	`language` enum('ar','en') DEFAULT 'ar',
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `content_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generated_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`contentType` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`captionLong` text,
	`storyCaption` text,
	`reelIdea` text,
	`cta` text,
	`hashtags` text,
	`googlePost` text,
	`postDate` varchar(10),
	`postTime` varchar(10),
	`language` enum('ar','en') DEFAULT 'ar',
	`status` enum('draft','scheduled','published','archived') DEFAULT 'draft',
	`platforms` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generated_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `generated_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentId` int,
	`accountId` int NOT NULL,
	`imageUrl` text NOT NULL,
	`prompt` text,
	`imageType` varchar(100),
	`platform` varchar(100),
	`dimensions` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `generated_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketing_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`campaignName` varchar(255) NOT NULL,
	`campaignDescription` text,
	`campaignType` varchar(100),
	`startDate` varchar(10),
	`endDate` varchar(10),
	`budget` int DEFAULT 0,
	`status` enum('planning','active','paused','completed') DEFAULT 'planning',
	`contentIds` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketing_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentId` int NOT NULL,
	`platform` varchar(100) NOT NULL,
	`views` int DEFAULT 0,
	`likes` int DEFAULT 0,
	`comments` int DEFAULT 0,
	`shares` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`conversions` int DEFAULT 0,
	`engagementRate` varchar(10),
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `performance_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publishing_schedule` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentId` int NOT NULL,
	`platform` varchar(100) NOT NULL,
	`scheduledTime` timestamp NOT NULL,
	`status` enum('pending','published','failed') DEFAULT 'pending',
	`errorMessage` text,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `publishing_schedule_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accountId` int NOT NULL,
	`reportType` varchar(100),
	`reportData` text,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	`status` enum('pending','sent','viewed') DEFAULT 'pending',
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seo_optimization` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentId` int NOT NULL,
	`keywords` text,
	`metaDescription` text,
	`metaTitle` varchar(255),
	`ogTitle` varchar(255),
	`ogDescription` text,
	`ogImage` text,
	`seoScore` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seo_optimization_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_media_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountId` int NOT NULL,
	`platform` varchar(100) NOT NULL,
	`platformUsername` varchar(255) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`tokenExpiry` timestamp,
	`isConnected` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_media_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `unified_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`businessDescription` text,
	`businessPhone` varchar(20),
	`businessEmail` varchar(320),
	`businessAddress` text,
	`businessServices` text,
	`targetAudience` text,
	`dialect` varchar(100) DEFAULT 'خليجية',
	`focusServices` text,
	`language` enum('ar','en','both') DEFAULT 'both',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `unified_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `generated_content` ADD CONSTRAINT `generated_content_accountId_unified_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `unified_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `generated_images` ADD CONSTRAINT `generated_images_contentId_generated_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `generated_content`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `generated_images` ADD CONSTRAINT `generated_images_accountId_unified_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `unified_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `marketing_campaigns` ADD CONSTRAINT `marketing_campaigns_accountId_unified_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `unified_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_stats` ADD CONSTRAINT `performance_stats_contentId_generated_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `generated_content`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publishing_schedule` ADD CONSTRAINT `publishing_schedule_contentId_generated_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `generated_content`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_accountId_unified_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `unified_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `seo_optimization` ADD CONSTRAINT `seo_optimization_contentId_generated_content_id_fk` FOREIGN KEY (`contentId`) REFERENCES `generated_content`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `social_media_accounts` ADD CONSTRAINT `social_media_accounts_accountId_unified_accounts_id_fk` FOREIGN KEY (`accountId`) REFERENCES `unified_accounts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `unified_accounts` ADD CONSTRAINT `unified_accounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;