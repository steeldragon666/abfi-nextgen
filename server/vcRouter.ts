import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "./_core/trpc";
import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import crypto from "crypto";
import {
  didRegistry,
  verifiableCredentials,
} from "../drizzle/schema";
import { getSigningService } from "./services/signing";
import { getIPFSService } from "./services/ipfs";

// ============================================================================
// VERIFIABLE CREDENTIALS ROUTER - ABFI v3.1 Phase 5
// DID registry, W3C VC issuance, verification
// ============================================================================

async function getDb() {
  if (!process.env.DATABASE_URL) return null;
  return drizzle(process.env.DATABASE_URL);
}

// DID methods (matching schema enum)
const didMethods = ["did:web", "did:ethr", "did:key"] as const;

// Controller types (matching schema enum)
const controllerTypes = ["organization", "user", "system"] as const;

// Credential types (matching schema enum)
const credentialTypes = [
  "GQTierCredential",
  "SupplyAgreementCredential",
  "EmissionsCertificate",
  "SustainabilityCertificate",
  "DeliveryConfirmation",
  "QualityAttestation",
  "AuditReport",
] as const;

// VC status (matching schema enum)
const vcStatuses = ["active", "revoked", "expired", "suspended"] as const;

// ============================================================================
// VC ROUTER
// ============================================================================

export const vcRouter = router({
  // --------------------------------------------------------------------------
  // DID REGISTRY
  // --------------------------------------------------------------------------

  createDid: protectedProcedure
    .input(
      z.object({
        controllerType: z.enum(controllerTypes),
        controllerId: z.number(),
        method: z.enum(didMethods).default("did:web"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      // Check if DID already exists
      const existing = await db
        .select()
        .from(didRegistry)
        .where(
          and(
            eq(didRegistry.controllerType, input.controllerType),
            eq(didRegistry.controllerId, input.controllerId),
            eq(didRegistry.status, "active")
          )
        )
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Active DID already exists" });
      }

      // Generate DID
      const random = crypto.randomBytes(8).toString("hex");
      const did = `did:web:abfi.io:${input.controllerType}:${input.controllerId}:${random}`;

      // Generate key pair
      const signingService = getSigningService();
      const keyId = `key-1`;
      const keyPair = await signingService.generateKeyPair(keyId);

      // Create DID document with actual key
      const didDocument = signingService.createDidDocument(did, keyPair);

      const didDocumentUri = `https://abfi.io/.well-known/did/${input.controllerType}/${input.controllerId}`;
      const didDocumentHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(didDocument))
        .digest("hex");

      // Store on IPFS if available
      let storedUri = didDocumentUri;
      const ipfsService = getIPFSService();
      if (ipfsService) {
        const ipfsResult = await ipfsService.uploadJSON(didDocument as Record<string, unknown>);
        if (ipfsResult.success && ipfsResult.cid) {
          storedUri = `ipfs://${ipfsResult.cid}`;
        }
      }

      const [result] = await db.insert(didRegistry).values({
        did,
        didMethod: input.method,
        controllerType: input.controllerType,
        controllerId: input.controllerId,
        didDocumentUri: storedUri,
        didDocumentHash,
        keyAlgorithm: "Ed25519",
        status: "active",
      });

      return {
        id: result.insertId,
        did,
        didDocument,
        publicKeyMultibase: keyPair.publicKeyMultibase,
      };
    }),

  resolveDid: publicProcedure
    .input(z.object({ did: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [record] = await db
        .select()
        .from(didRegistry)
        .where(and(eq(didRegistry.did, input.did), eq(didRegistry.status, "active")))
        .limit(1);

      if (!record) return null;

      return {
        did: record.did,
        method: record.didMethod,
        controllerType: record.controllerType,
        controllerId: record.controllerId,
        didDocumentUri: record.didDocumentUri,
        createdAt: record.createdAt,
      };
    }),

  getEntityDid: protectedProcedure
    .input(
      z.object({
        controllerType: z.enum(controllerTypes),
        controllerId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [record] = await db
        .select()
        .from(didRegistry)
        .where(
          and(
            eq(didRegistry.controllerType, input.controllerType),
            eq(didRegistry.controllerId, input.controllerId),
            eq(didRegistry.status, "active")
          )
        )
        .limit(1);

      return record || null;
    }),

  deactivateDid: protectedProcedure
    .input(z.object({ did: z.string(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      await db
        .update(didRegistry)
        .set({
          status: "deactivated",
          revokedAt: new Date(),
          revocationReason: input.reason || null,
        })
        .where(eq(didRegistry.did, input.did));

      return { success: true, did: input.did };
    }),

  // --------------------------------------------------------------------------
  // VERIFIABLE CREDENTIALS
  // --------------------------------------------------------------------------

  issueCredential: protectedProcedure
    .input(
      z.object({
        credentialType: z.enum(credentialTypes),
        issuerDid: z.string(),
        subjectDid: z.string(),
        claimsSummary: z.record(z.string(), z.any()),
        expirationDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      const credentialId = `urn:uuid:${crypto.randomUUID()}`;
      const issuanceDate = new Date();

      // Build W3C credential (unsigned)
      const unsignedCredential = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://w3id.org/security/suites/ed25519-2020/v1",
        ],
        id: credentialId,
        type: ["VerifiableCredential", input.credentialType],
        issuer: input.issuerDid,
        issuanceDate: issuanceDate.toISOString(),
        expirationDate: input.expirationDate?.toISOString(),
        credentialSubject: {
          id: input.subjectDid,
          ...input.claimsSummary,
        },
      };

      // Sign the credential
      const signingService = getSigningService();
      const verificationMethod = `${input.issuerDid}#key-1`;

      let signedCredential;
      try {
        signedCredential = await signingService.signCredential(
          unsignedCredential,
          "key-1",
          verificationMethod
        );
      } catch (error) {
        // If signing fails (key not found), store unsigned with warning
        console.warn(`[VC] Could not sign credential: ${error}`);
        signedCredential = unsignedCredential;
      }

      const credentialHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(signedCredential))
        .digest("hex");

      // Store credential on IPFS if available
      let credentialUri = `ipfs://pending/${credentialHash}`;
      const ipfsService = getIPFSService();
      if (ipfsService) {
        const ipfsResult = await ipfsService.uploadJSON(signedCredential);
        if (ipfsResult.success && ipfsResult.cid) {
          credentialUri = `ipfs://${ipfsResult.cid}`;
        }
      }

      const [result] = await db.insert(verifiableCredentials).values({
        credentialId,
        credentialType: input.credentialType,
        issuerDid: input.issuerDid,
        subjectDid: input.subjectDid,
        credentialUri,
        credentialHash,
        claimsSummary: input.claimsSummary,
        issuanceDate,
        expirationDate: input.expirationDate || null,
        status: "active",
      });

      return {
        id: result.insertId,
        credentialId,
        credential: signedCredential,
        hash: credentialHash,
        signed: "proof" in signedCredential,
        credentialUri,
      };
    }),

  getCredential: publicProcedure
    .input(z.object({ credentialId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [record] = await db
        .select()
        .from(verifiableCredentials)
        .where(eq(verifiableCredentials.credentialId, input.credentialId))
        .limit(1);

      if (!record) return null;

      return {
        id: record.id,
        credentialId: record.credentialId,
        credentialType: record.credentialType,
        issuerDid: record.issuerDid,
        subjectDid: record.subjectDid,
        credentialUri: record.credentialUri,
        credentialHash: record.credentialHash,
        claimsSummary: record.claimsSummary,
        status: record.status,
        issuanceDate: record.issuanceDate,
        expirationDate: record.expirationDate,
      };
    }),

  verifyCredential: publicProcedure
    .input(z.object({ credentialId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return { valid: false, errors: ["Database not available"], signatureVerified: false };
      }

      const [record] = await db
        .select()
        .from(verifiableCredentials)
        .where(eq(verifiableCredentials.credentialId, input.credentialId))
        .limit(1);

      if (!record) {
        return { valid: false, errors: ["Credential not found"], signatureVerified: false };
      }

      const errors: string[] = [];

      // Check status
      if (record.status === "revoked") {
        errors.push("Credential has been revoked");
      }
      if (record.status === "expired") {
        errors.push("Credential has expired");
      }
      if (record.status === "suspended") {
        errors.push("Credential has been suspended");
      }

      // Check expiration
      if (record.expirationDate && new Date(record.expirationDate) < new Date()) {
        errors.push("Credential has expired");
      }

      // Try to verify cryptographic signature
      let signatureVerified = false;
      const ipfsService = getIPFSService();
      if (ipfsService && record.credentialUri.startsWith("ipfs://")) {
        const cid = record.credentialUri.replace("ipfs://", "");
        const retrieved = await ipfsService.retrieveJSON(cid);

        if (retrieved.success && retrieved.data) {
          const signingService = getSigningService();
          const verificationResult = await signingService.verifyCredential(
            retrieved.data as any
          );

          signatureVerified = verificationResult.verified;
          if (!verificationResult.verified && verificationResult.errors.length > 0) {
            errors.push(...verificationResult.errors.map(e => `Signature: ${e}`));
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        signatureVerified,
        credentialId: record.credentialId,
        credentialType: record.credentialType,
        issuerDid: record.issuerDid,
        subjectDid: record.subjectDid,
        credentialUri: record.credentialUri,
      };
    }),

  listCredentials: protectedProcedure
    .input(
      z.object({
        issuerDid: z.string().optional(),
        subjectDid: z.string().optional(),
        credentialType: z.enum(credentialTypes).optional(),
        status: z.enum(vcStatuses).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { credentials: [], total: 0 };

      const conditions = [];
      if (input.issuerDid) {
        conditions.push(eq(verifiableCredentials.issuerDid, input.issuerDid));
      }
      if (input.subjectDid) {
        conditions.push(eq(verifiableCredentials.subjectDid, input.subjectDid));
      }
      if (input.credentialType) {
        conditions.push(eq(verifiableCredentials.credentialType, input.credentialType));
      }
      if (input.status) {
        conditions.push(eq(verifiableCredentials.status, input.status));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const credentials = await db
        .select()
        .from(verifiableCredentials)
        .where(whereClause)
        .orderBy(desc(verifiableCredentials.issuanceDate))
        .limit(input.limit)
        .offset(input.offset);

      const [countResult] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(verifiableCredentials)
        .where(whereClause);

      return {
        credentials: credentials.map(c => ({
          id: c.id,
          credentialId: c.credentialId,
          credentialType: c.credentialType,
          issuerDid: c.issuerDid,
          subjectDid: c.subjectDid,
          status: c.status,
          issuanceDate: c.issuanceDate,
          expirationDate: c.expirationDate,
        })),
        total: countResult?.count || 0,
      };
    }),

  revokeCredential: protectedProcedure
    .input(z.object({ credentialId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      await db
        .update(verifiableCredentials)
        .set({
          status: "revoked",
          revokedAt: new Date(),
          revocationReason: input.reason || null,
        })
        .where(eq(verifiableCredentials.credentialId, input.credentialId));

      return { success: true, credentialId: input.credentialId };
    }),

  // Stats
  getVCStats: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return { totalDids: 0, activeDids: 0, totalCredentials: 0, activeCredentials: 0 };
    }

    const [didStats] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        active: sql<number>`SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`,
      })
      .from(didRegistry);

    const [vcStats] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        active: sql<number>`SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)`,
      })
      .from(verifiableCredentials);

    return {
      totalDids: didStats?.total || 0,
      activeDids: didStats?.active || 0,
      totalCredentials: vcStats?.total || 0,
      activeCredentials: vcStats?.active || 0,
    };
  }),
});

export type VCRouter = typeof vcRouter;
