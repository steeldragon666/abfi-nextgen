/**
 * Seed Script for Lending Sentiment
 * Run with: npx tsx server/scripts/seedSentiment.ts
 *
 * This script populates the database with initial sentiment data
 * including documents, daily indices, and lender scores.
 */

import "dotenv/config";
import { getDb } from "../db";
import {
  sentimentDocuments,
  sentimentDailyIndex,
  lenderSentimentScores,
} from "../../drizzle/schema";

const LENDERS = [
  "NAB",
  "CBA",
  "Westpac",
  "ANZ",
  "Macquarie",
  "CEFC",
  "Export Finance Australia",
  "Bank of Queensland",
];

const SOURCES = [
  "RBA",
  "APRA",
  "AFR",
  "Bloomberg",
  "Bank Earnings",
  "Industry Report",
  "Reuters",
  "S&P Global",
];

const BULLISH_TITLES = [
  "CEFC announces $500M green lending facility for bioenergy projects",
  "NAB expands sustainable finance portfolio with biofuel focus",
  "Australian biofuel demand set to surge under new mandates",
  "Green hydrogen project secures major bank financing",
  "Renewable diesel plant receives $200M project finance",
  "Major banks signal increased appetite for renewable energy deals",
  "RBA highlights positive outlook for sustainable investments",
  "ARENA awards $50M for bioenergy innovation projects",
  "Corporate PPA demand drives renewable project financing",
  "Export Finance backs Australian SAF production facility",
];

const BEARISH_TITLES = [
  "Rising interest rates squeeze bioenergy project margins",
  "Feedstock supply concerns cloud biofuel outlook",
  "Regulatory uncertainty delays sustainable aviation fuel projects",
  "Banks tighten lending criteria for renewable fuel ventures",
  "Technology risk concerns limit project finance appetite",
  "Global supply chain issues impact bioenergy developments",
  "Credit conditions tighten for clean energy projects",
  "Project delays raise concerns over delivery timelines",
  "Cost overruns plague renewable fuel construction",
  "Counterparty risk heightens in volatile markets",
];

const NEUTRAL_TITLES = [
  "RBA holds rates steady, monitors green transition impacts",
  "APRA reviews climate risk disclosure requirements",
  "Industry consultation on biofuel sustainability criteria",
  "Market awaits clarity on federal renewable fuel policy",
  "Banks assess bioenergy project pipeline for 2025",
  "Quarterly review of sustainable finance volumes",
  "Due diligence standards updated for renewable projects",
  "ESG reporting requirements under review",
  "Industry stakeholders meet to discuss financing frameworks",
  "Clean energy financing outlook remains mixed",
];

async function seedDocuments(db: any) {
  console.log("Seeding sentiment documents...");

  const documents = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const sentimentType = Math.random();
    let sentiment: "BULLISH" | "BEARISH" | "NEUTRAL";
    let titles: string[];
    let score: number;

    if (sentimentType < 0.4) {
      sentiment = "BULLISH";
      titles = BULLISH_TITLES;
      score = 50 + Math.random() * 50;
    } else if (sentimentType < 0.7) {
      sentiment = "BEARISH";
      titles = BEARISH_TITLES;
      score = -50 - Math.random() * 50;
    } else {
      sentiment = "NEUTRAL";
      titles = NEUTRAL_TITLES;
      score = (Math.random() - 0.5) * 40;
    }

    const publishedDate = new Date(now);
    publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 90));

    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const lender = Math.random() > 0.3 ? LENDERS[Math.floor(Math.random() * LENDERS.length)] : null;

    documents.push({
      sourceId: `doc-${Date.now()}-${i}`,
      source,
      title,
      content: `${title}. This document discusses the current state of bioenergy financing in Australia.`,
      url: `https://example.com/article/${i + 1}`,
      publishedDate,
      sentiment,
      sentimentScore: score.toFixed(2),
      confidence: (0.7 + Math.random() * 0.3).toFixed(4),
      regulatoryRisk: (Math.random() * 100).toFixed(2),
      technologyRisk: (Math.random() * 100).toFixed(2),
      feedstockRisk: (Math.random() * 100).toFixed(2),
      counterpartyRisk: (Math.random() * 100).toFixed(2),
      marketRisk: (Math.random() * 100).toFixed(2),
      esgConcerns: (Math.random() * 100).toFixed(2),
      lender,
      keywords: ["bioenergy", "finance", "renewable"],
    });
  }

  await db.insert(sentimentDocuments).values(documents);
  console.log(`  Inserted ${documents.length} documents`);
  return documents.length;
}

async function seedDailyIndex(db: any) {
  console.log("Seeding daily sentiment index...");

  const indices = [];
  const now = new Date();

  // Generate 90 days of data
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate oscillating sentiment with some noise
    const baseValue = 30 + Math.sin(i / 15) * 20;
    const noise = (Math.random() - 0.5) * 10;
    const overallIndex = Math.max(-100, Math.min(100, baseValue + noise));

    const bullishCount = Math.floor(30 + Math.random() * 30);
    const bearishCount = Math.floor(10 + Math.random() * 20);
    const neutralCount = Math.floor(15 + Math.random() * 15);

    indices.push({
      date,
      overallIndex: overallIndex.toFixed(2),
      bullishCount,
      bearishCount,
      neutralCount,
      documentsAnalyzed: bullishCount + bearishCount + neutralCount,
      regulatoryRisk: (30 + Math.random() * 40).toFixed(2),
      technologyRisk: (20 + Math.random() * 30).toFixed(2),
      feedstockRisk: (35 + Math.random() * 35).toFixed(2),
      counterpartyRisk: (10 + Math.random() * 25).toFixed(2),
      marketRisk: (40 + Math.random() * 40).toFixed(2),
      esgConcerns: (20 + Math.random() * 30).toFixed(2),
    });
  }

  await db.insert(sentimentDailyIndex).values(indices);
  console.log(`  Inserted ${indices.length} daily index entries`);
  return indices.length;
}

async function seedLenderScores(db: any) {
  console.log("Seeding lender sentiment scores...");

  const scores = [];
  const now = new Date();

  // Base sentiment for each lender
  const lenderBaseSentiment: Record<string, number> = {
    "NAB": 42,
    "CBA": 38,
    "Westpac": 35,
    "ANZ": 28,
    "Macquarie": 55,
    "CEFC": 72,
    "Export Finance Australia": 45,
    "Bank of Queensland": 22,
  };

  // Generate 90 days of scores for each lender
  for (const lender of LENDERS) {
    const baseSentiment = lenderBaseSentiment[lender] || 30;

    for (let i = 90; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Add some variation over time
      const variation = Math.sin(i / 10) * 15 + (Math.random() - 0.5) * 10;
      const score = Math.max(-100, Math.min(100, baseSentiment + variation));

      scores.push({
        lender,
        date,
        sentimentScore: score.toFixed(2),
        documentCount: Math.floor(5 + Math.random() * 15),
      });
    }
  }

  await db.insert(lenderSentimentScores).values(scores);
  console.log(`  Inserted ${scores.length} lender score entries`);
  return scores.length;
}

async function main() {
  console.log("=".repeat(60));
  console.log("ABFI Lending Sentiment - Data Seeding Script");
  console.log("=".repeat(60));
  console.log();

  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Seed all tables
    const docsCount = await seedDocuments(db);
    const indexCount = await seedDailyIndex(db);
    const scoresCount = await seedLenderScores(db);

    console.log();
    console.log("=".repeat(40));
    console.log("Summary:");
    console.log(`  Documents seeded: ${docsCount}`);
    console.log(`  Daily indices seeded: ${indexCount}`);
    console.log(`  Lender scores seeded: ${scoresCount}`);
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
