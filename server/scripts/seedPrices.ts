/**
 * Seed Script for Feedstock Prices
 * Run with: npx tsx server/scripts/seedPrices.ts
 *
 * This script populates the database with realistic feedstock price data
 * including OHLC data, regional prices, forward curves, and technical indicators.
 */

import "dotenv/config";
import { getDb } from "../db";
import {
  feedstockPrices,
  regionalPriceSummary,
  forwardCurves,
  technicalIndicators,
} from "../../drizzle/schema";

const COMMODITIES = [
  { id: "UCO", name: "Used Cooking Oil", basePrice: 1250 },
  { id: "Tallow", name: "Tallow", basePrice: 980 },
  { id: "Canola", name: "Canola Oil", basePrice: 720 },
  { id: "Palm", name: "Palm Oil", basePrice: 850 },
];

const REGIONS = [
  { id: "AUS", name: "Australia", multiplier: 1.0 },
  { id: "SEA", name: "Southeast Asia", multiplier: 0.85 },
  { id: "EU", name: "Europe", multiplier: 1.15 },
  { id: "NA", name: "North America", multiplier: 1.1 },
  { id: "LATAM", name: "Latin America", multiplier: 0.9 },
];

const TENORS = ["Spot", "1M", "3M", "6M", "1Y"];

const TECHNICAL_INDICATORS = [
  { name: "RSI (14)", baseValue: 50, range: 30 },
  { name: "MACD", baseValue: 0, range: 20 },
  { name: "SMA 20", baseValueMultiplier: 1.0, range: 50 },
  { name: "SMA 50", baseValueMultiplier: 0.98, range: 50 },
  { name: "Bollinger %B", baseValue: 0.5, range: 0.5 },
];

async function seedOHLCPrices(db: any) {
  console.log("Seeding OHLC price data...");

  const prices = [];
  const now = new Date();
  const days = 365; // 1 year of data

  for (const commodity of COMMODITIES) {
    for (const region of REGIONS) {
      const basePrice = commodity.basePrice * region.multiplier;

      for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Generate realistic price movement with trend and volatility
        const trend = Math.sin(i / 30) * 50;
        const seasonality = Math.sin((i / 365) * Math.PI * 2) * 30;
        const noise = (Math.random() - 0.5) * 40;
        const dayPrice = basePrice + trend + seasonality + noise;

        const open = dayPrice + (Math.random() - 0.5) * 20;
        const close = dayPrice + (Math.random() - 0.5) * 20;
        const high = Math.max(open, close) + Math.random() * 15;
        const low = Math.min(open, close) - Math.random() * 15;

        prices.push({
          commodity: commodity.id,
          region: region.id,
          date,
          open: open.toFixed(2),
          high: high.toFixed(2),
          low: low.toFixed(2),
          close: close.toFixed(2),
          volume: Math.floor(Math.random() * 50000) + 10000,
          source: "ABFI Internal",
        });
      }
    }
  }

  // Insert in batches to avoid memory issues
  const batchSize = 500;
  for (let i = 0; i < prices.length; i += batchSize) {
    const batch = prices.slice(i, i + batchSize);
    await db.insert(feedstockPrices).values(batch);
  }

  console.log(`  Inserted ${prices.length} OHLC price records`);
  return prices.length;
}

async function seedRegionalPrices(db: any) {
  console.log("Seeding regional price summary...");

  const summaries = [];

  for (const commodity of COMMODITIES) {
    for (const region of REGIONS) {
      const basePrice = commodity.basePrice * region.multiplier;
      const price = basePrice + (Math.random() - 0.5) * 50;
      const changePct = (Math.random() - 0.5) * 10;

      summaries.push({
        commodity: commodity.id,
        region: region.id,
        regionName: region.name,
        price: price.toFixed(2),
        changePct: changePct.toFixed(2),
        currency: "AUD",
      });
    }
  }

  await db.insert(regionalPriceSummary).values(summaries);
  console.log(`  Inserted ${summaries.length} regional price summaries`);
  return summaries.length;
}

async function seedForwardCurves(db: any) {
  console.log("Seeding forward curve data...");

  const curves = [];
  const today = new Date();

  for (const commodity of COMMODITIES) {
    for (const region of REGIONS) {
      const basePrice = commodity.basePrice * region.multiplier;
      const isContango = Math.random() > 0.5;

      for (let t = 0; t < TENORS.length; t++) {
        const tenor = TENORS[t];
        const spread = isContango ? t * 15 : -t * 10;
        const price = basePrice + spread + (Math.random() - 0.5) * 10;

        curves.push({
          commodity: commodity.id,
          region: region.id,
          tenor,
          price: price.toFixed(2),
          changeFromSpot: (t === 0 ? 0 : spread).toFixed(2),
          asOfDate: today,
        });
      }
    }
  }

  await db.insert(forwardCurves).values(curves);
  console.log(`  Inserted ${curves.length} forward curve points`);
  return curves.length;
}

async function seedTechnicalIndicators(db: any) {
  console.log("Seeding technical indicators...");

  const indicators = [];

  for (const commodity of COMMODITIES) {
    for (const region of REGIONS) {
      for (const ind of TECHNICAL_INDICATORS) {
        let baseValue: number;
        if (ind.baseValueMultiplier) {
          baseValue = commodity.basePrice * region.multiplier * ind.baseValueMultiplier;
        } else {
          baseValue = ind.baseValue!;
        }

        const value = baseValue + (Math.random() - 0.5) * ind.range;

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

        indicators.push({
          commodity: commodity.id,
          region: region.id,
          indicatorName: ind.name,
          value: value.toFixed(4),
          signal,
        });
      }
    }
  }

  await db.insert(technicalIndicators).values(indicators);
  console.log(`  Inserted ${indicators.length} technical indicators`);
  return indicators.length;
}

async function main() {
  console.log("=".repeat(60));
  console.log("ABFI Feedstock Prices - Data Seeding Script");
  console.log("=".repeat(60));
  console.log();

  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Seed all tables
    const ohlcCount = await seedOHLCPrices(db);
    const regionalCount = await seedRegionalPrices(db);
    const forwardCount = await seedForwardCurves(db);
    const techCount = await seedTechnicalIndicators(db);

    console.log();
    console.log("=".repeat(40));
    console.log("Summary:");
    console.log(`  OHLC price records: ${ohlcCount}`);
    console.log(`  Regional summaries: ${regionalCount}`);
    console.log(`  Forward curve points: ${forwardCount}`);
    console.log(`  Technical indicators: ${techCount}`);
    console.log("=".repeat(60));
    console.log("Seeding complete!");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
