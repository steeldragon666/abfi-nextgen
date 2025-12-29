/**
 * Price Intelligence Router
 * Provides transparent price signals for market participants
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "./_core/trpc";
import * as db from "./db";

// Australian state codes
const AUSTRALIAN_STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"] as const;

// Feedstock categories
const FEEDSTOCK_CATEGORIES = [
  "oilseed",
  "UCO",
  "tallow",
  "lignocellulosic",
  "waste",
  "algae",
  "bamboo",
  "other",
] as const;

// Helper to calculate confidence level based on data points
function calculateConfidence(dataPoints: number): "HIGH" | "MEDIUM" | "LOW" | "INDICATIVE" {
  if (dataPoints >= 10) return "HIGH";
  if (dataPoints >= 3) return "MEDIUM";
  if (dataPoints >= 1) return "LOW";
  return "INDICATIVE";
}

// Helper to calculate price from transaction data
function calculateVolumeWeightedAverage(
  transactions: Array<{ pricePerTonne: number; volumeTonnes: number }>
): number {
  if (transactions.length === 0) return 0;

  const totalVolume = transactions.reduce((sum, t) => sum + t.volumeTonnes, 0);
  const weightedSum = transactions.reduce(
    (sum, t) => sum + t.pricePerTonne * t.volumeTonnes,
    0
  );

  return totalVolume > 0 ? weightedSum / totalVolume : 0;
}

// Helper to calculate supply/demand indices
function calculateMarketIndex(
  supply: number,
  demand: number,
  historicalAverage: number
): { supplyIndex: number; demandIndex: number } {
  // Normalize to 0-100 scale based on historical average
  const supplyIndex = Math.min(100, Math.max(0, (supply / historicalAverage) * 50));
  const demandIndex = Math.min(100, Math.max(0, (demand / historicalAverage) * 50));
  return { supplyIndex, demandIndex };
}

export const priceIntelligenceRouter = router({
  /**
   * Get current price signals for map overlay
   * Returns latest prices grouped by region for heatmap display
   */
  getCurrentPrices: publicProcedure
    .input(
      z.object({
        feedstockCategories: z.array(z.string()).optional(),
        regionIds: z.array(z.string()).optional(),
        includeForwards: z.boolean().default(false),
      })
    )
    .query(async ({ input }) => {
      const { feedstockCategories, regionIds, includeForwards } = input;

      // Note: Would query price_signals table for latest valid signals
      // const signals = await db.getLatestPriceSignals({ feedstockCategories, regionIds });

      // Mock response structure
      const priceData: Record<
        string,
        {
          regionId: string;
          regionName: string;
          feedstockCategory: string;
          spotPrice: number | null;
          spotPriceChange: number | null;
          forward1M?: number;
          forward3M?: number;
          forward6M?: number;
          forward12M?: number;
          supplyIndex: number;
          demandIndex: number;
          confidence: string;
          dataPoints: number;
          validFrom: Date;
          validTo: Date;
        }
      > = {};

      // Group by region for heatmap
      const regionSummary = Object.values(priceData).reduce(
        (acc, signal) => {
          if (!acc[signal.regionId]) {
            acc[signal.regionId] = {
              regionId: signal.regionId,
              regionName: signal.regionName,
              avgSpotPrice: 0,
              priceCount: 0,
              avgSupplyIndex: 0,
              avgDemandIndex: 0,
              categories: [],
            };
          }
          if (signal.spotPrice) {
            acc[signal.regionId].avgSpotPrice += signal.spotPrice;
            acc[signal.regionId].priceCount++;
          }
          acc[signal.regionId].avgSupplyIndex += signal.supplyIndex;
          acc[signal.regionId].avgDemandIndex += signal.demandIndex;
          acc[signal.regionId].categories.push(signal.feedstockCategory);
          return acc;
        },
        {} as Record<string, any>
      );

      // Calculate averages
      for (const region of Object.values(regionSummary)) {
        if (region.priceCount > 0) {
          region.avgSpotPrice /= region.priceCount;
        }
        region.avgSupplyIndex /= region.categories.length || 1;
        region.avgDemandIndex /= region.categories.length || 1;
      }

      return {
        signals: Object.values(priceData),
        regionSummary: Object.values(regionSummary),
        updatedAt: new Date(),
      };
    }),

  /**
   * Get price history for charts
   */
  getPriceHistory: publicProcedure
    .input(
      z.object({
        feedstockCategory: z.string(),
        feedstockType: z.string().optional(),
        regionId: z.string().optional(),
        period: z.enum(["1M", "3M", "6M", "1Y", "2Y"]).default("6M"),
      })
    )
    .query(async ({ input }) => {
      const { feedstockCategory, feedstockType, regionId, period } = input;

      // Calculate date range based on period
      const now = new Date();
      const periodDays: Record<string, number> = {
        "1M": 30,
        "3M": 90,
        "6M": 180,
        "1Y": 365,
        "2Y": 730,
      };
      const startDate = new Date(now.getTime() - periodDays[period] * 24 * 60 * 60 * 1000);

      // Note: Would query historical price signals
      // const history = await db.getPriceHistory({ feedstockCategory, regionId, startDate });

      // Return time series data
      return {
        feedstockCategory,
        feedstockType,
        regionId,
        period,
        dataPoints: [],
        statistics: {
          min: 0,
          max: 0,
          avg: 0,
          stdDev: 0,
          trend: "stable" as "up" | "down" | "stable",
          trendPercent: 0,
        },
      };
    }),

  /**
   * Get forward price curve
   */
  getForwardCurve: publicProcedure
    .input(
      z.object({
        feedstockCategory: z.string(),
        regionId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { feedstockCategory, regionId } = input;

      // Note: Would get latest price signal with forward prices
      // const signal = await db.getLatestPriceSignal({ feedstockCategory, regionId });

      return {
        feedstockCategory,
        regionId,
        spotPrice: null as number | null,
        forwardCurve: [
          { period: "spot", price: null, confidence: "INDICATIVE" },
          { period: "1M", price: null, confidence: "INDICATIVE" },
          { period: "3M", price: null, confidence: "INDICATIVE" },
          { period: "6M", price: null, confidence: "INDICATIVE" },
          { period: "12M", price: null, confidence: "INDICATIVE" },
        ],
        lastUpdated: new Date(),
      };
    }),

  /**
   * Recalculate price signals from recent contracts (admin scheduled job)
   */
  recalculatePriceSignals: adminProcedure.mutation(async () => {
    // Get contracts settled in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Note: Would query completed transactions
    // const transactions = await db.getCompletedTransactions({ since: thirtyDaysAgo });

    // Group by region and feedstock category
    const priceGroups: Record<
      string,
      Array<{ pricePerTonne: number; volumeTonnes: number }>
    > = {};

    // For each group, calculate volume-weighted average price
    const newSignals = [];
    for (const [key, transactions] of Object.entries(priceGroups)) {
      const [feedstockCategory, regionId] = key.split("|");
      const vwap = calculateVolumeWeightedAverage(transactions);
      const confidence = calculateConfidence(transactions.length);

      // Calculate price range (min/max from transactions)
      const prices = transactions.map((t) => t.pricePerTonne);
      const priceRangeLow = Math.min(...prices);
      const priceRangeHigh = Math.max(...prices);

      // Note: Would also calculate supply/demand indices
      // based on available supply vs demand signals

      newSignals.push({
        feedstockCategory,
        regionId,
        regionName: regionId, // Would map to proper name
        spotPrice: vwap.toFixed(2),
        spotPriceChange: "0.00", // Would calculate vs previous period
        priceRangeLow: priceRangeLow.toFixed(2),
        priceRangeHigh: priceRangeHigh.toFixed(2),
        supplyIndex: 50, // Placeholder
        demandIndex: 50, // Placeholder
        source: "CONTRACT_AVERAGE",
        confidence,
        dataPoints: transactions.length,
        validFrom: new Date(),
        validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
      });
    }

    // Note: Would create new price signal records
    // await db.createPriceSignals(newSignals);

    return {
      signalsCreated: newSignals.length,
      calculatedAt: new Date(),
    };
  }),

  /**
   * Create price alert for user
   */
  createPriceAlert: protectedProcedure
    .input(
      z.object({
        feedstockCategory: z.string(),
        feedstockType: z.string().optional(),
        regionId: z.string().optional(),
        alertType: z.enum([
          "ABOVE_THRESHOLD",
          "BELOW_THRESHOLD",
          "PERCENT_CHANGE_UP",
          "PERCENT_CHANGE_DOWN",
        ]),
        thresholdValue: z.number().positive(),
        notifyEmail: z.boolean().default(true),
        notifyInApp: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const alert = {
        userId: ctx.user.id,
        ...input,
        isActive: true,
        triggerCount: 0,
        createdAt: new Date(),
      };

      // Note: Would create price alert record
      // const created = await db.createPriceAlert(alert);

      return {
        alertId: 0, // created.id
        message: "Price alert created successfully",
      };
    }),

  /**
   * Get user's price alerts
   */
  getMyPriceAlerts: protectedProcedure
    .input(
      z.object({
        isActive: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Note: Would query price alerts for user
      // const alerts = await db.getPriceAlertsForUser(ctx.user.id, input.isActive);

      return {
        alerts: [],
        total: 0,
      };
    }),

  /**
   * Update price alert
   */
  updatePriceAlert: protectedProcedure
    .input(
      z.object({
        alertId: z.number(),
        isActive: z.boolean().optional(),
        thresholdValue: z.number().positive().optional(),
        notifyEmail: z.boolean().optional(),
        notifyInApp: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { alertId, ...updates } = input;

      // Note: Would verify ownership and update
      // await db.updatePriceAlert(alertId, ctx.user.id, updates);

      return {
        alertId,
        message: "Price alert updated",
      };
    }),

  /**
   * Delete price alert
   */
  deletePriceAlert: protectedProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Note: Would verify ownership and delete
      // await db.deletePriceAlert(input.alertId, ctx.user.id);

      return {
        alertId: input.alertId,
        message: "Price alert deleted",
      };
    }),

  /**
   * Check and trigger price alerts (scheduled job)
   */
  checkPriceAlerts: adminProcedure.mutation(async () => {
    // Note: Would get all active alerts and check against latest prices
    // const alerts = await db.getActivePriceAlerts();
    // const latestPrices = await db.getLatestPriceSignals({});

    const triggeredCount = 0;

    // For each alert, check if threshold is met
    // If triggered, send notification and update lastTriggeredAt

    return {
      alertsChecked: 0,
      alertsTriggered: triggeredCount,
      checkedAt: new Date(),
    };
  }),

  /**
   * Get market summary for dashboard
   */
  getMarketSummary: publicProcedure
    .input(
      z.object({
        feedstockCategory: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      // Aggregated market view
      return {
        totalActiveListings: 0,
        totalActiveDemandSignals: 0,
        averageSpotPrice: 0,
        priceChangePercent: 0,
        topRegionsByVolume: [] as Array<{ regionId: string; volumeTonnes: number }>,
        topFeedstocksByValue: [] as Array<{ category: string; totalValue: number }>,
        recentTransactionCount: 0,
        marketHealthIndex: 0, // 0-100 composite
        updatedAt: new Date(),
      };
    }),

  /**
   * Get price benchmarks for specific feedstock
   */
  getPriceBenchmarks: publicProcedure
    .input(
      z.object({
        feedstockCategory: z.string(),
        feedstockType: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return {
        feedstockCategory: input.feedstockCategory,
        feedstockType: input.feedstockType,
        benchmarks: {
          national: {
            low: 0,
            average: 0,
            high: 0,
            dataPoints: 0,
          },
          byState: {} as Record<
            string,
            { low: number; average: number; high: number; dataPoints: number }
          >,
        },
        lastCalculated: new Date(),
      };
    }),
});

export type PriceIntelligenceRouter = typeof priceIntelligenceRouter;
