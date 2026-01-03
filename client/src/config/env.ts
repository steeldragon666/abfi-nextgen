/**
 * Environment Variable Validation
 *
 * This module validates all VITE_* environment variables at startup.
 * Missing required variables will throw clear errors during build/dev.
 * Optional variables have sensible defaults for development.
 */

import { z } from "zod";

// Helper to check if we're in development mode
const isDev = import.meta.env.DEV;

// Schema for all environment variables
const envSchema = z.object({
  // ===================
  // Authentication
  // ===================

  /** OAuth Portal URL for authentication redirects */
  VITE_OAUTH_PORTAL_URL: z
    .string()
    .url("VITE_OAUTH_PORTAL_URL must be a valid URL")
    .optional()
    .default("http://localhost:5173"),

  /** Application ID for OAuth */
  VITE_APP_ID: z
    .string()
    .min(1, "VITE_APP_ID cannot be empty")
    .optional()
    .default("abfi-platform-dev"),

  // ===================
  // API Endpoints
  // ===================

  /** Intelligence API URL for AI/ML features */
  VITE_INTELLIGENCE_API_URL: z
    .string()
    .url("VITE_INTELLIGENCE_API_URL must be a valid URL")
    .optional()
    .default("http://localhost:3001"),

  /** Stealth Discovery API URL */
  VITE_STEALTH_API_URL: z
    .string()
    .url("VITE_STEALTH_API_URL must be a valid URL")
    .optional()
    .default("http://localhost:3002"),

  // ===================
  // Maps & Geolocation
  // ===================

  /** Frontend Forge API key for map proxy service */
  VITE_FRONTEND_FORGE_API_KEY: z
    .string()
    .min(1, "VITE_FRONTEND_FORGE_API_KEY cannot be empty")
    .optional(),

  /** Frontend Forge API URL for map proxy service */
  VITE_FRONTEND_FORGE_API_URL: z
    .string()
    .url("VITE_FRONTEND_FORGE_API_URL must be a valid URL")
    .optional()
    .default("https://api.frontendforge.dev"),

  /** Google Maps API key (used as fallback if Frontend Forge not configured) */
  VITE_GOOGLE_MAPS_API_KEY: z
    .string()
    .min(1, "VITE_GOOGLE_MAPS_API_KEY cannot be empty")
    .optional(),

  // ===================
  // Monitoring & Analytics
  // ===================

  /** Sentry DSN for error tracking */
  VITE_SENTRY_DSN: z
    .string()
    .url("VITE_SENTRY_DSN must be a valid Sentry DSN URL")
    .optional(),

  /** Application version for release tracking */
  VITE_APP_VERSION: z
    .string()
    .optional()
    .default("0.0.0-dev"),

  // ===================
  // Blockchain
  // ===================

  /** Evidence Vault smart contract address */
  VITE_EVIDENCE_CONTRACT: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "VITE_EVIDENCE_CONTRACT must be a valid Ethereum address")
    .optional(),
});

// Type for the validated environment
export type Env = z.infer<typeof envSchema>;

// Validate environment variables
function validateEnv(): Env {
  const rawEnv = {
    VITE_OAUTH_PORTAL_URL: import.meta.env.VITE_OAUTH_PORTAL_URL,
    VITE_APP_ID: import.meta.env.VITE_APP_ID,
    VITE_INTELLIGENCE_API_URL: import.meta.env.VITE_INTELLIGENCE_API_URL,
    VITE_STEALTH_API_URL: import.meta.env.VITE_STEALTH_API_URL,
    VITE_FRONTEND_FORGE_API_KEY: import.meta.env.VITE_FRONTEND_FORGE_API_KEY,
    VITE_FRONTEND_FORGE_API_URL: import.meta.env.VITE_FRONTEND_FORGE_API_URL,
    VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    VITE_EVIDENCE_CONTRACT: import.meta.env.VITE_EVIDENCE_CONTRACT,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n");

    const message = `\n❌ Environment Variable Validation Failed:\n${errorMessages}\n\nCheck your .env file and ensure all required variables are set.\nSee .env.example for reference.\n`;

    // In development, log warning but continue with defaults
    if (isDev) {
      console.warn(message);
      // Return with defaults applied
      return envSchema.parse({});
    }

    // In production, throw to prevent app from starting with invalid config
    throw new Error(message);
  }

  return result.data;
}

// Validate once at module load
export const env = validateEnv();

// Log configuration status in development
if (isDev) {
  const configured = {
    auth: !!import.meta.env.VITE_OAUTH_PORTAL_URL,
    maps: !!(import.meta.env.VITE_FRONTEND_FORGE_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
    sentry: !!import.meta.env.VITE_SENTRY_DSN,
    intelligence: !!import.meta.env.VITE_INTELLIGENCE_API_URL,
    stealth: !!import.meta.env.VITE_STEALTH_API_URL,
    blockchain: !!import.meta.env.VITE_EVIDENCE_CONTRACT,
  };

  }

// Export individual config sections for easier imports
export const authConfig = {
  portalUrl: env.VITE_OAUTH_PORTAL_URL,
  appId: env.VITE_APP_ID,
} as const;

export const apiConfig = {
  intelligenceUrl: env.VITE_INTELLIGENCE_API_URL,
  stealthUrl: env.VITE_STEALTH_API_URL,
} as const;

export const mapsConfig = {
  frontendForgeApiKey: env.VITE_FRONTEND_FORGE_API_KEY,
  frontendForgeApiUrl: env.VITE_FRONTEND_FORGE_API_URL,
  googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
} as const;

export const monitoringConfig = {
  sentryDsn: env.VITE_SENTRY_DSN,
  appVersion: env.VITE_APP_VERSION,
} as const;

export const blockchainConfig = {
  evidenceContract: env.VITE_EVIDENCE_CONTRACT,
} as const;
