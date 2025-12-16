/**
 * Certificate Verification Public API
 *
 * Provides public REST endpoints for verifying ABFI certificates by hash.
 * This is separate from the tRPC endpoint to allow external systems to verify
 * certificates without needing tRPC client setup.
 *
 * Endpoints:
 * - GET /api/verify/:hash - Verify a certificate by its SHA-256 hash
 */

import { Router, Request, Response } from "express";
import * as db from "./db";

const router = Router();

// Rate limiting state (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

/**
 * Simple rate limiting middleware
 */
function rateLimit(req: Request, res: Response, next: () => void) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", RATE_LIMIT_MAX_REQUESTS - 1);
    next();
    return;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", 0);
    res.setHeader("Retry-After", Math.ceil((entry.resetTime - now) / 1000));
    res.status(429).json({
      valid: false,
      error: "rate_limit_exceeded",
      message: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    });
    return;
  }

  entry.count++;
  res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX_REQUESTS);
  res.setHeader("X-RateLimit-Remaining", RATE_LIMIT_MAX_REQUESTS - entry.count);
  next();
}

/**
 * GET /api/verify/:hash
 *
 * Verify a certificate by its SHA-256 hash.
 *
 * Response format:
 * {
 *   valid: boolean,
 *   certificate?: {
 *     snapshotDate: string,
 *     certificateType: string,
 *     entityName: string,
 *     entityType: string,
 *     rating: string,
 *     score: number,
 *     evidenceCount: number,
 *     issuer: {
 *       name: string,
 *       platform: string
 *     },
 *     disclaimers: string[]
 *   },
 *   error?: string,
 *   message?: string
 * }
 */
router.get("/:hash", rateLimit, async (req: Request, res: Response) => {
  const { hash } = req.params;

  // Validate hash format (SHA-256 = 64 hex characters)
  if (!hash || !/^[a-fA-F0-9]{64}$/.test(hash)) {
    res.status(400).json({
      valid: false,
      error: "invalid_hash",
      message:
        "Invalid hash format. Expected 64-character hexadecimal SHA-256 hash.",
    });
    return;
  }

  try {
    // Look up the certificate snapshot by hash
    const snapshot = await db.getCertificateSnapshotByHash(hash.toLowerCase());

    if (!snapshot) {
      res.status(404).json({
        valid: false,
        error: "not_found",
        message: "Certificate hash not found in the registry.",
      });
      return;
    }

    // Get the associated certificate
    const certificate = await db.getCertificateById(snapshot.certificateId);
    if (!certificate) {
      res.status(404).json({
        valid: false,
        error: "certificate_not_found",
        message: "Associated certificate record not found.",
      });
      return;
    }

    // Get feedstock and supplier info for context
    const feedstock = await db.getFeedstockById(certificate.feedstockId);
    const supplier = feedstock
      ? await db.getSupplierById(feedstock.supplierId)
      : null;

    // Parse frozen data
    const frozenData = snapshot.frozenScoreData as {
      abfiScore?: number;
      pillarScores?: Record<string, number>;
      rating?: string;
      calculationDate?: string;
      [key: string]: any;
    };

    const frozenEvidence = snapshot.frozenEvidenceSet as Array<{
      evidenceId: number;
      fileHash: string;
      type: string;
      issuedDate: string;
      issuerName: string;
    }>;

    // Build response
    const response = {
      valid: true,
      certificate: {
        snapshotDate: snapshot.snapshotDate.toISOString(),
        snapshotHash: snapshot.snapshotHash,
        immutable: snapshot.immutable,

        // Certificate details
        certificateType: certificate.type,
        certificateNumber: certificate.certificateNumber,
        status: certificate.status,
        issueDate: certificate.issuedDate?.toISOString(),
        expiryDate: certificate.expiryDate?.toISOString(),

        // Entity information
        entityName: supplier?.companyName || "Unknown",
        entityType: "supplier",
        entityId: supplier?.id,

        // Feedstock information
        feedstockName: feedstock?.sourceName || feedstock?.type || "Unknown",
        feedstockType: feedstock?.type || "Unknown",
        feedstockCategory: feedstock?.category || "Unknown",
        abfiId: feedstock?.abfiId,

        // Frozen scores at snapshot time
        rating: frozenData?.rating || certificate.ratingGrade,
        score: frozenData?.abfiScore,
        pillarScores: frozenData?.pillarScores,
        calculationDate: frozenData?.calculationDate,

        // Evidence chain
        evidenceCount: frozenEvidence?.length || 0,
        evidenceTypes: frozenEvidence
          ? Array.from(new Set(frozenEvidence.map(e => e.type)))
          : [],

        // Issuer information
        issuer: {
          name: "ABFI Platform",
          platform: "Australian Biomass Feedstock Intelligence",
          website: "https://abfi.io",
        },

        // Legal disclaimers
        disclaimers: [
          `ABFI scores represent assessments based on evidence provided as of ${snapshot.snapshotDate.toISOString().split("T")[0]}.`,
          "This certificate does not constitute financial advice or guarantee of supply.",
          "Reliance on this certificate is subject to ABFI Platform Terms of Service.",
        ],
      },
    };

    // Set cache headers (1 hour cache for valid certificates)
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.json(response);
  } catch (error) {
    console.error("[Certificate Verification API] Error:", error);
    res.status(500).json({
      valid: false,
      error: "internal_error",
      message: "An error occurred while verifying the certificate.",
    });
  }
});

/**
 * GET /api/verify/:hash/evidence
 *
 * Get the evidence chain for a verified certificate.
 * Returns the list of evidence items that support the certificate.
 */
router.get("/:hash/evidence", rateLimit, async (req: Request, res: Response) => {
  const { hash } = req.params;

  // Validate hash format
  if (!hash || !/^[a-fA-F0-9]{64}$/.test(hash)) {
    res.status(400).json({
      valid: false,
      error: "invalid_hash",
      message: "Invalid hash format.",
    });
    return;
  }

  try {
    const snapshot = await db.getCertificateSnapshotByHash(hash.toLowerCase());

    if (!snapshot) {
      res.status(404).json({
        valid: false,
        error: "not_found",
        message: "Certificate hash not found.",
      });
      return;
    }

    const frozenEvidence = snapshot.frozenEvidenceSet as Array<{
      evidenceId: number;
      fileHash: string;
      type: string;
      issuedDate: string;
      issuerName: string;
    }>;

    res.json({
      valid: true,
      snapshotHash: snapshot.snapshotHash,
      snapshotDate: snapshot.snapshotDate.toISOString(),
      evidenceCount: frozenEvidence?.length || 0,
      evidence: frozenEvidence || [],
    });
  } catch (error) {
    console.error("[Certificate Verification API] Evidence error:", error);
    res.status(500).json({
      valid: false,
      error: "internal_error",
      message: "An error occurred while fetching evidence chain.",
    });
  }
});

/**
 * GET /api/verify/health
 *
 * Health check endpoint for the verification API.
 */
router.get("/", (_req: Request, res: Response) => {
  res.json({
    service: "ABFI Certificate Verification API",
    version: "1.0.0",
    status: "operational",
    endpoints: {
      verify: "GET /api/verify/:hash",
      evidence: "GET /api/verify/:hash/evidence",
    },
    documentation: "https://docs.abfi.io/api/verification",
  });
});

export const certificateVerificationRouter = router;
