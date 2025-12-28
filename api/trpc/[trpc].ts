/**
 * tRPC API Route Handler - Lightweight Dispatcher
 * Routes to individual router endpoints for optimal code splitting
 *
 * For optimal performance, use direct router endpoints:
 * - /api/trpc/routers/system - System operations
 * - /api/trpc/routers/futures - Futures marketplace
 * - /api/trpc/routers/demandSignals - Demand signals
 * - etc.
 *
 * This catch-all is maintained for backwards compatibility.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { User } from "../../drizzle/schema";
import { sdk } from "../../server/_core/sdk";

// =============================================================================
// Inlined Middleware (to avoid ESM module resolution issues)
// =============================================================================

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:5173",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  process.env.PRODUCTION_URL || "",
].filter(Boolean);

function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin || "";
  const isAllowed = ALLOWED_ORIGINS.some(allowed =>
    origin === allowed || origin.endsWith(".vercel.app")
  );
  if (isAllowed) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") { res.status(200).end(); return true; }
  return false;
}

function setSecurityHeaders(res: VercelResponse): void {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
}

function logRequest(req: VercelRequest, startTime: number): void {
  console.log(`[${req.method || "GET"}] ${req.url || "/"} - ${Date.now() - startTime}ms`);
}

function handleError(res: VercelResponse, error: unknown): void {
  console.error("[API Error]", error);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
  });
}

// Lazy import the full router only when needed (backwards compatibility)
// For new integrations, use the individual router endpoints instead
const getAppRouter = async () => {
  const { appRouter } = await import("../../server/routers");
  return appRouter;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();

  try {
    // Set security headers
    setSecurityHeaders(res);

    // Handle CORS
    if (setCorsHeaders(req, res)) {
      return;
    }

    // Convert Vercel request to standard Request
    const url = new URL(req.url || "/", `https://${req.headers.host}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    // Read body for POST/PUT requests
    let body: string | undefined;
    if (req.method === "POST" || req.method === "PUT") {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const request = new Request(url, {
      method: req.method,
      headers,
      body,
    });

    // Lazy load the full router
    const appRouter = await getAppRouter();

    // Create context compatible with server routers (needs req, res, user)
    // sdk.authenticateRequest expects Express-style req with .get() method
    const cookieHeader = headers.get("cookie") || "";
    const expressLikeReq = {
      get: (name: string) => name === "cookie" ? cookieHeader : headers.get(name),
      headers: { cookie: cookieHeader },
    };

    const createCompatibleContext = async () => {
      let user: User | null = null;
      try {
        user = await sdk.authenticateRequest(expressLikeReq);
      } catch {
        user = null;
      }
      // Server routers expect Express-like req/res but only use user in most cases
      return {
        req: request as any,
        res: res as any,
        user,
      };
    };

    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: createCompatibleContext,
    });

    // Copy response headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send response
    res.status(response.status);
    const text = await response.text();
    res.send(text);
  } catch (error) {
    handleError(res, error);
  } finally {
    logRequest(req, startTime);
  }
}
