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
import { setCorsHeaders, setSecurityHeaders, logRequest, handleError } from "../_lib/middleware";
import type { User } from "../../drizzle/schema";
import { sdk } from "../../server/_core/sdk";

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
    const createCompatibleContext = async () => {
      let user: User | null = null;
      try {
        user = await sdk.authenticateRequest(request);
      } catch {
        user = null;
      }
      // Server routers expect Express-like req/res but only use user in most cases
      // For Vercel, we provide the Fetch Request and mock the res since it's not used
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
