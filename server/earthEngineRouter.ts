/**
 * Earth Engine Router
 * Provides satellite intelligence endpoints for ABFI Platform
 *
 * Endpoints:
 * - getNDVI: Get NDVI analysis for a location
 * - getVegetationHealth: Get comprehensive vegetation health metrics
 * - getSoilMoisture: Get soil moisture data
 * - getLandCover: Get land cover classification
 * - getStatus: Check Earth Engine availability
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import earthEngineService from "./services/earthEngine";

// Input schemas
const geoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const geoBoundsSchema = z.object({
  north: z.number().min(-90).max(90),
  south: z.number().min(-90).max(90),
  east: z.number().min(-180).max(180),
  west: z.number().min(-180).max(180),
});

const dateRangeSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const earthEngineRouter = router({
  /**
   * Check Earth Engine service status
   */
  getStatus: publicProcedure.query(async () => {
    const available = earthEngineService.isEarthEngineAvailable();
    return {
      available,
      mode: available ? "live" : "demo",
      message: available
        ? "Earth Engine is configured and ready"
        : "Running in demo mode - configure credentials for live satellite data",
    };
  }),

  /**
   * Initialize Earth Engine (called on app startup)
   */
  initialize: publicProcedure.mutation(async () => {
    try {
      await earthEngineService.initializeEarthEngine();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),

  /**
   * Get NDVI (Normalized Difference Vegetation Index) for a location
   * Measures vegetation health and density
   */
  getNDVI: publicProcedure
    .input(
      z.object({
        point: geoPointSchema,
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        radius: z.number().min(100).max(10000).optional().default(500),
      })
    )
    .query(async ({ input }) => {
      // Default to last 30 days if no dates provided
      const endDate = input.endDate || new Date().toISOString().split("T")[0];
      const startDate =
        input.startDate ||
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

      const result = await earthEngineService.calculateNDVI(
        input.point,
        startDate,
        endDate,
        input.radius
      );

      return result;
    }),

  /**
   * Get comprehensive vegetation health analysis
   * Includes NDVI, EVI, LAI, and health score
   */
  getVegetationHealth: publicProcedure
    .input(
      z.object({
        point: geoPointSchema,
        months: z.number().min(1).max(24).optional().default(6),
      })
    )
    .query(async ({ input }) => {
      const result = await earthEngineService.getVegetationHealth(
        input.point,
        input.months
      );

      return result;
    }),

  /**
   * Get soil moisture data for a location
   * Uses SMAP satellite data
   */
  getSoilMoisture: publicProcedure
    .input(
      z.object({
        point: geoPointSchema,
      })
    )
    .query(async ({ input }) => {
      const result = await earthEngineService.getSoilMoisture(input.point);
      return result;
    }),

  /**
   * Get land cover classification for an area
   * Uses Google Dynamic World dataset
   */
  getLandCover: publicProcedure
    .input(
      z.object({
        bounds: geoBoundsSchema,
      })
    )
    .query(async ({ input }) => {
      const result = await earthEngineService.getLandCover(input.bounds);
      return result;
    }),

  /**
   * Get satellite analysis for a feedstock location
   * Combines multiple metrics for feedstock assessment
   */
  getFeedstockAnalysis: protectedProcedure
    .input(
      z.object({
        point: geoPointSchema,
        feedstockId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      // Run analyses in parallel
      const [ndvi, vegetationHealth, soilMoisture] = await Promise.all([
        earthEngineService.calculateNDVI(
          input.point,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          new Date().toISOString().split("T")[0]
        ),
        earthEngineService.getVegetationHealth(input.point, 6),
        earthEngineService.getSoilMoisture(input.point),
      ]);

      // Calculate overall sustainability score
      const sustainabilityScore = calculateSustainabilityScore(
        ndvi,
        vegetationHealth,
        soilMoisture
      );

      return {
        ndvi,
        vegetationHealth,
        soilMoisture,
        sustainabilityScore,
        timestamp: new Date().toISOString(),
        recommendations: generateRecommendations(
          ndvi,
          vegetationHealth,
          soilMoisture
        ),
      };
    }),

  /**
   * Get historical NDVI trend for a location
   */
  getNDVITrend: publicProcedure
    .input(
      z.object({
        point: geoPointSchema,
        years: z.number().min(1).max(5).optional().default(2),
      })
    )
    .query(async ({ input }) => {
      const months = input.years * 12;
      const dataPoints: Array<{ date: string; ndvi: number }> = [];

      // Get quarterly data points
      for (let i = 0; i < months; i += 3) {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() - i);
        const startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - 1);

        try {
          const result = await earthEngineService.calculateNDVI(
            input.point,
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0]
          );

          dataPoints.push({
            date: endDate.toISOString().split("T")[0],
            ndvi: result.mean,
          });
        } catch {
          // Skip failed data points
        }
      }

      return {
        dataPoints: dataPoints.reverse(),
        trend: calculateTrend(dataPoints.map((d) => d.ndvi)),
      };
    }),
});

// Helper functions

function calculateSustainabilityScore(
  ndvi: { mean: number },
  vegetation: { healthScore: number },
  soil: { surfaceMoisture: number; droughtRisk: string }
): number {
  // Weighted scoring
  const ndviScore = Math.min(ndvi.mean / 0.6, 1) * 35;
  const healthScore = (vegetation.healthScore / 100) * 35;

  const droughtPenalty: Record<string, number> = {
    low: 0,
    moderate: 5,
    high: 15,
    severe: 30,
  };

  const moistureScore = 30 - (droughtPenalty[soil.droughtRisk] || 0);

  return Math.round(ndviScore + healthScore + moistureScore);
}

function generateRecommendations(
  ndvi: { healthCategory: string },
  vegetation: { alerts: string[] },
  soil: { droughtRisk: string; moistureCategory: string }
): string[] {
  const recommendations: string[] = [];

  // NDVI-based recommendations
  if (ndvi.healthCategory === "poor" || ndvi.healthCategory === "bare") {
    recommendations.push(
      "Consider implementing cover crops to improve vegetation cover"
    );
  }

  // Soil moisture recommendations
  if (soil.droughtRisk === "high" || soil.droughtRisk === "severe") {
    recommendations.push(
      "Implement water conservation practices - drought risk is elevated"
    );
  }

  if (soil.moistureCategory === "very_dry") {
    recommendations.push("Consider irrigation scheduling optimization");
  }

  // Include vegetation alerts
  recommendations.push(...vegetation.alerts);

  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push("Current conditions are favorable for production");
  }

  return recommendations;
}

function calculateTrend(values: number[]): "improving" | "stable" | "declining" {
  if (values.length < 2) return "stable";

  // Simple linear regression slope
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  if (slope > 0.01) return "improving";
  if (slope < -0.01) return "declining";
  return "stable";
}

export default earthEngineRouter;
