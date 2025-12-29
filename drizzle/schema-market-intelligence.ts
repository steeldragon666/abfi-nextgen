// ============================================================================
// MARKET INTELLIGENCE MAP - GROWING INTENTIONS
// ============================================================================

import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  date,
  varchar,
  decimal,
  json,
  boolean,
  index,
  float,
} from "drizzle-orm/mysql-core";
import { users, suppliers, properties, feedstocks, buyers, projects, demandSignals } from "./schema";

/**
 * Growing Intentions
 * Grower signals of future feedstock production (forward supply)
 */
export const growingIntentions = mysqlTable(
  "growing_intentions",
  {
    id: int("id").autoincrement().primaryKey(),
    intentionId: varchar("intentionId", { length: 50 }).notNull().unique(), // ABFI-GI-YYYY-NNNNN

    supplierId: int("supplierId")
      .notNull()
      .references(() => suppliers.id),
    propertyId: int("propertyId").references(() => properties.id),

    // Feedstock details
    feedstockCategory: mysqlEnum("feedstockCategory", [
      "oilseed",
      "UCO",
      "tallow",
      "lignocellulosic",
      "waste",
      "algae",
      "bamboo",
      "other",
    ]).notNull(),
    feedstockType: varchar("feedstockType", { length: 100 }).notNull(),
    description: text("description"),

    // Volume projections
    projectedVolumeTonnes: int("projectedVolumeTonnes").notNull(),
    volumeConfidencePercent: int("volumeConfidencePercent").default(80),
    minimumVolumeTonnes: int("minimumVolumeTonnes"),

    // Timeline
    plantingDate: date("plantingDate"),
    harvestStartDate: date("harvestStartDate").notNull(),
    harvestEndDate: date("harvestEndDate"),
    availableFromDate: date("availableFromDate").notNull(),
    availableUntilDate: date("availableUntilDate"),

    // Location
    latitude: varchar("latitude", { length: 20 }).notNull(),
    longitude: varchar("longitude", { length: 20 }).notNull(),
    state: mysqlEnum("state", [
      "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT",
    ]).notNull(),
    region: varchar("region", { length: 100 }),

    // Quality expectations
    expectedQualitySpecs: json("expectedQualitySpecs").$type<{
      moisture?: { min?: number; max?: number };
      energyContent?: { min?: number; max?: number };
      ashContent?: { max?: number };
      [key: string]: { min?: number; max?: number } | undefined;
    }>(),
    expectedCarbonIntensity: int("expectedCarbonIntensity"),

    // Pricing
    askingPricePerTonne: int("askingPricePerTonne"),
    priceFlexibility: mysqlEnum("priceFlexibility", [
      "fixed",
      "negotiable",
      "market_rate",
    ]).default("negotiable"),

    // Logistics
    deliveryTerms: mysqlEnum("deliveryTerms", [
      "ex_farm",
      "delivered",
      "fob_port",
      "flexible",
    ]).default("flexible"),
    maxDeliveryDistanceKm: int("maxDeliveryDistanceKm"),
    hasStorageOnSite: boolean("hasStorageOnSite").default(false),
    storageCapacityTonnes: int("storageCapacityTonnes"),

    // Visibility controls
    visibility: mysqlEnum("visibility", [
      "PUBLIC",
      "MARKET_WIDE",
      "ROLE_RESTRICTED",
      "COUNTERPARTY",
      "PRIVATE",
    ]).default("MARKET_WIDE"),
    visibleToRoles: json("visibleToRoles").$type<string[]>().default([]),
    showExactLocation: boolean("showExactLocation").default(false),
    showPricing: boolean("showPricing").default(false),

    // Status
    status: mysqlEnum("intentionStatus", [
      "DRAFT",
      "PUBLISHED",
      "MATCHED",
      "CONTRACTED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ]).default("DRAFT").notNull(),

    // Matching
    matchCount: int("matchCount").default(0),
    lastMatchedAt: timestamp("lastMatchedAt"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    publishedAt: timestamp("publishedAt"),
  },
  (table) => ({
    supplierIdIdx: index("intentions_supplierId_idx").on(table.supplierId),
    statusIdx: index("intentions_status_idx").on(table.status),
    stateIdx: index("intentions_state_idx").on(table.state),
    feedstockIdx: index("intentions_feedstock_idx").on(table.feedstockCategory),
    availableFromIdx: index("intentions_availableFrom_idx").on(table.availableFromDate),
  })
);

export type GrowingIntention = typeof growingIntentions.$inferSelect;
export type InsertGrowingIntention = typeof growingIntentions.$inferInsert;

// ============================================================================
// CONTRACT MATCHING
// ============================================================================

/**
 * Contract Matches
 * System-generated matches between demand signals and supply
 */
export const contractMatches = mysqlTable(
  "contract_matches",
  {
    id: int("id").autoincrement().primaryKey(),
    matchId: varchar("matchId", { length: 50 }).notNull().unique(),

    demandSignalId: int("demandSignalId")
      .notNull()
      .references(() => demandSignals.id),

    projectId: int("projectId").references(() => projects.id),
    intentionId: int("intentionId").references(() => growingIntentions.id),
    feedstockId: int("feedstockId").references(() => feedstocks.id),

    // Match scoring
    matchScore: float("matchScore").notNull(),
    distanceKm: float("distanceKm").notNull(),
    estimatedTransportCost: decimal("estimatedTransportCost", { precision: 10, scale: 2 }),
    volumeMatchPercent: float("volumeMatchPercent").notNull(),
    priceCompatibilityScore: float("priceCompatibilityScore"),
    timingAlignmentScore: float("timingAlignmentScore"),
    qualityMatchScore: float("qualityMatchScore"),

    matchFactors: json("matchFactors").$type<{
      distance: { value: number; weight: number; score: number };
      volume: { value: number; weight: number; score: number };
      price: { value: number; weight: number; score: number };
      timing: { value: number; weight: number; score: number };
      quality: { value: number; weight: number; score: number };
      reliability?: { value: number; weight: number; score: number };
    }>(),

    status: mysqlEnum("matchStatus", [
      "SUGGESTED",
      "VIEWED",
      "NEGOTIATING",
      "ACCEPTED",
      "REJECTED",
      "EXPIRED",
    ]).default("SUGGESTED").notNull(),

    viewedByBuyerAt: timestamp("viewedByBuyerAt"),
    viewedByGrowerAt: timestamp("viewedByGrowerAt"),
    negotiationStartedAt: timestamp("negotiationStartedAt"),

    expiresAt: timestamp("expiresAt").notNull(),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    demandSignalIdIdx: index("matches_demandSignalId_idx").on(table.demandSignalId),
    projectIdIdx: index("matches_projectId_idx").on(table.projectId),
    intentionIdIdx: index("matches_intentionId_idx").on(table.intentionId),
    statusIdx: index("matches_status_idx").on(table.status),
    matchScoreIdx: index("matches_matchScore_idx").on(table.matchScore),
    expiresAtIdx: index("matches_expiresAt_idx").on(table.expiresAt),
  })
);

export type ContractMatch = typeof contractMatches.$inferSelect;
export type InsertContractMatch = typeof contractMatches.$inferInsert;

// ============================================================================
// CONTRACTS
// ============================================================================

/**
 * Contracts
 * Executed agreements between buyers and growers
 */
export const contracts = mysqlTable(
  "contracts",
  {
    id: int("id").autoincrement().primaryKey(),
    contractNumber: varchar("contractNumber", { length: 50 }).notNull().unique(),

    matchId: int("matchId").references(() => contractMatches.id),

    buyerId: int("buyerId")
      .notNull()
      .references(() => buyers.id),
    growerId: int("growerId")
      .notNull()
      .references(() => suppliers.id),

    feedstockTypeId: int("feedstockTypeId").references(() => feedstocks.id),
    feedstockCategory: varchar("feedstockCategory", { length: 100 }).notNull(),
    feedstockType: varchar("feedstockType", { length: 100 }).notNull(),

    volumeTonnes: decimal("volumeTonnes", { precision: 12, scale: 2 }).notNull(),
    pricePerTonne: decimal("pricePerTonne", { precision: 10, scale: 2 }).notNull(),
    totalValue: decimal("totalValue", { precision: 14, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("AUD"),

    deliveryTerms: json("deliveryTerms").$type<{
      incoterm: string;
      pickupLocation?: { lat: number; lng: number; address: string };
      deliveryLocation: { lat: number; lng: number; address: string };
      schedule: Array<{
        date: string;
        volumeTonnes: number;
        status?: string;
      }>;
    }>().notNull(),

    qualitySpecs: json("qualitySpecs").$type<{
      maxMoisture?: number;
      minEnergyContent?: number;
      maxAshContent?: number;
      maxContamination?: number;
      otherSpecs?: Record<string, { min?: number; max?: number }>;
    }>().notNull(),

    paymentTerms: mysqlEnum("paymentTerms", [
      "UPFRONT",
      "ON_DELIVERY",
      "NET_30",
      "MILESTONE",
    ]).notNull(),
    paymentSchedule: json("paymentSchedule").$type<Array<{
      milestoneDescription: string;
      amountPercent: number;
      dueDate?: string;
      paidAt?: string;
    }>>(),

    status: mysqlEnum("contractStatus", [
      "DRAFT",
      "PENDING_GROWER",
      "PENDING_BUYER",
      "ACTIVE",
      "DELIVERING",
      "COMPLETED",
      "DISPUTED",
      "CANCELLED",
    ]).default("DRAFT").notNull(),

    signedByBuyerAt: timestamp("signedByBuyerAt"),
    signedByGrowerAt: timestamp("signedByGrowerAt"),
    buyerSignatureUserId: int("buyerSignatureUserId").references(() => users.id),
    growerSignatureUserId: int("growerSignatureUserId").references(() => users.id),

    contractDocumentUrl: varchar("contractDocumentUrl", { length: 500 }),
    contractDocumentKey: varchar("contractDocumentKey", { length: 500 }),

    effectiveDate: date("effectiveDate"),
    expiryDate: date("expiryDate"),

    totalDelivered: decimal("totalDelivered", { precision: 12, scale: 2 }).default("0"),
    deliveryProgress: float("deliveryProgress").default(0),

    visibility: mysqlEnum("contractVisibility", [
      "COUNTERPARTY",
      "PRIVATE",
    ]).default("COUNTERPARTY"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    buyerIdIdx: index("contracts_buyerId_idx").on(table.buyerId),
    growerIdIdx: index("contracts_growerId_idx").on(table.growerId),
    statusIdx: index("contracts_status_idx").on(table.status),
    matchIdIdx: index("contracts_matchId_idx").on(table.matchId),
  })
);

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// ============================================================================
// DELIVERIES
// ============================================================================

/**
 * Deliveries
 * Individual delivery events under a contract
 */
export const deliveries = mysqlTable(
  "deliveries",
  {
    id: int("id").autoincrement().primaryKey(),
    deliveryId: varchar("deliveryId", { length: 50 }).notNull().unique(),

    contractId: int("contractId")
      .notNull()
      .references(() => contracts.id),

    scheduledDate: timestamp("scheduledDate").notNull(),
    actualDate: timestamp("actualDate"),

    scheduledVolumeTonnes: decimal("scheduledVolumeTonnes", { precision: 10, scale: 2 }).notNull(),
    actualVolumeTonnes: decimal("actualVolumeTonnes", { precision: 10, scale: 2 }),
    volumeVariancePercent: float("volumeVariancePercent"),

    qualityResults: json("qualityResults").$type<{
      moisture?: number;
      energyContent?: number;
      ashContent?: number;
      contamination?: number;
      labReportUrl?: string;
      testedAt?: string;
      testedBy?: string;
      overallPass?: boolean;
      [key: string]: any;
    }>(),
    qualityPassed: boolean("qualityPassed"),

    pickupLocation: json("pickupLocation").$type<{
      lat: number;
      lng: number;
      address: string;
    }>(),
    deliveryLocation: json("deliveryLocation").$type<{
      lat: number;
      lng: number;
      address: string;
    }>().notNull(),

    transportProvider: varchar("transportProvider", { length: 255 }),
    transportMode: mysqlEnum("transportMode", [
      "ROAD",
      "RAIL",
      "ROAD_RAIL",
      "SHIP",
    ]).default("ROAD"),
    transportCost: decimal("transportCost", { precision: 10, scale: 2 }),
    vehicleRegistration: varchar("vehicleRegistration", { length: 50 }),
    driverName: varchar("driverName", { length: 255 }),

    status: mysqlEnum("deliveryStatus", [
      "SCHEDULED",
      "IN_TRANSIT",
      "DELIVERED",
      "QUALITY_VERIFIED",
      "DISPUTED",
      "SETTLED",
    ]).default("SCHEDULED").notNull(),

    proofOfDeliveryUrl: varchar("proofOfDeliveryUrl", { length: 500 }),
    proofOfDeliveryKey: varchar("proofOfDeliveryKey", { length: 500 }),
    receivedByName: varchar("receivedByName", { length: 255 }),
    receivedAt: timestamp("receivedAt"),

    disputeReason: text("disputeReason"),
    disputeResolvedAt: timestamp("disputeResolvedAt"),
    disputeResolution: text("disputeResolution"),

    invoiceAmount: decimal("invoiceAmount", { precision: 10, scale: 2 }),
    invoiceIssuedAt: timestamp("invoiceIssuedAt"),
    paymentReceivedAt: timestamp("paymentReceivedAt"),

    notes: text("notes"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    contractIdIdx: index("deliveries_contractId_idx").on(table.contractId),
    statusIdx: index("deliveries_status_idx").on(table.status),
    scheduledDateIdx: index("deliveries_scheduledDate_idx").on(table.scheduledDate),
  })
);

export type Delivery = typeof deliveries.$inferSelect;
export type InsertDelivery = typeof deliveries.$inferInsert;

// ============================================================================
// PRICE INTELLIGENCE
// ============================================================================

/**
 * Price Signals
 * Market price indicators by region and feedstock type
 */
export const priceSignals = mysqlTable(
  "price_signals",
  {
    id: int("id").autoincrement().primaryKey(),

    feedstockCategory: varchar("feedstockCategory", { length: 100 }).notNull(),
    feedstockType: varchar("feedstockType", { length: 100 }),
    regionId: varchar("regionId", { length: 50 }).notNull(),
    regionName: varchar("regionName", { length: 100 }),

    spotPrice: decimal("spotPrice", { precision: 10, scale: 2 }),
    spotPriceChange: decimal("spotPriceChange", { precision: 10, scale: 2 }),

    forward1M: decimal("forward1M", { precision: 10, scale: 2 }),
    forward3M: decimal("forward3M", { precision: 10, scale: 2 }),
    forward6M: decimal("forward6M", { precision: 10, scale: 2 }),
    forward12M: decimal("forward12M", { precision: 10, scale: 2 }),

    supplyIndex: float("supplyIndex"),
    demandIndex: float("demandIndex"),
    liquidityIndex: float("liquidityIndex"),

    priceRangeLow: decimal("priceRangeLow", { precision: 10, scale: 2 }),
    priceRangeHigh: decimal("priceRangeHigh", { precision: 10, scale: 2 }),

    source: mysqlEnum("priceSource", [
      "CONTRACT_AVERAGE",
      "DEMAND_SIGNAL",
      "GROWER_ASK",
      "EXTERNAL_INDEX",
      "CALCULATED",
    ]).notNull(),
    confidence: mysqlEnum("priceConfidence", [
      "HIGH",
      "MEDIUM",
      "LOW",
      "INDICATIVE",
    ]).notNull(),
    dataPoints: int("dataPoints").default(0),

    validFrom: timestamp("validFrom").notNull(),
    validTo: timestamp("validTo").notNull(),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    feedstockRegionIdx: index("priceSignals_feedstock_region_idx").on(
      table.feedstockCategory,
      table.regionId
    ),
    validFromIdx: index("priceSignals_validFrom_idx").on(table.validFrom),
    sourceIdx: index("priceSignals_source_idx").on(table.source),
  })
);

export type PriceSignal = typeof priceSignals.$inferSelect;
export type InsertPriceSignal = typeof priceSignals.$inferInsert;

/**
 * Price Alerts
 * User-configured price notifications
 */
export const priceAlerts = mysqlTable(
  "price_alerts",
  {
    id: int("id").autoincrement().primaryKey(),

    userId: int("userId")
      .notNull()
      .references(() => users.id),

    feedstockCategory: varchar("feedstockCategory", { length: 100 }).notNull(),
    feedstockType: varchar("feedstockType", { length: 100 }),
    regionId: varchar("regionId", { length: 50 }),

    alertType: mysqlEnum("alertType", [
      "ABOVE_THRESHOLD",
      "BELOW_THRESHOLD",
      "PERCENT_CHANGE_UP",
      "PERCENT_CHANGE_DOWN",
    ]).notNull(),
    thresholdValue: decimal("thresholdValue", { precision: 10, scale: 2 }).notNull(),

    isActive: boolean("isActive").default(true).notNull(),
    lastTriggeredAt: timestamp("lastTriggeredAt"),
    triggerCount: int("triggerCount").default(0),

    notifyEmail: boolean("notifyEmail").default(true),
    notifyInApp: boolean("notifyInApp").default(true),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("priceAlerts_userId_idx").on(table.userId),
    feedstockIdx: index("priceAlerts_feedstock_idx").on(table.feedstockCategory),
    isActiveIdx: index("priceAlerts_isActive_idx").on(table.isActive),
  })
);

export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = typeof priceAlerts.$inferInsert;

// ============================================================================
// TRANSPORT ROUTING
// ============================================================================

/**
 * Transport Routes
 * Cached route calculations between locations
 */
export const transportRoutes = mysqlTable(
  "transport_routes",
  {
    id: int("id").autoincrement().primaryKey(),

    originType: mysqlEnum("originType", [
      "PROJECT",
      "INTENTION",
      "POWER_STATION",
      "LOGISTICS_HUB",
      "CUSTOM",
    ]).notNull(),
    originId: varchar("originId", { length: 100 }),
    originLat: float("originLat").notNull(),
    originLng: float("originLng").notNull(),
    originName: varchar("originName", { length: 255 }),

    destinationType: mysqlEnum("destinationType", [
      "PROJECT",
      "INTENTION",
      "POWER_STATION",
      "LOGISTICS_HUB",
      "CUSTOM",
    ]).notNull(),
    destinationId: varchar("destinationId", { length: 100 }),
    destinationLat: float("destinationLat").notNull(),
    destinationLng: float("destinationLng").notNull(),
    destinationName: varchar("destinationName", { length: 255 }),

    distanceKm: float("distanceKm").notNull(),
    estimatedHours: float("estimatedHours").notNull(),
    routeGeometry: json("routeGeometry").$type<{
      type: "LineString";
      coordinates: [number, number][];
    }>(),

    baseCostPerKm: decimal("baseCostPerKm", { precision: 8, scale: 4 }),
    fuelSurcharge: decimal("fuelSurcharge", { precision: 10, scale: 2 }),
    tollsCost: decimal("tollsCost", { precision: 10, scale: 2 }),
    handlingCost: decimal("handlingCost", { precision: 10, scale: 2 }),
    totalCostPerTonne: decimal("totalCostPerTonne", { precision: 10, scale: 2 }).notNull(),

    transportMode: mysqlEnum("routeTransportMode", [
      "ROAD",
      "RAIL",
      "ROAD_RAIL",
      "SHIP",
    ]).default("ROAD").notNull(),
    feedstockCategory: varchar("feedstockCategory", { length: 100 }),
    volumeTonnes: int("volumeTonnes"),

    viaPoints: json("viaPoints").$type<Array<{
      type: string;
      id?: string;
      lat: number;
      lng: number;
      name: string;
      mode: string;
    }>>(),

    validFrom: timestamp("validFrom").defaultNow().notNull(),
    validTo: timestamp("validTo"),
    lastCalculatedAt: timestamp("lastCalculatedAt").defaultNow().notNull(),
    calculationSource: varchar("calculationSource", { length: 50 }),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    originIdx: index("routes_origin_idx").on(table.originLat, table.originLng),
    destinationIdx: index("routes_destination_idx").on(table.destinationLat, table.destinationLng),
    transportModeIdx: index("routes_transportMode_idx").on(table.transportMode),
    validToIdx: index("routes_validTo_idx").on(table.validTo),
  })
);

export type TransportRoute = typeof transportRoutes.$inferSelect;
export type InsertTransportRoute = typeof transportRoutes.$inferInsert;

// ============================================================================
// LOGISTICS INFRASTRUCTURE
// ============================================================================

/**
 * Logistics Hubs
 * Rail terminals, ports, storage facilities
 */
export const logisticsHubs = mysqlTable(
  "logistics_hubs",
  {
    id: int("id").autoincrement().primaryKey(),
    hubId: varchar("hubId", { length: 50 }).notNull().unique(),

    name: varchar("name", { length: 255 }).notNull(),
    hubType: mysqlEnum("hubType", [
      "RAIL_TERMINAL",
      "PORT",
      "STORAGE_FACILITY",
      "INTERMODAL",
      "GRAIN_HUB",
      "PROCESSING_FACILITY",
    ]).notNull(),

    latitude: float("latitude").notNull(),
    longitude: float("longitude").notNull(),
    address: varchar("address", { length: 500 }),
    state: mysqlEnum("hubState", [
      "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT",
    ]).notNull(),
    region: varchar("region", { length: 100 }),

    hasRailAccess: boolean("hasRailAccess").default(false),
    hasRoadAccess: boolean("hasRoadAccess").default(true),
    hasPortAccess: boolean("hasPortAccess").default(false),
    storageCapacityTonnes: int("storageCapacityTonnes"),
    throughputTonnesPerDay: int("throughputTonnesPerDay"),

    supportedFeedstocks: json("supportedFeedstocks").$type<string[]>(),

    operatorName: varchar("operatorName", { length: 255 }),
    contactEmail: varchar("contactEmail", { length: 320 }),
    contactPhone: varchar("contactPhone", { length: 20 }),
    operatingHours: varchar("operatingHours", { length: 100 }),

    isActive: boolean("isActive").default(true).notNull(),
    verifiedAt: timestamp("verifiedAt"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    locationIdx: index("hubs_location_idx").on(table.latitude, table.longitude),
    hubTypeIdx: index("hubs_hubType_idx").on(table.hubType),
    stateIdx: index("hubs_state_idx").on(table.state),
  })
);

export type LogisticsHub = typeof logisticsHubs.$inferSelect;
export type InsertLogisticsHub = typeof logisticsHubs.$inferInsert;

// ============================================================================
// POWER STATIONS
// ============================================================================

/**
 * Power Stations
 * Bioenergy power stations and facilities
 */
export const powerStations = mysqlTable(
  "power_stations",
  {
    id: int("id").autoincrement().primaryKey(),
    stationId: varchar("stationId", { length: 50 }).notNull().unique(),

    name: varchar("name", { length: 255 }).notNull(),
    operatorName: varchar("operatorName", { length: 255 }),

    latitude: float("latitude").notNull(),
    longitude: float("longitude").notNull(),
    address: varchar("address", { length: 500 }),
    state: mysqlEnum("stationState", [
      "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT",
    ]).notNull(),
    region: varchar("region", { length: 100 }),

    fuelType: mysqlEnum("fuelType", [
      "BIOMASS",
      "BIOGAS",
      "LANDFILL_GAS",
      "WASTE_TO_ENERGY",
      "COFIRING",
    ]).notNull(),
    capacityMW: decimal("capacityMW", { precision: 10, scale: 2 }),
    annualOutputMWh: decimal("annualOutputMWh", { precision: 12, scale: 2 }),

    primaryFeedstock: varchar("primaryFeedstock", { length: 100 }),
    annualFeedstockTonnes: int("annualFeedstockTonnes"),
    maxDeliveryDistanceKm: int("maxDeliveryDistanceKm"),

    linkedBuyerId: int("linkedBuyerId").references(() => buyers.id),

    operationalStatus: mysqlEnum("operationalStatus", [
      "OPERATIONAL",
      "UNDER_CONSTRUCTION",
      "PLANNED",
      "DECOMMISSIONED",
    ]).default("OPERATIONAL").notNull(),

    dataSource: varchar("dataSource", { length: 100 }),
    lastUpdatedFromSource: timestamp("lastUpdatedFromSource"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    locationIdx: index("stations_location_idx").on(table.latitude, table.longitude),
    stateIdx: index("stations_state_idx").on(table.state),
    fuelTypeIdx: index("stations_fuelType_idx").on(table.fuelType),
    operationalStatusIdx: index("stations_operationalStatus_idx").on(table.operationalStatus),
  })
);

export type PowerStation = typeof powerStations.$inferSelect;
export type InsertPowerStation = typeof powerStations.$inferInsert;

// ============================================================================
// NEGOTIATION MESSAGES
// ============================================================================

/**
 * Negotiation Messages
 * Communication thread for contract negotiations
 */
export const negotiationMessages = mysqlTable(
  "negotiation_messages",
  {
    id: int("id").autoincrement().primaryKey(),

    matchId: int("matchId")
      .notNull()
      .references(() => contractMatches.id),

    senderId: int("senderId")
      .notNull()
      .references(() => users.id),
    senderRole: mysqlEnum("senderRole", ["BUYER", "GROWER"]).notNull(),

    messageType: mysqlEnum("messageType", [
      "INITIAL_OFFER",
      "COUNTER_OFFER",
      "QUESTION",
      "RESPONSE",
      "ACCEPTANCE",
      "REJECTION",
      "WITHDRAWAL",
    ]).notNull(),

    message: text("message"),

    offerDetails: json("offerDetails").$type<{
      pricePerTonne?: number;
      volumeTonnes?: number;
      proposedDeliveryDate?: string;
      deliveryTerms?: string;
      qualitySpecs?: Record<string, any>;
      notes?: string;
    }>(),

    readAt: timestamp("readAt"),

    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    matchIdIdx: index("messages_matchId_idx").on(table.matchId),
    senderIdIdx: index("messages_senderId_idx").on(table.senderId),
    createdAtIdx: index("messages_createdAt_idx").on(table.createdAt),
  })
);

export type NegotiationMessage = typeof negotiationMessages.$inferSelect;
export type InsertNegotiationMessage = typeof negotiationMessages.$inferInsert;
