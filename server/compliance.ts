/**
 * Compliance & Audit Module (Phase 8)
 * Legal defensibility and regulatory compliance
 */

import { getDb } from "./db.js";
import {
  auditLogs,
  adminOverrides,
  certificateLegalMetadata,
  userConsents,
  disputeResolutions,
  dataRetentionPolicies,
  type InsertAuditLog,
  type InsertAdminOverride,
  type InsertCertificateLegalMetadata,
  type InsertUserConsent,
  type InsertDisputeResolution,
} from "../drizzle/schema.js";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

/**
 * Create audit log entry
 */
export async function createAuditLog(params: {
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(auditLogs).values({
    userId: params.userId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    changes: params.changes || null,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent || null,
  });

  return Number(result[0].insertId);
}

/**
 * Query audit logs with filtering
 */
export async function queryAuditLogs(params: {
  userId?: number;
  entityType?: string;
  entityId?: number;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (params.userId) {
    conditions.push(eq(auditLogs.userId, params.userId));
  }
  if (params.entityType) {
    conditions.push(eq(auditLogs.entityType, params.entityType));
  }
  if (params.entityId) {
    conditions.push(eq(auditLogs.entityId, params.entityId));
  }
  if (params.action) {
    conditions.push(eq(auditLogs.action, params.action));
  }
  if (params.startDate) {
    conditions.push(gte(auditLogs.createdAt, params.startDate));
  }
  if (params.endDate) {
    conditions.push(lte(auditLogs.createdAt, params.endDate));
  }

  let baseQuery = db.select().from(auditLogs);

  if (conditions.length > 0) {
    baseQuery = baseQuery.where(and(...conditions)) as any;
  }

  baseQuery = baseQuery.orderBy(desc(auditLogs.createdAt)) as any;

  if (params.limit) {
    baseQuery = baseQuery.limit(params.limit) as any;
  }

  return await baseQuery;
}

/**
 * Record admin override
 */
export async function recordAdminOverride(params: {
  overrideType:
    | "score"
    | "rating"
    | "status"
    | "expiry"
    | "certification"
    | "evidence_validity";
  entityType: string;
  entityId: number;
  originalValue: any;
  overrideValue: any;
  justification: string;
  riskAssessment?: string;
  requestedBy: number;
  approvedBy?: number;
  expiryDate?: Date;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Create audit log first
  const auditLogId = await createAuditLog({
    userId: params.requestedBy,
    action: "admin_override",
    entityType: params.entityType,
    entityId: params.entityId,
    changes: {
      type: params.overrideType,
      from: params.originalValue,
      to: params.overrideValue,
      justification: params.justification,
    },
  });

  const result = await db.insert(adminOverrides).values({
    overrideType: params.overrideType,
    entityType: params.entityType,
    entityId: params.entityId,
    originalValue: JSON.stringify(params.originalValue),
    overrideValue: JSON.stringify(params.overrideValue),
    justification: params.justification,
    riskAssessment: params.riskAssessment || null,
    requestedBy: params.requestedBy,
    approvedBy: params.approvedBy || null,
    overrideDate: new Date(),
    approvalDate: params.approvedBy ? new Date() : null,
    expiryDate: params.expiryDate || null,
    auditLogId,
  });

  return Number(result[0].insertId);
}

/**
 * Get active overrides for an entity
 */
export async function getActiveOverrides(entityType: string, entityId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(adminOverrides)
    .where(
      and(
        eq(adminOverrides.entityType, entityType),
        eq(adminOverrides.entityId, entityId),
        eq(adminOverrides.revoked, false)
      )
    )
    .orderBy(desc(adminOverrides.overrideDate));
}

/**
 * Revoke admin override
 */
export async function revokeOverride(params: {
  overrideId: number;
  revokedBy: number;
  revocationReason: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(adminOverrides)
    .set({
      revoked: true,
      revokedDate: new Date(),
      revokedBy: params.revokedBy,
      revocationReason: params.revocationReason,
    })
    .where(eq(adminOverrides.id, params.overrideId));

  // Create audit log
  await createAuditLog({
    userId: params.revokedBy,
    action: "revoke_override",
    entityType: "adminOverride",
    entityId: params.overrideId,
    changes: { reason: params.revocationReason },
  });
}

/**
 * Record user consent
 */
export async function recordUserConsent(params: {
  userId: number;
  consentType:
    | "terms_of_service"
    | "privacy_policy"
    | "data_processing"
    | "marketing"
    | "third_party_sharing"
    | "certification_reliance";
  consentVersion: string;
  consentText: string;
  granted: boolean;
  ipAddress?: string;
  userAgent?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(userConsents).values({
    userId: params.userId,
    consentType: params.consentType,
    consentVersion: params.consentVersion,
    consentText: params.consentText,
    granted: params.granted,
    grantedDate: params.granted ? new Date() : null,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent || null,
  });

  return Number(result[0].insertId);
}

/**
 * Get user consents
 */
export async function getUserConsents(userId: number, consentType?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(userConsents.userId, userId)];

  if (consentType) {
    conditions.push(eq(userConsents.consentType, consentType as any));
  }

  return await db
    .select()
    .from(userConsents)
    .where(and(...conditions))
    .orderBy(desc(userConsents.createdAt));
}

/**
 * Withdraw user consent
 */
export async function withdrawConsent(consentId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(userConsents)
    .set({
      withdrawn: true,
      withdrawnDate: new Date(),
    })
    .where(eq(userConsents.id, consentId));
}

/**
 * Create certificate legal metadata
 */
export async function createCertificateLegalMetadata(params: {
  certificateId: number;
  issuerName: string;
  issuerRole: string;
  certificationScope: string;
  createdBy: number;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(certificateLegalMetadata).values({
    certificateId: params.certificateId,
    issuerName: params.issuerName,
    issuerRole: params.issuerRole,
    certificationScope: params.certificationScope,
    limitationStatements: LEGAL_TEMPLATES.limitationStatements,
    disclaimers: LEGAL_TEMPLATES.certificateDisclaimer,
    relianceTerms: LEGAL_TEMPLATES.relianceTerms,
    createdBy: params.createdBy,
  });

  return Number(result[0].insertId);
}

/**
 * Submit dispute
 */
export async function submitDispute(params: {
  disputeType:
    | "score_accuracy"
    | "certificate_validity"
    | "evidence_authenticity"
    | "contract_interpretation"
    | "service_quality"
    | "billing";
  raisedBy: number;
  respondent?: number;
  relatedEntityType?: string;
  relatedEntityId?: number;
  title: string;
  description: string;
  desiredOutcome?: string;
  supportingEvidence?: Array<{
    type: string;
    url: string;
    description: string;
  }>;
  priority?: "low" | "medium" | "high" | "urgent";
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(disputeResolutions).values({
    disputeType: params.disputeType,
    raisedBy: params.raisedBy,
    respondent: params.respondent || null,
    relatedEntityType: params.relatedEntityType || null,
    relatedEntityId: params.relatedEntityId || null,
    title: params.title,
    description: params.description,
    desiredOutcome: params.desiredOutcome || null,
    supportingEvidence: params.supportingEvidence || null,
    priority: params.priority || "medium",
    submittedDate: new Date(),
    targetResolutionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  // Create audit log
  await createAuditLog({
    userId: params.raisedBy,
    action: "submit_dispute",
    entityType: "dispute",
    entityId: Number(result[0].insertId),
    changes: { title: params.title, type: params.disputeType },
  });

  return Number(result[0].insertId);
}

/**
 * Update dispute status
 */
export async function updateDisputeStatus(params: {
  disputeId: number;
  status:
    | "submitted"
    | "under_review"
    | "investigation"
    | "mediation"
    | "arbitration"
    | "resolved"
    | "closed";
  assignedTo?: number;
  resolutionSummary?: string;
  resolutionOutcome?:
    | "upheld"
    | "partially_upheld"
    | "rejected"
    | "withdrawn"
    | "settled";
  remediationActions?: Array<{
    action: string;
    responsible: string;
    deadline: string;
    completed: boolean;
  }>;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updates: any = {
    status: params.status,
    assignedTo: params.assignedTo || null,
  };

  if (params.status === "resolved" || params.status === "closed") {
    updates.resolutionDate = new Date();
    updates.resolutionSummary = params.resolutionSummary || null;
    updates.resolutionOutcome = params.resolutionOutcome || null;
    updates.remediationActions = params.remediationActions || null;
  }

  if (params.status === "under_review" || params.status === "investigation") {
    updates.reviewStartDate = new Date();
  }

  await db
    .update(disputeResolutions)
    .set(updates)
    .where(eq(disputeResolutions.id, params.disputeId));
}

/**
 * Get disputes for a user
 */
export async function getUserDisputes(userId: number, status?: string) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(disputeResolutions.raisedBy, userId)];

  if (status) {
    conditions.push(eq(disputeResolutions.status, status as any));
  }

  return await db
    .select()
    .from(disputeResolutions)
    .where(and(...conditions))
    .orderBy(desc(disputeResolutions.submittedDate));
}

/**
 * Legal text templates
 */
export const LEGAL_TEMPLATES = {
  certificateDisclaimer: `This certificate represents an assessment of feedstock quality and supplier reliability based on available evidence at the time of issuance. ABFI makes no warranty, express or implied, regarding the accuracy, completeness, or fitness for any particular purpose of the information contained herein. Users rely on this certificate at their own risk. ABFI's liability is limited to the fees paid for certification services, and ABFI shall not be liable for any indirect, consequential, or punitive damages arising from the use of this certificate.`,

  limitationStatements: `This certification is based on information provided by the supplier and third-party evidence available at the time of assessment. ABFI has not independently verified all claims and representations. The certificate does not constitute a guarantee of future performance, supply availability, or contract fulfillment. Scores and ratings may change based on new information or changed circumstances. Users should conduct their own due diligence before entering into commercial arrangements.`,

  relianceTerms: `Third parties may rely on this certificate for the purpose of assessing feedstock quality and supplier reliability, subject to the limitations and disclaimers stated herein. Reliance is permitted only for the validity period stated on the certificate. Users must verify that the certificate has not been revoked or superseded before relying on it. ABFI reserves the right to revoke or amend certificates if new information comes to light that materially affects the assessment.`,

  termsOfService: {
    certificationScope: `ABFI certification services assess feedstock quality, supplier reliability, and supply chain bankability based on evidence provided by suppliers and publicly available information. Certification does not constitute legal advice, financial advice, or a guarantee of contract performance. Users are responsible for conducting their own due diligence and making independent commercial decisions.`,

    relianceLimitations: `ABFI certificates are intended to provide decision-support information and should not be the sole basis for commercial decisions. Users should verify information independently and seek professional advice where appropriate. ABFI is not responsible for decisions made by users based on certificate information.`,

    liabilityCaps: `ABFI's total liability for any claim arising from certification services shall not exceed the fees paid by the user for the specific certificate in question, or AUD $10,000, whichever is less. ABFI shall not be liable for indirect, consequential, special, or punitive damages, including loss of profits, business interruption, or reputational harm.`,

    disputeResolution: `Disputes arising from ABFI services shall first be subject to good-faith negotiation between the parties. If negotiation fails, disputes shall be referred to mediation under the Australian Disputes Centre (ADC) rules. If mediation fails, disputes shall be resolved by arbitration under the ACICA Arbitration Rules, with the seat of arbitration in Sydney, Australia. The governing law is the law of New South Wales, Australia.`,

    dataRetention: `ABFI retains user data, evidence, and certification records in accordance with Australian data protection laws and industry best practices. Audit logs are retained for a minimum of 7 years. Evidence supporting certificates is retained for the validity period of the certificate plus 3 years. Users may request data deletion subject to legal and regulatory retention requirements.`,
  },

  lenderReportDisclaimer: `This report is provided for informational purposes only and does not constitute financial advice, investment advice, or a recommendation to lend. Lenders should conduct their own due diligence and credit analysis before making lending decisions. ABFI makes no representation or warranty regarding the accuracy or completeness of the information in this report. Past performance and current scores are not indicative of future results. ABFI's liability is limited as set forth in the ABFI Terms of Service.`,
};

/**
 * Get data retention policy for entity type
 */
export async function getRetentionPolicy(entityType: string) {
  const db = await getDb();
  if (!db) return null;

  const policies = await db
    .select()
    .from(dataRetentionPolicies)
    .where(eq(dataRetentionPolicies.entityType, entityType))
    .limit(1);

  return policies[0] || null;
}

/**
 * Initialize default retention policies
 */
export async function initializeRetentionPolicies() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const policies = [
    {
      entityType: "auditLogs",
      retentionPeriodDays: 2555, // 7 years
      legalBasis: "Regulatory compliance and audit trail requirements",
      regulatoryRequirement: "Australian financial services regulations",
      policyVersion: "1.0",
      effectiveDate: new Date(),
    },
    {
      entityType: "certificates",
      retentionPeriodDays: 1825, // 5 years (validity + 3 years)
      legalBasis: "Certificate validity period plus statutory retention",
      policyVersion: "1.0",
      effectiveDate: new Date(),
    },
    {
      entityType: "evidence",
      retentionPeriodDays: 1825, // 5 years
      legalBasis:
        "Evidence supporting certificates must be retained for certificate validity plus 3 years",
      policyVersion: "1.0",
      effectiveDate: new Date(),
    },
    {
      entityType: "userConsents",
      retentionPeriodDays: 2555, // 7 years
      legalBasis: "Privacy law compliance - consent records must be retained",
      regulatoryRequirement: "Australian Privacy Principles",
      policyVersion: "1.0",
      effectiveDate: new Date(),
    },
    {
      entityType: "disputes",
      retentionPeriodDays: 2555, // 7 years
      legalBasis: "Legal proceedings and dispute resolution records",
      policyVersion: "1.0",
      effectiveDate: new Date(),
    },
  ];

  for (const policy of policies) {
    // Check if policy already exists
    const existing = await getRetentionPolicy(policy.entityType);
    if (!existing) {
      await db.insert(dataRetentionPolicies).values(policy);
    }
  }
}
