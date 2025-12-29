/**
 * Unified Map Router
 * Central router for the Market Intelligence Map dashboard
 * Aggregates data from all sources with role-based visibility
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import * as db from "./db";
import {
  applyVisibilityFilter,
  createVisibilityContext,
  transformForBuyerView,
  transformForGrowerView,
  transformForLenderView,
  aggregateByRegion,
  canUserSeeEntity,
} from "./middleware/visibilityFilter";

// Types for map entities
interface MapViewport {
  center: { lat: number; lng: number };
  zoom: number;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface MapFilters {
  feedstockCategories?: string[];
  states?: string[];
  minAbfiScore?: number;
  maxCarbonIntensity?: number;
  dateRange?: { start: string; end: string };
  status?: string[];
}

// Role definitions for map access
const MAP_ROLES = ["GROWER", "BUYER", "SUPPLIER", "LENDER", "ADMIN"] as const;
type MapRole = (typeof MAP_ROLES)[number];

// Map role from user role
function getMapRole(userRole: string): MapRole {
  switch (userRole) {
    case "admin":
      return "ADMIN";
    case "buyer":
      return "BUYER";
    case "supplier":
      return "GROWER"; // Growers are suppliers
    case "auditor":
      return "LENDER"; // Auditors see lender view
    default:
      return "BUYER"; // Default to buyer view for authenticated users
  }
}

// Haversine distance
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Check if point is in viewport bounds
function isInBounds(
  lat: number,
  lng: number,
  bounds: { north: number; south: number; east: number; west: number }
): boolean {
  return lat <= bounds.north && lat >= bounds.south && lng <= bounds.east && lng >= bounds.west;
}

export const unifiedMapRouter = router({
  /**
   * Get all map data for current viewport and user role
   * This is the main endpoint that powers the map
   */
  getMapData: protectedProcedure
    .input(
      z.object({
        viewport: z.object({
          center: z.object({ lat: z.number(), lng: z.number() }),
          zoom: z.number(),
          bounds: z
            .object({
              north: z.number(),
              south: z.number(),
              east: z.number(),
              west: z.number(),
            })
            .optional(),
        }),
        filters: z
          .object({
            feedstockCategories: z.array(z.string()).optional(),
            states: z.array(z.string()).optional(),
            minAbfiScore: z.number().optional(),
            maxCarbonIntensity: z.number().optional(),
            status: z.array(z.string()).optional(),
          })
          .optional(),
        layers: z.array(z.string()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { viewport, filters, layers } = input;
      const mapRole = getMapRole(ctx.user.role);

      // Get user's supplier/buyer IDs for visibility filtering
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      const buyer = await db.getBuyerByUserId(ctx.user.id);

      const visibilityContext = createVisibilityContext(ctx.user, supplier?.id, buyer?.id);

      // Prepare response object
      const mapData: {
        projects: any[];
        intentions: any[];
        demandSignals: any[];
        feedstocks: any[];
        powerStations: any[];
        logisticsHubs: any[];
        contracts: any[];
        priceSignals: any[];
      } = {
        projects: [],
        intentions: [],
        demandSignals: [],
        feedstocks: [],
        powerStations: [],
        logisticsHubs: [],
        contracts: [],
        priceSignals: [],
      };

      // Load data based on enabled layers
      const enabledLayers = layers || [
        "PROJECTS",
        "INTENTIONS",
        "DEMAND_SIGNALS",
        "POWER_STATIONS",
        "LOGISTICS",
      ];

      // === PROJECTS ===
      if (enabledLayers.includes("PROJECTS")) {
        // Note: Would query projects with filters
        // const projects = await db.getProjectsInBounds(viewport.bounds, filters);

        // Apply role-based transformation
        // mapData.projects = projects.map(p => {
        //   if (mapRole === "ADMIN") return p;
        //   if (mapRole === "LENDER") return transformForLenderView(p, false);
        //   if (mapRole === "GROWER" && p.userId === ctx.user.id) return p;
        //   if (mapRole === "GROWER") return transformForGrowerView(p, false);
        //   return transformForBuyerView(p);
        // });
      }

      // === GROWING INTENTIONS ===
      if (enabledLayers.includes("INTENTIONS")) {
        // Note: Would query growing_intentions with visibility filtering
        // const intentions = await db.getGrowingIntentionsInBounds(viewport.bounds, filters);
        // mapData.intentions = applyVisibilityFilter(intentions, visibilityContext);
      }

      // === DEMAND SIGNALS ===
      if (enabledLayers.includes("DEMAND_SIGNALS")) {
        // Query demand signals
        const demandSignals = await db.searchDemandSignals({
          status: "published",
          limit: 100,
        });

        // Transform based on role
        mapData.demandSignals = demandSignals.map((ds: any) => {
          const isOwn = buyer?.id === ds.buyerId;

          if (mapRole === "ADMIN" || isOwn) {
            return ds;
          }

          // For other roles, hide exact prices unless showPriceRange is true
          const transformed: any = {
            id: ds.id,
            signalNumber: ds.signalNumber,
            title: ds.title,
            feedstockType: ds.feedstockType,
            feedstockCategory: ds.feedstockCategory,
            annualVolume: ds.annualVolume,
            deliveryState: ds.deliveryState,
            deliveryLatitude: ds.deliveryLatitude,
            deliveryLongitude: ds.deliveryLongitude,
            supplyStartDate: ds.supplyStartDate,
            responseDeadline: ds.responseDeadline,
            status: ds.status,
          };

          // Show price range if enabled
          if (ds.showPriceRange !== false) {
            transformed.indicativePriceMin = ds.indicativePriceMin;
            transformed.indicativePriceMax = ds.indicativePriceMax;
          }

          return transformed;
        });
      }

      // === FEEDSTOCKS ===
      if (enabledLayers.includes("FEEDSTOCKS")) {
        const feedstocks = await db.searchFeedstocks({
          category: filters?.feedstockCategories,
          state: filters?.states,
          minAbfiScore: filters?.minAbfiScore,
          status: "active",
          limit: 200,
        });

        // Filter by bounds if provided
        if (viewport.bounds) {
          mapData.feedstocks = feedstocks.filter((f: any) =>
            isInBounds(parseFloat(f.latitude), parseFloat(f.longitude), viewport.bounds!)
          );
        } else {
          mapData.feedstocks = feedstocks;
        }

        // Apply role-based transformation
        mapData.feedstocks = mapData.feedstocks.map((f: any) => {
          const isOwn = supplier?.id === f.supplierId;
          if (mapRole === "ADMIN" || isOwn) return f;

          // Hide sensitive pricing for non-owners
          const { pricePerTonne, ...publicData } = f;
          if (f.priceVisibility === "public") {
            return f;
          }
          return publicData;
        });
      }

      // === POWER STATIONS ===
      if (enabledLayers.includes("POWER_STATIONS")) {
        // Note: Would query power_stations table
        // const stations = await db.getPowerStationsInBounds(viewport.bounds);
        // mapData.powerStations = stations;
      }

      // === LOGISTICS HUBS ===
      if (enabledLayers.includes("LOGISTICS")) {
        // Note: Would query logistics_hubs table
        // const hubs = await db.getLogisticsHubsInBounds(viewport.bounds);
        // mapData.logisticsHubs = hubs;
      }

      // === CONTRACTS (Lender/Admin only) ===
      if (enabledLayers.includes("CONTRACTS") && (mapRole === "LENDER" || mapRole === "ADMIN")) {
        // Note: Would query contracts with appropriate visibility
        // const contracts = await db.getActiveContracts();
        // mapData.contracts = contracts;
      }

      // === PRICE SIGNALS ===
      if (enabledLayers.includes("PRICE_HEATMAP")) {
        // Note: Would query price_signals for heatmap
        // const prices = await db.getLatestPriceSignals({ regionIds: filters?.states });
        // mapData.priceSignals = prices;
      }

      return {
        ...mapData,
        viewport,
        userRole: mapRole,
        loadedAt: new Date(),
      };
    }),

  /**
   * Get market intelligence summary for the bottom bar
   */
  getMarketIntelligence: protectedProcedure
    .input(
      z.object({
        feedstockCategory: z.string().optional(),
        state: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Aggregate market metrics
      // Note: Would aggregate from various tables

      return {
        totalActiveListings: 0,
        totalActiveDemandSignals: 0,
        totalProjectedSupply: 0, // tonnes
        totalDemand: 0, // tonnes
        supplyDemandRatio: 0,
        avgSpotPrice: 0,
        priceChangePercent: 0,
        topFeedstockByVolume: "",
        topRegionByActivity: "",
        recentMatchCount: 0, // Last 7 days
        recentContractCount: 0, // Last 7 days
        marketHealthScore: 0, // 0-100
        lastUpdated: new Date(),
      };
    }),

  /**
   * Get entity details for the detail panel
   */
  getEntityDetails: protectedProcedure
    .input(
      z.object({
        entityType: z.enum([
          "project",
          "intention",
          "demandSignal",
          "feedstock",
          "powerStation",
          "logisticsHub",
          "contract",
        ]),
        entityId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { entityType, entityId } = input;
      const mapRole = getMapRole(ctx.user.role);

      // Get user's supplier/buyer IDs
      const supplier = await db.getSupplierByUserId(ctx.user.id);
      const buyer = await db.getBuyerByUserId(ctx.user.id);
      const visibilityContext = createVisibilityContext(ctx.user, supplier?.id, buyer?.id);

      let entity: any = null;
      let canView = false;

      switch (entityType) {
        case "feedstock":
          entity = await db.getFeedstockById(entityId);
          if (entity) {
            canView =
              mapRole === "ADMIN" ||
              entity.supplierId === supplier?.id ||
              entity.status === "active";
          }
          break;

        case "demandSignal":
          entity = await db.getDemandSignalById(entityId);
          if (entity) {
            canView =
              mapRole === "ADMIN" ||
              entity.buyerId === buyer?.id ||
              entity.status === "published";
          }
          break;

        // Note: Other entity types would be handled similarly
        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Unknown entity type",
          });
      }

      if (!entity) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Entity not found" });
      }

      if (!canView) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not authorized to view this entity" });
      }

      // Check if user can take actions
      const canAction = {
        canContact: mapRole === "BUYER" || mapRole === "ADMIN",
        canMatch: mapRole === "BUYER" && entityType === "intention",
        canEdit: entity.userId === ctx.user.id || mapRole === "ADMIN",
        canCreateContract:
          mapRole === "ADMIN" ||
          (entityType === "demandSignal" && entity.buyerId === buyer?.id),
      };

      return {
        entityType,
        entity,
        canAction,
        relatedEntities: {
          // Note: Would load related data
          matches: [],
          contracts: [],
          deliveries: [],
        },
      };
    }),

  /**
   * Get nearby entities for a selected point
   */
  getNearbyEntities: protectedProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
        radiusKm: z.number().min(10).max(500).default(100),
        entityTypes: z.array(z.string()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { lat, lng, radiusKm, entityTypes } = input;

      // Note: Would query entities within radius
      // For each entity type, calculate distance and filter

      return {
        center: { lat, lng },
        radiusKm,
        entities: {
          feedstocks: [],
          demandSignals: [],
          powerStations: [],
          logisticsHubs: [],
        },
        summary: {
          totalFeedstocks: 0,
          totalDemandSignals: 0,
          totalPowerStations: 0,
          totalLogisticsHubs: 0,
          totalAvailableVolume: 0,
          totalDemandVolume: 0,
        },
      };
    }),

  /**
   * Get aggregated regional data for choropleth visualization
   */
  getRegionalAggregates: protectedProcedure
    .input(
      z.object({
        aggregateBy: z.enum(["state", "region", "lga"]).default("state"),
        metric: z.enum([
          "feedstock_count",
          "total_volume",
          "avg_price",
          "demand_count",
          "supply_demand_ratio",
        ]),
        feedstockCategory: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { aggregateBy, metric, feedstockCategory } = input;

      // Note: Would aggregate data by region
      // const aggregates = await db.getRegionalAggregates(aggregateBy, metric, feedstockCategory);

      return {
        aggregateBy,
        metric,
        regions: [] as Array<{
          regionId: string;
          regionName: string;
          value: number;
          count: number;
        }>,
        min: 0,
        max: 0,
        total: 0,
      };
    }),

  /**
   * Search for entities across all types
   */
  searchEntities: protectedProcedure
    .input(
      z.object({
        query: z.string().min(2),
        entityTypes: z.array(z.string()).optional(),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, entityTypes, limit } = input;
      const mapRole = getMapRole(ctx.user.role);

      const results: Array<{
        entityType: string;
        entityId: number;
        title: string;
        subtitle: string;
        lat: number;
        lng: number;
      }> = [];

      // Search feedstocks
      if (!entityTypes || entityTypes.includes("feedstock")) {
        const feedstocks = await db.searchFeedstocks({
          status: "active",
          limit,
        });
        // Note: Would filter by query match
      }

      // Search demand signals
      if (!entityTypes || entityTypes.includes("demandSignal")) {
        const signals = await db.searchDemandSignals({
          status: "published",
          limit,
        });
        // Note: Would filter by query match
      }

      // Note: Other entity types would be searched similarly

      return {
        query,
        results: results.slice(0, limit),
        total: results.length,
      };
    }),

  /**
   * Get user's saved map views/analyses
   */
  getSavedViews: protectedProcedure.query(async ({ ctx }) => {
    // Note: Would query saved_analyses for user
    // const savedViews = await db.getSavedAnalysesForUser(ctx.user.id);

    return {
      savedViews: [],
      total: 0,
    };
  }),

  /**
   * Save a map view/analysis
   */
  saveView: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        viewport: z.object({
          center: z.object({ lat: z.number(), lng: z.number() }),
          zoom: z.number(),
        }),
        filters: z.record(z.any()).optional(),
        enabledLayers: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Note: Would create saved_analyses record
      // const saved = await db.createSavedAnalysis({
      //   userId: ctx.user.id,
      //   ...input,
      // });

      return {
        savedId: 0,
        message: "View saved successfully",
      };
    }),

  /**
   * Subscribe to real-time market changes
   * Uses Server-Sent Events for live updates
   */
  subscribeToMarketChanges: protectedProcedure
    .input(
      z.object({
        viewport: z.object({
          center: z.object({ lat: z.number(), lng: z.number() }),
          zoom: z.number(),
          bounds: z
            .object({
              north: z.number(),
              south: z.number(),
              east: z.number(),
              west: z.number(),
            })
            .optional(),
        }),
        feedstockCategories: z.array(z.string()).optional(),
        states: z.array(z.string()).optional(),
      })
    )
    .subscription(({ ctx, input }) => {
      return observable<{
        type: string;
        entityType: string;
        entityId: number;
        data: any;
        timestamp: Date;
      }>((emit) => {
        // Note: Would set up Redis pub/sub listener
        // const subscription = redis.subscribe('market-changes', (message) => {
        //   const change = JSON.parse(message);
        //   // Filter by viewport and user role
        //   if (isRelevantChange(change, input, ctx.user)) {
        //     emit.next(change);
        //   }
        // });

        // Cleanup on unsubscribe
        return () => {
          // subscription.unsubscribe();
        };
      });
    }),

  /**
   * Get quick stats for map header
   */
  getQuickStats: protectedProcedure.query(async ({ ctx }) => {
    const mapRole = getMapRole(ctx.user.role);
    const supplier = await db.getSupplierByUserId(ctx.user.id);
    const buyer = await db.getBuyerByUserId(ctx.user.id);

    const stats: Record<string, number | string> = {};

    if (mapRole === "GROWER" && supplier) {
      // Grower-specific stats
      stats.myListings = 0; // Count of active feedstocks
      stats.incomingMatches = 0; // Count of matches on their supply
      stats.activeContracts = 0;
      stats.pendingDeliveries = 0;
    }

    if (mapRole === "BUYER" && buyer) {
      // Buyer-specific stats
      stats.myDemandSignals = 0;
      stats.potentialMatches = 0;
      stats.activeContracts = 0;
      stats.pendingDeliveries = 0;
    }

    if (mapRole === "LENDER") {
      // Lender-specific stats
      stats.monitoredProjects = 0;
      stats.totalExposure = 0;
      stats.riskAlerts = 0;
    }

    if (mapRole === "ADMIN") {
      // Admin sees everything
      stats.totalUsers = 0;
      stats.totalFeedstocks = 0;
      stats.totalDemandSignals = 0;
      stats.activeContracts = 0;
      stats.pendingVerifications = 0;
    }

    return {
      role: mapRole,
      stats,
      updatedAt: new Date(),
    };
  }),
});

export type UnifiedMapRouter = typeof unifiedMapRouter;
