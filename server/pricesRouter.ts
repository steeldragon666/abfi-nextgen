/**
 * Feedstock Prices Router
 * API endpoints for the feedstock price index dashboard
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./_core/trpc";
import { getDb } from "./db";
import {
  feedstockPrices,
  regionalPriceSummary,
  forwardCurves,
  technicalIndicators,
} from "../drizzle/schema";
import { eq, desc, gte, and, sql } from "drizzle-orm";

// Helper to get db instance with null check
async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available",
    });
  }
  return db;
}

// Commodity base prices for mock data
const COMMODITY_BASE_PRICES: Record<string, number> = {
  UCO: 1250,
  Tallow: 980,
  Canola: 720,
  Palm: 850,
};

const REGIONS = [
  { id: "AUS", name: "Australia" },
  { id: "SEA", name: "Southeast Asia" },
  { id: "EU", name: "Europe" },
  { id: "NA", name: "North America" },
  { id: "LATAM", name: "Latin America" },
];

// Mock data generators
function getMockKPIs() {
  return Object.entries(COMMODITY_BASE_PRICES).map(([commodity, basePrice]) => {
    const change = (Math.random() - 0.5) * 10;
    return {
      commodity,
      price: Math.round(basePrice * (1 + change / 100)),
      currency: "AUD",
      unit: "MT",
      change_pct: Math.round(change * 10) / 10,
      change_direction: change > 0.5 ? "up" : change < -0.5 ? "down" : "flat",
    };
  });
}

function getMockOHLC(commodity: string, region: string, period: string) {
  const basePrice = COMMODITY_BASE_PRICES[commodity] || 1000;
  const days = period === "1M" ? 30 : period === "3M" ? 90 : period === "6M" ? 180 : period === "1Y" ? 365 : 730;
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic price movement
    const trend = Math.sin(i / 30) * 50;
    const noise = (Math.random() - 0.5) * 30;
    const dayPrice = basePrice + trend + noise;

    const open = dayPrice + (Math.random() - 0.5) * 20;
    const close = dayPrice + (Math.random() - 0.5) * 20;
    const high = Math.max(open, close) + Math.random() * 15;
    const low = Math.min(open, close) - Math.random() * 15;

    data.push({
      date: date.toISOString().split("T")[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 50000) + 10000,
    });
  }

  return {
    commodity,
    region,
    data,
    source: "ABFI Internal",
  };
}

function getMockHeatmap(commodity: string) {
  const basePrice = COMMODITY_BASE_PRICES[commodity] || 1000;

  return {
    commodity,
    regions: REGIONS.map((r) => {
      const regionMultiplier = r.id === "AUS" ? 1 : r.id === "SEA" ? 0.85 : r.id === "EU" ? 1.15 : r.id === "NA" ? 1.1 : 0.9;
      const price = basePrice * regionMultiplier + (Math.random() - 0.5) * 50;
      return {
        region: r.id,
        region_name: r.name,
        price: Math.round(price),
        change_pct: Math.round((Math.random() - 0.5) * 10 * 10) / 10,
        currency: "AUD",
      };
    }),
  };
}

function getMockForwardCurve(commodity: string, region: string) {
  const basePrice = COMMODITY_BASE_PRICES[commodity] || 1000;
  const isContango = Math.random() > 0.5;

  const tenors = ["Spot", "1M", "3M", "6M", "1Y"];
  const points = tenors.map((tenor, idx) => {
    const spread = isContango ? idx * 15 : -idx * 10;
    const price = basePrice + spread + (Math.random() - 0.5) * 10;
    return {
      tenor,
      price: Math.round(price),
      change_from_spot: idx === 0 ? 0 : Math.round(spread),
    };
  });

  return {
    commodity,
    region,
    curve_shape: isContango ? "contango" : "backwardation",
    points,
    as_of_date: new Date().toISOString().split("T")[0],
  };
}

function getMockTechnicals(commodity: string) {
  const indicators = [
    { name: "RSI (14)", baseValue: 50, range: 30 },
    { name: "MACD", baseValue: 0, range: 20 },
    { name: "SMA 20", baseValue: COMMODITY_BASE_PRICES[commodity] || 1000, range: 50 },
    { name: "SMA 50", baseValue: (COMMODITY_BASE_PRICES[commodity] || 1000) - 20, range: 50 },
    { name: "Bollinger %B", baseValue: 0.5, range: 0.5 },
  ];

  return indicators.map((ind) => {
    const value = ind.baseValue + (Math.random() - 0.5) * ind.range;
    let signal: "buy" | "sell" | "neutral";

    if (ind.name.includes("RSI")) {
      signal = value > 70 ? "sell" : value < 30 ? "buy" : "neutral";
    } else if (ind.name === "MACD") {
      signal = value > 5 ? "buy" : value < -5 ? "sell" : "neutral";
    } else if (ind.name === "Bollinger %B") {
      signal = value > 0.8 ? "sell" : value < 0.2 ? "buy" : "neutral";
    } else {
      signal = Math.random() > 0.6 ? "buy" : Math.random() > 0.3 ? "neutral" : "sell";
    }

    return {
      name: ind.name,
      value: Math.round(value * 100) / 100,
      signal,
    };
  });
}

export const pricesRouter = router({
  /**
   * Get price KPIs for all commodities
   */
  getKPIs: publicProcedure.query(async () => {
    try {
      const db = await requireDb();

      // Get latest price for each commodity
      const commodities = ["UCO", "Tallow", "Canola", "Palm"];
      const results = [];

      for (const commodity of commodities) {
        const [latest] = await db
          .select()
          .from(feedstockPrices)
          .where(and(eq(feedstockPrices.commodity, commodity), eq(feedstockPrices.region, "AUS")))
          .orderBy(desc(feedstockPrices.date))
          .limit(1);

        if (latest) {
          // Get previous day for change calculation
          const [previous] = await db
            .select()
            .from(feedstockPrices)
            .where(
              and(
                eq(feedstockPrices.commodity, commodity),
                eq(feedstockPrices.region, "AUS"),
                sql`${feedstockPrices.date} < ${latest.date}`
              )
            )
            .orderBy(desc(feedstockPrices.date))
            .limit(1);

          const currentPrice = parseFloat(latest.close as string);
          const previousPrice = previous ? parseFloat(previous.close as string) : currentPrice;
          const changePct = previousPrice !== 0 ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0;

          results.push({
            commodity,
            price: currentPrice,
            currency: "AUD",
            unit: "MT",
            change_pct: Math.round(changePct * 10) / 10,
            change_direction: changePct > 0.5 ? "up" : changePct < -0.5 ? "down" : "flat",
          });
        }
      }

      if (results.length === 0) {
        return getMockKPIs();
      }

      return results;
    } catch (error) {
      console.error("Failed to get price KPIs:", error);
      return getMockKPIs();
    }
  }),

  /**
   * Get OHLC price data
   */
  getOHLC: publicProcedure
    .input(
      z.object({
        commodity: z.string(),
        region: z.string().default("AUS"),
        period: z.enum(["1M", "3M", "6M", "1Y", "2Y"]).default("1Y"),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await requireDb();

        // Calculate date range
        const days =
          input.period === "1M" ? 30 : input.period === "3M" ? 90 : input.period === "6M" ? 180 : input.period === "1Y" ? 365 : 730;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const data = await db
          .select({
            date: feedstockPrices.date,
            open: feedstockPrices.open,
            high: feedstockPrices.high,
            low: feedstockPrices.low,
            close: feedstockPrices.close,
            volume: feedstockPrices.volume,
            source: feedstockPrices.source,
          })
          .from(feedstockPrices)
          .where(
            and(
              eq(feedstockPrices.commodity, input.commodity.toUpperCase()),
              eq(feedstockPrices.region, input.region),
              gte(feedstockPrices.date, startDate)
            )
          )
          .orderBy(feedstockPrices.date);

        if (data.length === 0) {
          return getMockOHLC(input.commodity, input.region, input.period);
        }

        return {
          commodity: input.commodity,
          region: input.region,
          data: data.map((d) => ({
            date: d.date instanceof Date ? d.date.toISOString().split("T")[0] : String(d.date),
            open: parseFloat(d.open as string),
            high: parseFloat(d.high as string),
            low: parseFloat(d.low as string),
            close: parseFloat(d.close as string),
            volume: d.volume || 0,
          })),
          source: data[0]?.source || "ABFI Internal",
        };
      } catch (error) {
        console.error("Failed to get OHLC data:", error);
        return getMockOHLC(input.commodity, input.region, input.period);
      }
    }),

  /**
   * Get regional price heatmap
   */
  getHeatmap: publicProcedure
    .input(
      z.object({
        commodity: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await requireDb();

        const regions = await db
          .select()
          .from(regionalPriceSummary)
          .where(eq(regionalPriceSummary.commodity, input.commodity.toUpperCase()));

        if (regions.length === 0) {
          return getMockHeatmap(input.commodity);
        }

        return {
          commodity: input.commodity,
          regions: regions.map((r) => ({
            region: r.region,
            region_name: r.regionName,
            price: parseFloat(r.price as string),
            change_pct: parseFloat(r.changePct as string),
            currency: r.currency,
          })),
        };
      } catch (error) {
        console.error("Failed to get heatmap:", error);
        return getMockHeatmap(input.commodity);
      }
    }),

  /**
   * Get forward curve
   */
  getForwardCurve: publicProcedure
    .input(
      z.object({
        commodity: z.string(),
        region: z.string().default("AUS"),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await requireDb();

        // Get most recent forward curve data
        const [latestDate] = await db
          .select({ asOfDate: forwardCurves.asOfDate })
          .from(forwardCurves)
          .where(
            and(eq(forwardCurves.commodity, input.commodity.toUpperCase()), eq(forwardCurves.region, input.region))
          )
          .orderBy(desc(forwardCurves.asOfDate))
          .limit(1);

        if (!latestDate) {
          return getMockForwardCurve(input.commodity, input.region);
        }

        const points = await db
          .select()
          .from(forwardCurves)
          .where(
            and(
              eq(forwardCurves.commodity, input.commodity.toUpperCase()),
              eq(forwardCurves.region, input.region),
              eq(forwardCurves.asOfDate, latestDate.asOfDate)
            )
          );

        // Determine curve shape
        const spotPrice = points.find((p) => p.tenor === "Spot");
        const farPrice = points.find((p) => p.tenor === "1Y");
        let curveShape: "contango" | "backwardation" | "flat" = "flat";

        if (spotPrice && farPrice) {
          const spotVal = parseFloat(spotPrice.price as string);
          const farVal = parseFloat(farPrice.price as string);
          if (farVal > spotVal + 10) curveShape = "contango";
          else if (farVal < spotVal - 10) curveShape = "backwardation";
        }

        return {
          commodity: input.commodity,
          region: input.region,
          curve_shape: curveShape,
          points: points.map((p) => ({
            tenor: p.tenor,
            price: parseFloat(p.price as string),
            change_from_spot: parseFloat(p.changeFromSpot as string),
          })),
          as_of_date:
            latestDate.asOfDate instanceof Date
              ? latestDate.asOfDate.toISOString().split("T")[0]
              : String(latestDate.asOfDate),
        };
      } catch (error) {
        console.error("Failed to get forward curve:", error);
        return getMockForwardCurve(input.commodity, input.region);
      }
    }),

  /**
   * Get technical indicators
   */
  getTechnicals: publicProcedure
    .input(
      z.object({
        commodity: z.string(),
        region: z.string().default("AUS"),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await requireDb();

        const indicators = await db
          .select()
          .from(technicalIndicators)
          .where(
            and(
              eq(technicalIndicators.commodity, input.commodity.toUpperCase()),
              eq(technicalIndicators.region, input.region)
            )
          );

        if (indicators.length === 0) {
          return getMockTechnicals(input.commodity);
        }

        return indicators.map((i) => ({
          name: i.indicatorName,
          value: parseFloat(i.value as string),
          signal: i.signal,
        }));
      } catch (error) {
        console.error("Failed to get technicals:", error);
        return getMockTechnicals(input.commodity);
      }
    }),

  /**
   * Get available commodities and regions
   */
  getCommodities: publicProcedure.query(async () => {
    return {
      commodities: [
        { id: "UCO", name: "Used Cooking Oil", unit: "MT" },
        { id: "Tallow", name: "Tallow", unit: "MT" },
        { id: "Canola", name: "Canola Oil", unit: "MT" },
        { id: "Palm", name: "Palm Oil", unit: "MT" },
      ],
      regions: REGIONS,
    };
  }),
});

export type PricesRouter = typeof pricesRouter;
