ALTER TABLE `projects` MODIFY COLUMN `nameplateCapacity` int;--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `status` enum('draft','submitted','planning','development','financing','construction','operational','suspended') NOT NULL DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `projects` ADD `developerName` varchar(255);--> statement-breakpoint
ALTER TABLE `projects` ADD `abn` varchar(11);--> statement-breakpoint
ALTER TABLE `projects` ADD `website` varchar(255);--> statement-breakpoint
ALTER TABLE `projects` ADD `region` varchar(100);--> statement-breakpoint
ALTER TABLE `projects` ADD `siteAddress` varchar(500);--> statement-breakpoint
ALTER TABLE `projects` ADD `developmentStage` enum('concept','prefeasibility','feasibility','fid','construction','operational');--> statement-breakpoint
ALTER TABLE `projects` ADD `conversionTechnology` varchar(100);--> statement-breakpoint
ALTER TABLE `projects` ADD `technologyProvider` varchar(255);--> statement-breakpoint
ALTER TABLE `projects` ADD `primaryOutput` varchar(100);--> statement-breakpoint
ALTER TABLE `projects` ADD `secondaryOutputs` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `outputCapacity` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `outputUnit` varchar(50);--> statement-breakpoint
ALTER TABLE `projects` ADD `secondaryFeedstocks` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `annualFeedstockVolume` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `feedstockQualitySpecs` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `supplyRadius` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `logisticsRequirements` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `totalCapex` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `fundingSecured` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `fundingSources` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `investmentStage` enum('seed','series_a','series_b','pre_fid','post_fid','operational');--> statement-breakpoint
ALTER TABLE `projects` ADD `seekingInvestment` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `projects` ADD `investmentAmount` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `constructionStart` timestamp;--> statement-breakpoint
ALTER TABLE `projects` ADD `environmentalApproval` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `projects` ADD `planningPermit` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `projects` ADD `epaLicense` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `projects` ADD `otherApprovals` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `approvalsNotes` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `verificationStatus` enum('pending','documents_submitted','under_review','verified','rejected') DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `projects` ADD `verificationDocuments` json;--> statement-breakpoint
ALTER TABLE `projects` ADD `verificationNotes` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `feedstockMatchingEnabled` boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE `projects` ADD `financingInterest` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `projects` ADD `partnershipInterest` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `projects` ADD `publicVisibility` enum('private','investors_only','suppliers_only','public') DEFAULT 'private';--> statement-breakpoint
ALTER TABLE `projects` ADD `registrationStep` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `projects` ADD `registrationComplete` boolean DEFAULT false;--> statement-breakpoint
CREATE INDEX `projects_verification_idx` ON `projects` (`verificationStatus`);