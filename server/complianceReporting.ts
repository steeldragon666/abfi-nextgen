/**
 * Compliance Reporting Module
 * Automated quarterly compliance reports with governance metrics
 */

import { getDb } from "./db.js";
import {
  auditLogs,
  adminOverrides,
  userConsents,
  disputeResolutions,
  certificates,
  feedstocks,
  users,
} from "../drizzle/schema.js";
import { eq, and, gte, lte, sql, count, desc } from "drizzle-orm";

/**
 * Compliance report period
 */
export interface ReportPeriod {
  startDate: Date;
  endDate: Date;
  quarter: number; // 1-4
  year: number;
}

/**
 * Get current quarter
 */
export function getCurrentQuarter(): ReportPeriod {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const quarter = Math.floor(month / 3) + 1;

  const startMonth = (quarter - 1) * 3;
  const startDate = new Date(year, startMonth, 1);
  const endDate = new Date(year, startMonth + 3, 0, 23, 59, 59, 999);

  return { startDate, endDate, quarter, year };
}

/**
 * Get previous quarter
 */
export function getPreviousQuarter(period: ReportPeriod): ReportPeriod {
  let { quarter, year } = period;
  quarter--;
  if (quarter < 1) {
    quarter = 4;
    year--;
  }

  const startMonth = (quarter - 1) * 3;
  const startDate = new Date(year, startMonth, 1);
  const endDate = new Date(year, startMonth + 3, 0, 23, 59, 59, 999);

  return { startDate, endDate, quarter, year };
}

/**
 * Audit activity metrics
 */
export async function getAuditMetrics(period: ReportPeriod) {
  const db = await getDb();
  if (!db) return null;

  // Total audit events
  const totalEvents = await db
    .select({ count: count() })
    .from(auditLogs)
    .where(
      and(
        gte(auditLogs.createdAt, period.startDate),
        lte(auditLogs.createdAt, period.endDate)
      )
    );

  // Events by action type
  const eventsByAction = await db
    .select({
      action: auditLogs.action,
      count: count(),
    })
    .from(auditLogs)
    .where(
      and(
        gte(auditLogs.createdAt, period.startDate),
        lte(auditLogs.createdAt, period.endDate)
      )
    )
    .groupBy(auditLogs.action)
    .orderBy(desc(count()));

  // Events by entity type
  const eventsByEntity = await db
    .select({
      entityType: auditLogs.entityType,
      count: count(),
    })
    .from(auditLogs)
    .where(
      and(
        gte(auditLogs.createdAt, period.startDate),
        lte(auditLogs.createdAt, period.endDate)
      )
    )
    .groupBy(auditLogs.entityType)
    .orderBy(desc(count()));

  // Most active users
  const activeUsers = await db
    .select({
      userId: auditLogs.userId,
      count: count(),
    })
    .from(auditLogs)
    .where(
      and(
        gte(auditLogs.createdAt, period.startDate),
        lte(auditLogs.createdAt, period.endDate)
      )
    )
    .groupBy(auditLogs.userId)
    .orderBy(desc(count()))
    .limit(10);

  return {
    totalEvents: totalEvents[0]?.count || 0,
    eventsByAction,
    eventsByEntity,
    activeUsers,
  };
}

/**
 * Admin override metrics
 */
export async function getOverrideMetrics(period: ReportPeriod) {
  const db = await getDb();
  if (!db) return null;

  // Total overrides
  const totalOverrides = await db
    .select({ count: count() })
    .from(adminOverrides)
    .where(
      and(
        gte(adminOverrides.overrideDate, period.startDate),
        lte(adminOverrides.overrideDate, period.endDate)
      )
    );

  // Overrides by type
  const overridesByType = await db
    .select({
      overrideType: adminOverrides.overrideType,
      count: count(),
    })
    .from(adminOverrides)
    .where(
      and(
        gte(adminOverrides.overrideDate, period.startDate),
        lte(adminOverrides.overrideDate, period.endDate)
      )
    )
    .groupBy(adminOverrides.overrideType)
    .orderBy(desc(count()));

  // Active vs revoked
  const activeOverrides = await db
    .select({ count: count() })
    .from(adminOverrides)
    .where(
      and(
        gte(adminOverrides.overrideDate, period.startDate),
        lte(adminOverrides.overrideDate, period.endDate),
        eq(adminOverrides.revoked, false)
      )
    );

  const revokedOverrides = await db
    .select({ count: count() })
    .from(adminOverrides)
    .where(
      and(
        gte(adminOverrides.overrideDate, period.startDate),
        lte(adminOverrides.overrideDate, period.endDate),
        eq(adminOverrides.revoked, true)
      )
    );

  // Overrides by entity type
  const overridesByEntity = await db
    .select({
      entityType: adminOverrides.entityType,
      count: count(),
    })
    .from(adminOverrides)
    .where(
      and(
        gte(adminOverrides.overrideDate, period.startDate),
        lte(adminOverrides.overrideDate, period.endDate)
      )
    )
    .groupBy(adminOverrides.entityType)
    .orderBy(desc(count()));

  // Most frequent override requesters
  const topRequesters = await db
    .select({
      requestedBy: adminOverrides.requestedBy,
      count: count(),
    })
    .from(adminOverrides)
    .where(
      and(
        gte(adminOverrides.overrideDate, period.startDate),
        lte(adminOverrides.overrideDate, period.endDate)
      )
    )
    .groupBy(adminOverrides.requestedBy)
    .orderBy(desc(count()))
    .limit(10);

  return {
    totalOverrides: totalOverrides[0]?.count || 0,
    activeOverrides: activeOverrides[0]?.count || 0,
    revokedOverrides: revokedOverrides[0]?.count || 0,
    overridesByType,
    overridesByEntity,
    topRequesters,
  };
}

/**
 * Consent management metrics
 */
export async function getConsentMetrics(period: ReportPeriod) {
  const db = await getDb();
  if (!db) return null;

  // Total consents recorded
  const totalConsents = await db
    .select({ count: count() })
    .from(userConsents)
    .where(
      and(
        gte(userConsents.createdAt, period.startDate),
        lte(userConsents.createdAt, period.endDate)
      )
    );

  // Consents by type
  const consentsByType = await db
    .select({
      consentType: userConsents.consentType,
      granted: userConsents.granted,
      count: count(),
    })
    .from(userConsents)
    .where(
      and(
        gte(userConsents.createdAt, period.startDate),
        lte(userConsents.createdAt, period.endDate)
      )
    )
    .groupBy(userConsents.consentType, userConsents.granted);

  // Consent withdrawals
  const withdrawals = await db
    .select({ count: count() })
    .from(userConsents)
    .where(
      and(
        gte(userConsents.withdrawnDate, period.startDate),
        lte(userConsents.withdrawnDate, period.endDate),
        eq(userConsents.withdrawn, true)
      )
    );

  // Withdrawal rate by consent type
  const withdrawalsByType = await db
    .select({
      consentType: userConsents.consentType,
      count: count(),
    })
    .from(userConsents)
    .where(
      and(
        gte(userConsents.withdrawnDate, period.startDate),
        lte(userConsents.withdrawnDate, period.endDate),
        eq(userConsents.withdrawn, true)
      )
    )
    .groupBy(userConsents.consentType)
    .orderBy(desc(count()));

  return {
    totalConsents: totalConsents[0]?.count || 0,
    consentsByType,
    totalWithdrawals: withdrawals[0]?.count || 0,
    withdrawalsByType,
  };
}

/**
 * Dispute resolution metrics
 */
export async function getDisputeMetrics(period: ReportPeriod) {
  const db = await getDb();
  if (!db) return null;

  // Total disputes submitted
  const totalDisputes = await db
    .select({ count: count() })
    .from(disputeResolutions)
    .where(
      and(
        gte(disputeResolutions.submittedDate, period.startDate),
        lte(disputeResolutions.submittedDate, period.endDate)
      )
    );

  // Disputes by type
  const disputesByType = await db
    .select({
      disputeType: disputeResolutions.disputeType,
      count: count(),
    })
    .from(disputeResolutions)
    .where(
      and(
        gte(disputeResolutions.submittedDate, period.startDate),
        lte(disputeResolutions.submittedDate, period.endDate)
      )
    )
    .groupBy(disputeResolutions.disputeType)
    .orderBy(desc(count()));

  // Disputes by status
  const disputesByStatus = await db
    .select({
      status: disputeResolutions.status,
      count: count(),
    })
    .from(disputeResolutions)
    .where(
      and(
        gte(disputeResolutions.submittedDate, period.startDate),
        lte(disputeResolutions.submittedDate, period.endDate)
      )
    )
    .groupBy(disputeResolutions.status)
    .orderBy(desc(count()));

  // Resolved disputes
  const resolvedDisputes = await db
    .select({ count: count() })
    .from(disputeResolutions)
    .where(
      and(
        gte(disputeResolutions.resolutionDate, period.startDate),
        lte(disputeResolutions.resolutionDate, period.endDate),
        eq(disputeResolutions.status, "resolved")
      )
    );

  // Resolution outcomes
  const resolutionOutcomes = await db
    .select({
      outcome: disputeResolutions.resolutionOutcome,
      count: count(),
    })
    .from(disputeResolutions)
    .where(
      and(
        gte(disputeResolutions.resolutionDate, period.startDate),
        lte(disputeResolutions.resolutionDate, period.endDate),
        eq(disputeResolutions.status, "resolved")
      )
    )
    .groupBy(disputeResolutions.resolutionOutcome)
    .orderBy(desc(count()));

  // Average resolution time (days)
  const resolvedWithTimes = await db
    .select({
      submittedDate: disputeResolutions.submittedDate,
      resolutionDate: disputeResolutions.resolutionDate,
    })
    .from(disputeResolutions)
    .where(
      and(
        gte(disputeResolutions.resolutionDate, period.startDate),
        lte(disputeResolutions.resolutionDate, period.endDate),
        eq(disputeResolutions.status, "resolved")
      )
    );

  let avgResolutionDays = 0;
  if (resolvedWithTimes.length > 0) {
    const totalDays = resolvedWithTimes.reduce((sum, dispute) => {
      const days =
        (dispute.resolutionDate!.getTime() - dispute.submittedDate.getTime()) /
        (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    avgResolutionDays = totalDays / resolvedWithTimes.length;
  }

  return {
    totalDisputes: totalDisputes[0]?.count || 0,
    disputesByType,
    disputesByStatus,
    resolvedDisputes: resolvedDisputes[0]?.count || 0,
    resolutionOutcomes,
    avgResolutionDays: Math.round(avgResolutionDays),
  };
}

/**
 * Certificate issuance metrics
 */
export async function getCertificateMetrics(period: ReportPeriod) {
  const db = await getDb();
  if (!db) return null;

  // Total certificates issued
  const totalCertificates = await db
    .select({ count: count() })
    .from(certificates)
    .where(
      and(
        gte(certificates.issuedDate, period.startDate),
        lte(certificates.issuedDate, period.endDate)
      )
    );

  // Certificates by type
  const certificatesByType = await db
    .select({
      type: certificates.type,
      count: count(),
    })
    .from(certificates)
    .where(
      and(
        gte(certificates.issuedDate, period.startDate),
        lte(certificates.issuedDate, period.endDate)
      )
    )
    .groupBy(certificates.type)
    .orderBy(desc(count()));

  // Certificates by status
  const certificatesByStatus = await db
    .select({
      status: certificates.status,
      count: count(),
    })
    .from(certificates)
    .where(
      and(
        gte(certificates.issuedDate, period.startDate),
        lte(certificates.issuedDate, period.endDate)
      )
    )
    .groupBy(certificates.status)
    .orderBy(desc(count()));

  // Expiring soon (next 30 days from period end)
  const expiringSoon = await db
    .select({ count: count() })
    .from(certificates)
    .where(
      and(
        gte(certificates.expiryDate, period.endDate),
        lte(
          certificates.expiryDate,
          new Date(period.endDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        ),
        eq(certificates.status, "active")
      )
    );

  return {
    totalCertificates: totalCertificates[0]?.count || 0,
    certificatesByType,
    certificatesByStatus,
    expiringSoon: expiringSoon[0]?.count || 0,
  };
}

/**
 * Platform activity metrics
 */
export async function getPlatformMetrics(period: ReportPeriod) {
  const db = await getDb();
  if (!db) return null;

  // New users
  const newUsers = await db
    .select({ count: count() })
    .from(users)
    .where(
      and(
        gte(users.createdAt, period.startDate),
        lte(users.createdAt, period.endDate)
      )
    );

  // New feedstocks listed
  const newFeedstocks = await db
    .select({ count: count() })
    .from(feedstocks)
    .where(
      and(
        gte(feedstocks.createdAt, period.startDate),
        lte(feedstocks.createdAt, period.endDate)
      )
    );

  // Active feedstocks
  const activeFeedstocks = await db
    .select({ count: count() })
    .from(feedstocks)
    .where(eq(feedstocks.status, "active"));

  return {
    newUsers: newUsers[0]?.count || 0,
    newFeedstocks: newFeedstocks[0]?.count || 0,
    activeFeedstocks: activeFeedstocks[0]?.count || 0,
  };
}

/**
 * Generate comprehensive compliance report
 */
export interface ComplianceReport {
  period: ReportPeriod;
  generatedAt: Date;
  auditMetrics: Awaited<ReturnType<typeof getAuditMetrics>>;
  overrideMetrics: Awaited<ReturnType<typeof getOverrideMetrics>>;
  consentMetrics: Awaited<ReturnType<typeof getConsentMetrics>>;
  disputeMetrics: Awaited<ReturnType<typeof getDisputeMetrics>>;
  certificateMetrics: Awaited<ReturnType<typeof getCertificateMetrics>>;
  platformMetrics: Awaited<ReturnType<typeof getPlatformMetrics>>;
  summary: {
    overallCompliance: "excellent" | "good" | "fair" | "needs_attention";
    keyFindings: string[];
    recommendations: string[];
  };
}

export async function generateComplianceReport(
  period: ReportPeriod
): Promise<ComplianceReport> {
  const [
    auditMetrics,
    overrideMetrics,
    consentMetrics,
    disputeMetrics,
    certificateMetrics,
    platformMetrics,
  ] = await Promise.all([
    getAuditMetrics(period),
    getOverrideMetrics(period),
    getConsentMetrics(period),
    getDisputeMetrics(period),
    getCertificateMetrics(period),
    getPlatformMetrics(period),
  ]);

  // Calculate overall compliance score
  const keyFindings: string[] = [];
  const recommendations: string[] = [];
  let complianceScore = 100;

  // Audit activity checks
  if (auditMetrics && auditMetrics.totalEvents === 0) {
    keyFindings.push("No audit events recorded - potential logging issue");
    recommendations.push("Verify audit logging is functioning correctly");
    complianceScore -= 20;
  }

  // Override checks
  if (overrideMetrics) {
    const overrideRate =
      (overrideMetrics.totalOverrides / (auditMetrics?.totalEvents || 1)) * 100;
    if (overrideRate > 5) {
      keyFindings.push(
        `High override rate: ${overrideRate.toFixed(1)}% of all actions`
      );
      recommendations.push(
        "Review override justifications and consider process improvements"
      );
      complianceScore -= 10;
    }

    if (overrideMetrics.revokedOverrides > overrideMetrics.totalOverrides * 0.2) {
      keyFindings.push(
        `High revocation rate: ${((overrideMetrics.revokedOverrides / overrideMetrics.totalOverrides) * 100).toFixed(1)}%`
      );
      recommendations.push(
        "Investigate reasons for high override revocation rate"
      );
      complianceScore -= 5;
    }
  }

  // Consent checks
  if (consentMetrics) {
    const withdrawalRate =
      (consentMetrics.totalWithdrawals / (consentMetrics.totalConsents || 1)) *
      100;
    if (withdrawalRate > 10) {
      keyFindings.push(
        `High consent withdrawal rate: ${withdrawalRate.toFixed(1)}%`
      );
      recommendations.push(
        "Review consent language and user communication for clarity"
      );
      complianceScore -= 10;
    }
  }

  // Dispute checks
  if (disputeMetrics) {
    if (disputeMetrics.avgResolutionDays > 45) {
      keyFindings.push(
        `Average dispute resolution time: ${disputeMetrics.avgResolutionDays} days (target: <45 days)`
      );
      recommendations.push(
        "Expedite dispute resolution process to meet target timelines"
      );
      complianceScore -= 10;
    }

    const resolutionRate =
      (disputeMetrics.resolvedDisputes / (disputeMetrics.totalDisputes || 1)) *
      100;
    if (resolutionRate < 70) {
      keyFindings.push(
        `Low dispute resolution rate: ${resolutionRate.toFixed(1)}%`
      );
      recommendations.push("Allocate more resources to dispute resolution");
      complianceScore -= 10;
    }
  }

  // Certificate checks
  if (certificateMetrics && certificateMetrics.expiringSoon > 10) {
    keyFindings.push(
      `${certificateMetrics.expiringSoon} certificates expiring in next 30 days`
    );
    recommendations.push(
      "Proactively contact certificate holders for renewal"
    );
  }

  // Determine overall compliance level
  let overallCompliance: ComplianceReport["summary"]["overallCompliance"];
  if (complianceScore >= 90) {
    overallCompliance = "excellent";
  } else if (complianceScore >= 75) {
    overallCompliance = "good";
  } else if (complianceScore >= 60) {
    overallCompliance = "fair";
  } else {
    overallCompliance = "needs_attention";
  }

  // Add positive findings
  if (overrideMetrics && overrideMetrics.totalOverrides === 0) {
    keyFindings.push("No admin overrides recorded - strong process adherence");
  }
  if (disputeMetrics && disputeMetrics.totalDisputes === 0) {
    keyFindings.push("No disputes submitted - high user satisfaction");
  }

  return {
    period,
    generatedAt: new Date(),
    auditMetrics,
    overrideMetrics,
    consentMetrics,
    disputeMetrics,
    certificateMetrics,
    platformMetrics,
    summary: {
      overallCompliance,
      keyFindings,
      recommendations,
    },
  };
}

/**
 * Format report as text summary
 */
export function formatReportSummary(report: ComplianceReport): string {
  const { period, summary } = report;

  return `
ABFI PLATFORM COMPLIANCE REPORT
Q${period.quarter} ${period.year} (${period.startDate.toLocaleDateString()} - ${period.endDate.toLocaleDateString()})
Generated: ${report.generatedAt.toLocaleString()}

OVERALL COMPLIANCE: ${summary.overallCompliance.toUpperCase()}

KEY FINDINGS:
${summary.keyFindings.map((f, i) => `${i + 1}. ${f}`).join("\n")}

RECOMMENDATIONS:
${summary.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

DETAILED METRICS:

Audit Activity:
- Total Events: ${report.auditMetrics?.totalEvents || 0}
- Top Actions: ${report.auditMetrics?.eventsByAction.slice(0, 3).map((a) => `${a.action} (${a.count})`).join(", ")}

Admin Overrides:
- Total: ${report.overrideMetrics?.totalOverrides || 0}
- Active: ${report.overrideMetrics?.activeOverrides || 0}
- Revoked: ${report.overrideMetrics?.revokedOverrides || 0}

Consent Management:
- Total Consents: ${report.consentMetrics?.totalConsents || 0}
- Withdrawals: ${report.consentMetrics?.totalWithdrawals || 0}

Dispute Resolution:
- Total Disputes: ${report.disputeMetrics?.totalDisputes || 0}
- Resolved: ${report.disputeMetrics?.resolvedDisputes || 0}
- Avg Resolution Time: ${report.disputeMetrics?.avgResolutionDays || 0} days

Certificates:
- Issued: ${report.certificateMetrics?.totalCertificates || 0}
- Expiring Soon: ${report.certificateMetrics?.expiringSoon || 0}

Platform Activity:
- New Users: ${report.platformMetrics?.newUsers || 0}
- New Feedstocks: ${report.platformMetrics?.newFeedstocks || 0}
- Active Feedstocks: ${report.platformMetrics?.activeFeedstocks || 0}
  `.trim();
}
