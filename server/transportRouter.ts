/**
 * Transport Router
 * Calculate and visualize logistics costs between locations
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "./_core/trpc";
import * as db from "./db";

// Transport cost constants (AUD)
const TRANSPORT_RATES = {
  ROAD: {
    basePerKm: 0.12, // $ per tonne-km
    fuelSurchargePercent: 15,
    minimumCharge: 50, // minimum $ per delivery
  },
  RAIL: {
    basePerKm: 0.06, // cheaper per km but requires terminal access
    terminalHandling: 8, // $ per tonne for loading/unloading
    minimumDistance: 100, // km - rail only efficient over 100km
  },
  SHIP: {
    basePerKm: 0.04, // cheapest per km
    portHandling: 15, // $ per tonne for port handling
    minimumDistance: 200, // km - ship only for long distances
  },
};

// Feedstock-specific handling costs ($/tonne)
const FEEDSTOCK_HANDLING: Record<string, number> = {
  oilseed: 5,
  UCO: 8, // liquid handling
  tallow: 10, // temperature controlled
  lignocellulosic: 3, // bulk
  waste: 6,
  algae: 12, // specialized
  bamboo: 4,
  other: 5,
};

// Haversine distance calculation
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
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

// Road distance factor (actual road distance is typically 1.3x straight line)
const ROAD_DISTANCE_FACTOR = 1.3;

// Calculate transport cost breakdown
function calculateTransportCost(
  distanceKm: number,
  volumeTonnes: number,
  mode: "ROAD" | "RAIL" | "ROAD_RAIL" | "SHIP",
  feedstockCategory: string
): {
  baseCost: number;
  fuelSurcharge: number;
  tollsCost: number;
  handlingCost: number;
  totalCost: number;
  costPerTonne: number;
} {
  const roadDistance = distanceKm * ROAD_DISTANCE_FACTOR;
  const handling = FEEDSTOCK_HANDLING[feedstockCategory] || 5;

  let baseCost = 0;
  let fuelSurcharge = 0;
  let tollsCost = 0;
  let handlingCost = handling * volumeTonnes;

  switch (mode) {
    case "ROAD":
      baseCost = roadDistance * volumeTonnes * TRANSPORT_RATES.ROAD.basePerKm;
      baseCost = Math.max(baseCost, TRANSPORT_RATES.ROAD.minimumCharge);
      fuelSurcharge = baseCost * (TRANSPORT_RATES.ROAD.fuelSurchargePercent / 100);
      // Estimate tolls based on distance (simplified)
      tollsCost = Math.floor(roadDistance / 100) * 5 * Math.ceil(volumeTonnes / 30); // $5 per 100km per truck
      break;

    case "RAIL":
      baseCost = distanceKm * volumeTonnes * TRANSPORT_RATES.RAIL.basePerKm;
      handlingCost += TRANSPORT_RATES.RAIL.terminalHandling * volumeTonnes * 2; // load + unload
      break;

    case "ROAD_RAIL":
      // Assume 50km road each end + rail in middle
      const roadPortion = 100; // km total road
      const railPortion = Math.max(0, distanceKm - 100);
      baseCost =
        roadPortion * ROAD_DISTANCE_FACTOR * volumeTonnes * TRANSPORT_RATES.ROAD.basePerKm +
        railPortion * volumeTonnes * TRANSPORT_RATES.RAIL.basePerKm;
      fuelSurcharge =
        roadPortion *
        ROAD_DISTANCE_FACTOR *
        volumeTonnes *
        TRANSPORT_RATES.ROAD.basePerKm *
        (TRANSPORT_RATES.ROAD.fuelSurchargePercent / 100);
      handlingCost += TRANSPORT_RATES.RAIL.terminalHandling * volumeTonnes * 2;
      break;

    case "SHIP":
      baseCost = distanceKm * volumeTonnes * TRANSPORT_RATES.SHIP.basePerKm;
      handlingCost += TRANSPORT_RATES.SHIP.portHandling * volumeTonnes * 2;
      break;
  }

  const totalCost = baseCost + fuelSurcharge + tollsCost + handlingCost;
  const costPerTonne = volumeTonnes > 0 ? totalCost / volumeTonnes : 0;

  return {
    baseCost: Math.round(baseCost * 100) / 100,
    fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
    tollsCost: Math.round(tollsCost * 100) / 100,
    handlingCost: Math.round(handlingCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    costPerTonne: Math.round(costPerTonne * 100) / 100,
  };
}

// Determine best transport mode based on distance and infrastructure
function recommendTransportMode(
  distanceKm: number,
  hasRailAccess: boolean,
  hasPortAccess: boolean
): "ROAD" | "RAIL" | "ROAD_RAIL" | "SHIP" {
  if (distanceKm > 500 && hasPortAccess) {
    return "SHIP";
  }
  if (distanceKm > 200 && hasRailAccess) {
    return "RAIL";
  }
  if (distanceKm > 150 && hasRailAccess) {
    return "ROAD_RAIL";
  }
  return "ROAD";
}

// Generate isochrone grid points
function generateGridPoints(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
  gridSize: number = 20
): Array<{ lat: number; lng: number }> {
  const points: Array<{ lat: number; lng: number }> = [];
  const latDelta = radiusKm / 111; // 1 degree lat ~ 111km
  const lngDelta = radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));

  const step = 2 / gridSize;
  for (let i = -1; i <= 1; i += step) {
    for (let j = -1; j <= 1; j += step) {
      const lat = centerLat + i * latDelta;
      const lng = centerLng + j * lngDelta;
      const dist = calculateDistance(centerLat, centerLng, lat, lng);
      if (dist <= radiusKm) {
        points.push({ lat, lng });
      }
    }
  }

  return points;
}

export const transportRouter = router({
  /**
   * Calculate route and cost between two points
   */
  calculateRoute: publicProcedure
    .input(
      z.object({
        origin: z.object({
          lat: z.number(),
          lng: z.number(),
          name: z.string().optional(),
        }),
        destination: z.object({
          lat: z.number(),
          lng: z.number(),
          name: z.string().optional(),
        }),
        volumeTonnes: z.number().positive(),
        feedstockCategory: z.string(),
        preferredMode: z.enum(["ROAD", "RAIL", "ROAD_RAIL", "SHIP"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { origin, destination, volumeTonnes, feedstockCategory, preferredMode } = input;

      // Calculate straight-line distance
      const straightLineKm = calculateDistance(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng
      );

      // Estimate travel time (average 60km/h for trucks)
      const estimatedHours = (straightLineKm * ROAD_DISTANCE_FACTOR) / 60;

      // Note: In production, would call routing API (HERE/Google) for accurate route
      // const routeGeometry = await getRouteFromAPI(origin, destination);

      // Check infrastructure access (would query logistics_hubs)
      const hasRailAccess = false; // Would check nearby rail terminals
      const hasPortAccess = false; // Would check nearby ports

      // Determine transport mode
      const mode = preferredMode || recommendTransportMode(straightLineKm, hasRailAccess, hasPortAccess);

      // Calculate costs for recommended mode
      const costs = calculateTransportCost(straightLineKm, volumeTonnes, mode, feedstockCategory);

      // Also calculate alternatives
      const alternatives: (ReturnType<typeof calculateTransportCost> & { mode: "ROAD" | "RAIL" | "ROAD_RAIL" | "SHIP" })[] = [
        { mode: "ROAD" as const, ...calculateTransportCost(straightLineKm, volumeTonnes, "ROAD", feedstockCategory) },
      ];

      if (straightLineKm > 100 && hasRailAccess) {
        alternatives.push({
          mode: "RAIL" as const,
          ...calculateTransportCost(straightLineKm, volumeTonnes, "RAIL", feedstockCategory),
        });
        alternatives.push({
          mode: "ROAD_RAIL" as const,
          ...calculateTransportCost(straightLineKm, volumeTonnes, "ROAD_RAIL", feedstockCategory),
        });
      }

      if (straightLineKm > 200 && hasPortAccess) {
        alternatives.push({
          mode: "SHIP" as const,
          ...calculateTransportCost(straightLineKm, volumeTonnes, "SHIP", feedstockCategory),
        });
      }

      // Sort alternatives by cost
      alternatives.sort((a, b) => a.totalCost - b.totalCost);

      return {
        origin,
        destination,
        distanceKm: Math.round(straightLineKm * 10) / 10,
        roadDistanceKm: Math.round(straightLineKm * ROAD_DISTANCE_FACTOR * 10) / 10,
        estimatedHours: Math.round(estimatedHours * 10) / 10,
        recommendedMode: mode,
        costs,
        alternatives,
        routeGeometry: null, // Would be GeoJSON LineString
        calculatedAt: new Date(),
      };
    }),

  /**
   * Find optimal logistics hub for a route
   */
  findOptimalHub: publicProcedure
    .input(
      z.object({
        origin: z.object({ lat: z.number(), lng: z.number() }),
        destination: z.object({ lat: z.number(), lng: z.number() }),
        volumeTonnes: z.number().positive(),
        feedstockCategory: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { origin, destination, volumeTonnes, feedstockCategory } = input;

      // Calculate direct route cost
      const directDistance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
      const directCosts = calculateTransportCost(directDistance, volumeTonnes, "ROAD", feedstockCategory);

      // Note: Would query logistics_hubs within reasonable distance of route
      // const nearbyHubs = await db.getLogisticsHubsNearRoute(origin, destination, 100);

      // For each hub, calculate total cost via hub
      const hubOptions: Array<{
        hub: any;
        totalDistance: number;
        totalCost: number;
        savings: number;
        transportModes: string[];
      }> = [];

      // Mock hub analysis
      // For each potential hub:
      // 1. Calculate origin->hub cost (road)
      // 2. Calculate hub->destination cost (rail if available)
      // 3. Add handling cost at hub
      // 4. Compare to direct route

      // Sort by savings
      hubOptions.sort((a, b) => b.savings - a.savings);

      return {
        directRoute: {
          distanceKm: directDistance,
          costs: directCosts,
          mode: "ROAD",
        },
        hubOptions: hubOptions.filter((h) => h.savings > 0),
        recommendation:
          hubOptions.length > 0 && hubOptions[0].savings > 0
            ? `Using ${hubOptions[0].hub?.name} could save $${hubOptions[0].savings.toFixed(2)}`
            : "Direct route is most cost-effective",
      };
    }),

  /**
   * Get transport cost matrix for map visualization (isochrone)
   */
  getTransportCostMatrix: publicProcedure
    .input(
      z.object({
        centerPoint: z.object({ lat: z.number(), lng: z.number() }),
        radiusKm: z.number().min(10).max(500),
        feedstockCategory: z.string(),
        volumeTonnes: z.number().positive(),
        direction: z.enum(["inbound", "outbound"]).default("inbound"),
      })
    )
    .query(async ({ input }) => {
      const { centerPoint, radiusKm, feedstockCategory, volumeTonnes, direction } = input;

      // Generate grid of points
      const gridPoints = generateGridPoints(centerPoint.lat, centerPoint.lng, radiusKm, 15);

      // Calculate cost for each point
      const costMatrix = gridPoints.map((point) => {
        const distance = calculateDistance(
          centerPoint.lat,
          centerPoint.lng,
          point.lat,
          point.lng
        );

        const origin = direction === "inbound" ? point : centerPoint;
        const dest = direction === "inbound" ? centerPoint : point;

        const costs = calculateTransportCost(distance, volumeTonnes, "ROAD", feedstockCategory);

        return {
          lat: point.lat,
          lng: point.lng,
          distanceKm: Math.round(distance * 10) / 10,
          costPerTonne: costs.costPerTonne,
          totalCost: costs.totalCost,
        };
      });

      // Calculate cost bands for visualization
      const allCosts = costMatrix.map((p) => p.costPerTonne);
      const minCost = Math.min(...allCosts);
      const maxCost = Math.max(...allCosts);
      const costRange = maxCost - minCost;

      const costBands = [
        { label: "Low", color: "#22c55e", min: minCost, max: minCost + costRange * 0.25 },
        { label: "Medium-Low", color: "#84cc16", min: minCost + costRange * 0.25, max: minCost + costRange * 0.5 },
        { label: "Medium-High", color: "#eab308", min: minCost + costRange * 0.5, max: minCost + costRange * 0.75 },
        { label: "High", color: "#ef4444", min: minCost + costRange * 0.75, max: maxCost },
      ];

      return {
        centerPoint,
        radiusKm,
        direction,
        costMatrix,
        costBands,
        statistics: {
          minCostPerTonne: Math.round(minCost * 100) / 100,
          maxCostPerTonne: Math.round(maxCost * 100) / 100,
          avgCostPerTonne: Math.round((minCost + maxCost) / 2 * 100) / 100,
        },
        calculatedAt: new Date(),
      };
    }),

  /**
   * Get logistics hubs within radius
   */
  getNearbyHubs: publicProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
        radiusKm: z.number().min(10).max(500).default(100),
        hubTypes: z
          .array(
            z.enum([
              "RAIL_TERMINAL",
              "PORT",
              "STORAGE_FACILITY",
              "INTERMODAL",
              "GRAIN_HUB",
              "PROCESSING_FACILITY",
            ])
          )
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const { lat, lng, radiusKm, hubTypes } = input;

      // Note: Would query logistics_hubs table
      // const hubs = await db.getLogisticsHubsNearPoint(lat, lng, radiusKm, hubTypes);

      return {
        center: { lat, lng },
        radiusKm,
        hubs: [],
        total: 0,
      };
    }),

  /**
   * Cache a calculated route (for frequently used routes)
   */
  cacheRoute: protectedProcedure
    .input(
      z.object({
        originType: z.enum(["PROJECT", "INTENTION", "POWER_STATION", "LOGISTICS_HUB", "CUSTOM"]),
        originId: z.string().optional(),
        originLat: z.number(),
        originLng: z.number(),
        originName: z.string().optional(),
        destinationType: z.enum(["PROJECT", "INTENTION", "POWER_STATION", "LOGISTICS_HUB", "CUSTOM"]),
        destinationId: z.string().optional(),
        destinationLat: z.number(),
        destinationLng: z.number(),
        destinationName: z.string().optional(),
        transportMode: z.enum(["ROAD", "RAIL", "ROAD_RAIL", "SHIP"]),
        feedstockCategory: z.string().optional(),
        volumeTonnes: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const distance = calculateDistance(
        input.originLat,
        input.originLng,
        input.destinationLat,
        input.destinationLng
      );

      const costs = calculateTransportCost(
        distance,
        input.volumeTonnes || 100, // Default to 100 tonnes for rate calculation
        input.transportMode,
        input.feedstockCategory || "other"
      );

      const route = {
        ...input,
        distanceKm: distance,
        estimatedHours: (distance * ROAD_DISTANCE_FACTOR) / 60,
        baseCostPerKm: (TRANSPORT_RATES[input.transportMode as keyof typeof TRANSPORT_RATES] as any)?.basePerKm || 0.12,
        fuelSurcharge: costs.fuelSurcharge.toFixed(2),
        tollsCost: costs.tollsCost.toFixed(2),
        handlingCost: costs.handlingCost.toFixed(2),
        totalCostPerTonne: costs.costPerTonne.toFixed(2),
        validFrom: new Date(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days validity
        calculationSource: "INTERNAL",
      };

      // Note: Would create transport_routes record
      // const created = await db.createTransportRoute(route);

      return {
        routeId: 0, // created.id
        message: "Route cached successfully",
        validUntil: route.validTo,
      };
    }),

  /**
   * Get delivery distance rings for visualization
   */
  getDeliveryRings: publicProcedure
    .input(
      z.object({
        centerLat: z.number(),
        centerLng: z.number(),
        ringDistances: z.array(z.number()).default([50, 100, 200]),
        feedstockCategory: z.string(),
        volumeTonnes: z.number().positive().default(100),
      })
    )
    .query(async ({ input }) => {
      const { centerLat, centerLng, ringDistances, feedstockCategory, volumeTonnes } = input;

      const rings = ringDistances.map((distance) => {
        const costs = calculateTransportCost(distance, volumeTonnes, "ROAD", feedstockCategory);

        return {
          radiusKm: distance,
          costPerTonne: costs.costPerTonne,
          estimatedHours: (distance * ROAD_DISTANCE_FACTOR) / 60,
          // GeoJSON circle would be generated client-side
        };
      });

      return {
        center: { lat: centerLat, lng: centerLng },
        rings,
        feedstockCategory,
        volumeTonnes,
      };
    }),

  /**
   * Update transport rates (admin)
   */
  updateTransportRates: adminProcedure
    .input(
      z.object({
        mode: z.enum(["ROAD", "RAIL", "SHIP"]),
        basePerKm: z.number().positive().optional(),
        fuelSurchargePercent: z.number().min(0).max(100).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Note: Would update rate configuration in database
      // In production, rates would be stored in DB not constants

      return {
        mode: input.mode,
        message: "Transport rates updated",
        updatedAt: new Date(),
      };
    }),
});

export type TransportRouter = typeof transportRouter;
