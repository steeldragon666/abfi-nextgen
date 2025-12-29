/**
 * Visibility Filter Middleware
 * Filters market-sensitive data based on user role and visibility settings
 */

import type { User } from "../../drizzle/schema";
import type { DataVisibility } from "../../drizzle/schema";

// Role hierarchy for visibility checks
const ROLE_HIERARCHY: Record<string, number> = {
  admin: 100,
  auditor: 80,
  buyer: 50,
  supplier: 50, // Growers are suppliers
  user: 10,
};

// Which roles can see which visibility levels
const VISIBILITY_ROLE_ACCESS: Record<string, string[]> = {
  PUBLIC: ["admin", "auditor", "buyer", "supplier", "user"],
  MARKET_WIDE: ["admin", "auditor", "buyer", "supplier"],
  ROLE_RESTRICTED: ["admin", "auditor"], // Plus specific roles in visibleToRoles
  COUNTERPARTY: ["admin"], // Plus direct transaction parties
  PRIVATE: ["admin"], // Plus owner only
};

export interface VisibilityContext {
  userId: string | number;
  userRole: string;
  supplierId?: number;
  buyerId?: number;
}

export interface VisibleEntity {
  visibility?: DataVisibility | string;
  visibleToRoles?: string[];
  userId?: number;
  supplierId?: number;
  buyerId?: number;
  growerId?: number;
}

/**
 * Check if a user can see an entity based on visibility rules
 */
export function canUserSeeEntity(
  entity: VisibleEntity,
  context: VisibilityContext
): boolean {
  const visibility = entity.visibility || "MARKET_WIDE";
  const { userId, userRole, supplierId, buyerId } = context;

  // Admin sees everything
  if (userRole === "admin") {
    return true;
  }

  // Check basic visibility level access
  const allowedRoles = VISIBILITY_ROLE_ACCESS[visibility] || [];
  if (!allowedRoles.includes(userRole)) {
    // Check if user is in visibleToRoles for ROLE_RESTRICTED
    if (visibility === "ROLE_RESTRICTED" && entity.visibleToRoles) {
      if (!entity.visibleToRoles.includes(userRole)) {
        return false;
      }
    } else {
      return false;
    }
  }

  // For COUNTERPARTY visibility, check if user is a party to the transaction
  if (visibility === "COUNTERPARTY") {
    const isOwner = entity.userId === userId;
    const isSupplierParty = supplierId && entity.supplierId === supplierId;
    const isBuyerParty = buyerId && entity.buyerId === buyerId;
    const isGrowerParty = supplierId && entity.growerId === supplierId;

    if (!isOwner && !isSupplierParty && !isBuyerParty && !isGrowerParty) {
      return false;
    }
  }

  // For PRIVATE visibility, only owner can see
  if (visibility === "PRIVATE") {
    const isOwner = entity.userId === userId;
    const isSupplierOwner = supplierId && entity.supplierId === supplierId;
    const isBuyerOwner = buyerId && entity.buyerId === buyerId;

    if (!isOwner && !isSupplierOwner && !isBuyerOwner) {
      return false;
    }
  }

  return true;
}

/**
 * Filter an array of entities based on visibility rules
 */
export function applyVisibilityFilter<T extends VisibleEntity>(
  data: T[],
  context: VisibilityContext
): T[] {
  return data.filter((entity) => canUserSeeEntity(entity, context));
}

/**
 * Redact sensitive fields from an entity based on role
 */
export function redactSensitiveFields<T extends Record<string, any>>(
  entity: T,
  userRole: string,
  isOwner: boolean = false
): T {
  // Admin sees everything
  if (userRole === "admin" || isOwner) {
    return entity;
  }

  const redacted = { ...entity };

  // Fields to redact for non-owners
  const sensitiveFields = [
    "breakEvenPricePerTonne",
    "minimumAcceptablePricePerTonne",
    "targetMarginDollars",
    "targetMarginPercent",
    "premiumLowCarbonCert",
    "premiumLongTermCommitment",
    "premiumExclusivity",
  ];

  for (const field of sensitiveFields) {
    if (field in redacted) {
      delete redacted[field];
    }
  }

  return redacted;
}

/**
 * Apply role-based data transformation for grower view
 * Growers see other growers' projects but with limited detail
 */
export function transformForGrowerView<T extends Record<string, any>>(
  entity: T,
  isOwnEntity: boolean
): Partial<T> {
  if (isOwnEntity) {
    return entity;
  }

  // Growers see limited info about other growers
  const allowedFields = [
    "id",
    "state",
    "region",
    "feedstockCategory",
    "feedstockType",
    "status",
    "latitude", // Only if showExactLocation is true
    "longitude",
    "availableFromDate",
    "harvestStartDate",
  ];

  const transformed: Partial<T> = {};
  for (const field of allowedFields) {
    if (field in entity) {
      transformed[field as keyof T] = entity[field];
    }
  }

  return transformed;
}

/**
 * Apply role-based data transformation for buyer view
 * Buyers see grower projects with more detail than other growers
 */
export function transformForBuyerView<T extends Record<string, any>>(
  entity: T,
  showPricing: boolean = false
): Partial<T> {
  const allowedFields = [
    "id",
    "intentionId",
    "state",
    "region",
    "feedstockCategory",
    "feedstockType",
    "projectedVolumeTonnes",
    "minimumVolumeTonnes",
    "availableFromDate",
    "availableUntilDate",
    "harvestStartDate",
    "harvestEndDate",
    "expectedQualitySpecs",
    "expectedCarbonIntensity",
    "deliveryTerms",
    "maxDeliveryDistanceKm",
    "hasStorageOnSite",
    "storageCapacityTonnes",
    "status",
    "latitude",
    "longitude",
  ];

  if (showPricing) {
    allowedFields.push("askingPricePerTonne", "priceFlexibility");
  }

  const transformed: Partial<T> = {};
  for (const field of allowedFields) {
    if (field in entity) {
      transformed[field as keyof T] = entity[field];
    }
  }

  return transformed;
}

/**
 * Apply role-based data transformation for lender view
 * Lenders see aggregated/anonymized data unless they're financing the project
 */
export function transformForLenderView<T extends Record<string, any>>(
  entity: T,
  isFinancingProject: boolean
): Partial<T> {
  if (isFinancingProject) {
    // Full detail for projects they're financing
    return entity;
  }

  // Aggregated view for other projects
  const allowedFields = [
    "id",
    "state",
    "region",
    "feedstockCategory",
    "status",
    "abfiScore",
    "reliabilityScore",
  ];

  const transformed: Partial<T> = {};
  for (const field of allowedFields) {
    if (field in entity) {
      transformed[field as keyof T] = entity[field];
    }
  }

  return transformed;
}

/**
 * Aggregate data by region for anonymized market views
 */
export function aggregateByRegion<T extends { region?: string; state?: string }>(
  data: T[],
  aggregationFields: (keyof T)[]
): Record<string, Record<string, number>> {
  const aggregated: Record<string, Record<string, number>> = {};

  for (const entity of data) {
    const key = entity.region || entity.state || "Unknown";
    if (!aggregated[key]) {
      aggregated[key] = { count: 0 };
    }
    aggregated[key].count++;

    for (const field of aggregationFields) {
      const value = entity[field];
      if (typeof value === "number") {
        aggregated[key][field as string] = (aggregated[key][field as string] || 0) + value;
      }
    }
  }

  return aggregated;
}

/**
 * Create visibility context from user data
 */
export function createVisibilityContext(
  user: User | null,
  supplierId?: number,
  buyerId?: number
): VisibilityContext {
  return {
    userId: user?.id || 0,
    userRole: user?.role || "user",
    supplierId,
    buyerId,
  };
}

export type { DataVisibility };
