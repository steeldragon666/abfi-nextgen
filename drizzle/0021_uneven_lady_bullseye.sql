CREATE TABLE `accu_price_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`change` decimal(10,2) NOT NULL,
	`changePct` decimal(6,2) NOT NULL,
	`source` varchar(100) DEFAULT 'CER',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `accu_price_history_id` PRIMARY KEY(`id`),
	CONSTRAINT `accu_date_idx` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `feedstock_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commodity` varchar(50) NOT NULL,
	`region` varchar(20) NOT NULL,
	`date` date NOT NULL,
	`open` decimal(10,2) NOT NULL,
	`high` decimal(10,2) NOT NULL,
	`low` decimal(10,2) NOT NULL,
	`close` decimal(10,2) NOT NULL,
	`volume` int,
	`source` varchar(100) DEFAULT 'ABFI Internal',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feedstock_prices_id` PRIMARY KEY(`id`),
	CONSTRAINT `commodity_region_date_idx` UNIQUE(`commodity`,`region`,`date`)
);
--> statement-breakpoint
CREATE TABLE `forward_curves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commodity` varchar(50) NOT NULL,
	`region` varchar(20) NOT NULL,
	`tenor` varchar(20) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`changeFromSpot` decimal(6,2) NOT NULL,
	`asOfDate` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forward_curves_id` PRIMARY KEY(`id`),
	CONSTRAINT `forward_commodity_region_date_idx` UNIQUE(`commodity`,`region`,`asOfDate`,`tenor`)
);
--> statement-breakpoint
CREATE TABLE `lender_sentiment_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lender` varchar(100) NOT NULL,
	`date` date NOT NULL,
	`sentimentScore` decimal(6,2) NOT NULL,
	`documentCount` int NOT NULL DEFAULT 0,
	`bullishCount` int NOT NULL DEFAULT 0,
	`bearishCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lender_sentiment_scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `lender_date_idx` UNIQUE(`lender`,`date`)
);
--> statement-breakpoint
CREATE TABLE `mandate_scenarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`mandateLevel` varchar(20) NOT NULL,
	`revenueImpact` decimal(15,2) NOT NULL,
	`description` text,
	`assumptions` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mandate_scenarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offtake_agreements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`offtaker` varchar(200) NOT NULL,
	`mandate` varchar(100) NOT NULL,
	`volume` varchar(100) NOT NULL,
	`term` varchar(50) NOT NULL,
	`premium` varchar(50) NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offtake_agreements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `policy_consultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`jurisdiction` varchar(50) NOT NULL,
	`opens` date NOT NULL,
	`closes` date NOT NULL,
	`relevance` varchar(50) NOT NULL,
	`submissionUrl` varchar(1000),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `policy_consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `policy_kanban_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`jurisdiction` varchar(50) NOT NULL,
	`policyType` varchar(100) NOT NULL,
	`status` enum('proposed','review','enacted','expired') NOT NULL,
	`summary` text,
	`expectedDate` date,
	`url` varchar(1000),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `policy_kanban_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `policy_timeline_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jurisdiction` varchar(50) NOT NULL,
	`date` date NOT NULL,
	`eventType` enum('enacted','consultation_open','expected_decision','expired') NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`policyId` varchar(100),
	`url` varchar(1000),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `policy_timeline_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regional_price_summary` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commodity` varchar(50) NOT NULL,
	`region` varchar(20) NOT NULL,
	`regionName` varchar(100) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`changePct` decimal(6,2) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'AUD',
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `regional_price_summary_id` PRIMARY KEY(`id`),
	CONSTRAINT `regional_commodity_region_idx` UNIQUE(`commodity`,`region`)
);
--> statement-breakpoint
CREATE TABLE `sentiment_daily_index` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`overallIndex` decimal(6,2) NOT NULL,
	`bullishCount` int NOT NULL DEFAULT 0,
	`bearishCount` int NOT NULL DEFAULT 0,
	`neutralCount` int NOT NULL DEFAULT 0,
	`documentsAnalyzed` int NOT NULL DEFAULT 0,
	`regulatoryRisk` decimal(5,2) DEFAULT '0',
	`technologyRisk` decimal(5,2) DEFAULT '0',
	`feedstockRisk` decimal(5,2) DEFAULT '0',
	`counterpartyRisk` decimal(5,2) DEFAULT '0',
	`marketRisk` decimal(5,2) DEFAULT '0',
	`esgConcerns` decimal(5,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sentiment_daily_index_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_date_idx` UNIQUE(`date`)
);
--> statement-breakpoint
CREATE TABLE `sentiment_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` varchar(255) NOT NULL,
	`source` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text,
	`url` varchar(1000),
	`publishedDate` timestamp NOT NULL,
	`sentiment` enum('BULLISH','BEARISH','NEUTRAL') NOT NULL,
	`sentimentScore` decimal(5,2) NOT NULL,
	`confidence` decimal(5,4) NOT NULL,
	`regulatoryRisk` decimal(5,2) DEFAULT '0',
	`technologyRisk` decimal(5,2) DEFAULT '0',
	`feedstockRisk` decimal(5,2) DEFAULT '0',
	`counterpartyRisk` decimal(5,2) DEFAULT '0',
	`marketRisk` decimal(5,2) DEFAULT '0',
	`esgConcerns` decimal(5,2) DEFAULT '0',
	`lender` varchar(100),
	`keywords` json,
	`rawData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sentiment_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `doc_source_id_idx` UNIQUE(`sourceId`)
);
--> statement-breakpoint
CREATE TABLE `technical_indicators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`commodity` varchar(50) NOT NULL,
	`region` varchar(20) NOT NULL DEFAULT 'AUS',
	`indicatorName` varchar(50) NOT NULL,
	`value` decimal(12,4) NOT NULL,
	`signal` enum('buy','sell','neutral') NOT NULL,
	`calculatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `technical_indicators_id` PRIMARY KEY(`id`),
	CONSTRAINT `tech_commodity_region_indicator_idx` UNIQUE(`commodity`,`region`,`indicatorName`)
);
--> statement-breakpoint
CREATE INDEX `price_commodity_idx` ON `feedstock_prices` (`commodity`);--> statement-breakpoint
CREATE INDEX `price_region_idx` ON `feedstock_prices` (`region`);--> statement-breakpoint
CREATE INDEX `price_date_idx` ON `feedstock_prices` (`date`);--> statement-breakpoint
CREATE INDEX `lender_idx` ON `lender_sentiment_scores` (`lender`);--> statement-breakpoint
CREATE INDEX `lender_score_date_idx` ON `lender_sentiment_scores` (`date`);--> statement-breakpoint
CREATE INDEX `mandate_level_idx` ON `mandate_scenarios` (`mandateLevel`);--> statement-breakpoint
CREATE INDEX `consultation_closes_idx` ON `policy_consultations` (`closes`);--> statement-breakpoint
CREATE INDEX `kanban_status_idx` ON `policy_kanban_items` (`status`);--> statement-breakpoint
CREATE INDEX `kanban_jurisdiction_idx` ON `policy_kanban_items` (`jurisdiction`);--> statement-breakpoint
CREATE INDEX `policy_date_idx` ON `policy_timeline_events` (`date`);--> statement-breakpoint
CREATE INDEX `policy_jurisdiction_idx` ON `policy_timeline_events` (`jurisdiction`);--> statement-breakpoint
CREATE INDEX `doc_source_idx` ON `sentiment_documents` (`source`);--> statement-breakpoint
CREATE INDEX `doc_sentiment_idx` ON `sentiment_documents` (`sentiment`);--> statement-breakpoint
CREATE INDEX `doc_published_idx` ON `sentiment_documents` (`publishedDate`);--> statement-breakpoint
CREATE INDEX `doc_lender_idx` ON `sentiment_documents` (`lender`);