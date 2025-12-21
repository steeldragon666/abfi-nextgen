/**
 * Lending Sentiment Router
 * API endpoints for the AI-powered sentiment analysis
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import {
  sentimentDocuments,
  sentimentDailyIndex,
  lenderSentimentScores,
} from "../drizzle/schema";
import { eq, desc, gte, lte, sql, and, between } from "drizzle-orm";

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

// Helper for admin-only procedures
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

// Mock data for when database is empty
function getMockSentimentIndex() {
  const now = new Date();
  return {
    date: now.toISOString().split("T")[0],
    overall_index: 32,
    bullish_count: 45,
    bearish_count: 18,
    neutral_count: 24,
    documents_analyzed: 87,
    fear_components: {
      regulatory_risk: 45,
      technology_risk: 22,
      feedstock_risk: 38,
      counterparty_risk: 15,
      market_risk: 55,
      esg_concerns: 28,
    },
    daily_change: 2.3,
    weekly_change: 8.5,
    monthly_change: 12.1,
  };
}

function getMockTrend(period: string) {
  const months = period === "1m" ? 1 : period === "3m" ? 3 : period === "6m" ? 6 : period === "12m" ? 12 : 24;
  const days = months * 30;
  const trend = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic oscillating sentiment
    const baseValue = 30 + Math.sin(i / 15) * 20;
    const noise = (Math.random() - 0.5) * 10;
    const bullish = Math.max(0, Math.round(baseValue + noise));
    const bearish = Math.max(0, Math.round(30 - baseValue / 2 + noise));

    trend.push({
      date: date.toISOString().split("T")[0],
      bullish,
      bearish,
      net_sentiment: bullish - bearish,
    });
  }

  return trend;
}

function getMockLenders() {
  const lenders = [
    { name: "NAB", base: 42 },
    { name: "CBA", base: 38 },
    { name: "Westpac", base: 35 },
    { name: "ANZ", base: 28 },
    { name: "Macquarie", base: 55 },
    { name: "CEFC", base: 72 },
    { name: "Export Finance", base: 45 },
    { name: "Bank of Queensland", base: 22 },
  ];

  return lenders.map((l) => ({
    lender: l.name,
    sentiment: l.base + Math.round((Math.random() - 0.5) * 20),
    change_30d: Math.round((Math.random() - 0.3) * 15 * 10) / 10,
    documents: Math.floor(Math.random() * 50) + 10,
    trend: Array.from({ length: 10 }, () =>
      l.base + Math.round((Math.random() - 0.5) * 30)
    ),
  }));
}

function getMockDocuments() {
  const sources = ["RBA", "APRA", "AFR", "Bloomberg", "Bank Earnings", "Industry Report"];
  const sentiments: Array<"BULLISH" | "BEARISH" | "NEUTRAL"> = ["BULLISH", "BEARISH", "NEUTRAL"];

  const titles = {
    BULLISH: [
      "CEFC announces $500M green lending facility for bioenergy projects",
      "NAB expands sustainable finance portfolio with biofuel focus",
      "Australian biofuel demand set to surge under new mandates",
      "Green hydrogen project secures major bank financing",
      "Renewable diesel plant receives $200M project finance",
    ],
    BEARISH: [
      "Rising interest rates squeeze bioenergy project margins",
      "Feedstock supply concerns cloud biofuel outlook",
      "Regulatory uncertainty delays sustainable aviation fuel projects",
      "Banks tighten lending criteria for renewable fuel ventures",
      "Technology risk concerns limit project finance appetite",
    ],
    NEUTRAL: [
      "RBA holds rates steady, monitors green transition impacts",
      "APRA reviews climate risk disclosure requirements",
      "Industry consultation on biofuel sustainability criteria",
      "Market awaits clarity on federal renewable fuel policy",
      "Banks assess bioenergy project pipeline for 2025",
    ],
  };

  const docs = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const sentiment = sentiments[Math.floor(Math.random() * 3)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const titleList = titles[sentiment];
    const title = titleList[Math.floor(Math.random() * titleList.length)];

    const publishedDate = new Date(now);
    publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 30));

    docs.push({
      id: `doc-${i + 1}`,
      title,
      source,
      published_date: publishedDate.toISOString(),
      sentiment,
      sentiment_score: sentiment === "BULLISH" ? 50 + Math.random() * 50 :
                       sentiment === "BEARISH" ? -50 - Math.random() * 50 :
                       (Math.random() - 0.5) * 40,
      url: `https://example.com/article/${i + 1}`,
    });
  }

  // Sort by date descending
  docs.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());

  return docs;
}

export const sentimentRouter = router({
  /**
   * Get current sentiment index
   */
  getIndex: publicProcedure.query(async () => {
    try {
      const db = await requireDb();

      // Get latest daily index
      const [latestIndex] = await db
        .select()
        .from(sentimentDailyIndex)
        .orderBy(desc(sentimentDailyIndex.date))
        .limit(1);

      if (!latestIndex) {
        // Return mock data if no real data
        return getMockSentimentIndex();
      }

      // Get previous day for daily change
      const [previousDay] = await db
        .select()
        .from(sentimentDailyIndex)
        .where(sql`${sentimentDailyIndex.date} < ${latestIndex.date}`)
        .orderBy(desc(sentimentDailyIndex.date))
        .limit(1);

      // Get week ago for weekly change
      const weekAgo = new Date(latestIndex.date);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const [weekAgoIndex] = await db
        .select()
        .from(sentimentDailyIndex)
        .where(sql`${sentimentDailyIndex.date} <= ${weekAgo.toISOString().split("T")[0]}`)
        .orderBy(desc(sentimentDailyIndex.date))
        .limit(1);

      const currentIndex = parseFloat(latestIndex.overallIndex as string);
      const previousIndex = previousDay ? parseFloat(previousDay.overallIndex as string) : currentIndex;
      const weekAgoValue = weekAgoIndex ? parseFloat(weekAgoIndex.overallIndex as string) : currentIndex;

      return {
        date: latestIndex.date,
        overall_index: currentIndex,
        bullish_count: latestIndex.bullishCount,
        bearish_count: latestIndex.bearishCount,
        neutral_count: latestIndex.neutralCount,
        documents_analyzed: latestIndex.documentsAnalyzed,
        fear_components: {
          regulatory_risk: parseFloat(latestIndex.regulatoryRisk as string || "0"),
          technology_risk: parseFloat(latestIndex.technologyRisk as string || "0"),
          feedstock_risk: parseFloat(latestIndex.feedstockRisk as string || "0"),
          counterparty_risk: parseFloat(latestIndex.counterpartyRisk as string || "0"),
          market_risk: parseFloat(latestIndex.marketRisk as string || "0"),
          esg_concerns: parseFloat(latestIndex.esgConcerns as string || "0"),
        },
        daily_change: previousIndex !== 0 ?
          ((currentIndex - previousIndex) / Math.abs(previousIndex)) * 100 : 0,
        weekly_change: weekAgoValue !== 0 ?
          ((currentIndex - weekAgoValue) / Math.abs(weekAgoValue)) * 100 : 0,
      };
    } catch (error) {
      console.error("Failed to get sentiment index:", error);
      return getMockSentimentIndex();
    }
  }),

  /**
   * Get sentiment trend over time
   */
  getTrend: publicProcedure
    .input(z.object({
      period: z.enum(["1m", "3m", "6m", "12m", "24m"]).default("12m"),
    }))
    .query(async ({ input }) => {
      try {
        const db = await requireDb();

        // Calculate date range
        const months = input.period === "1m" ? 1 :
                       input.period === "3m" ? 3 :
                       input.period === "6m" ? 6 :
                       input.period === "12m" ? 12 : 24;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);

        const trends = await db
          .select({
            date: sentimentDailyIndex.date,
            bullish: sentimentDailyIndex.bullishCount,
            bearish: sentimentDailyIndex.bearishCount,
            overallIndex: sentimentDailyIndex.overallIndex,
          })
          .from(sentimentDailyIndex)
          .where(gte(sentimentDailyIndex.date, startDate))
          .orderBy(sentimentDailyIndex.date);

        if (trends.length === 0) {
          return getMockTrend(input.period);
        }

        return trends.map((t) => ({
          date: t.date,
          bullish: t.bullish,
          bearish: t.bearish,
          net_sentiment: parseFloat(t.overallIndex as string),
        }));
      } catch (error) {
        console.error("Failed to get sentiment trend:", error);
        return getMockTrend(input.period);
      }
    }),

  /**
   * Get lender sentiment scores
   */
  getLenders: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(8),
    }))
    .query(async ({ input }) => {
      try {
        const db = await requireDb();

        // Get unique lenders with their latest scores
        const lenders = await db
          .select({
            lender: lenderSentimentScores.lender,
            sentimentScore: lenderSentimentScores.sentimentScore,
            documentCount: lenderSentimentScores.documentCount,
            date: lenderSentimentScores.date,
          })
          .from(lenderSentimentScores)
          .orderBy(desc(lenderSentimentScores.date))
          .limit(input.limit * 10); // Get more to group by lender

        if (lenders.length === 0) {
          return getMockLenders();
        }

        // Group by lender and get latest for each
        const lenderMap = new Map<string, typeof lenders[0]>();
        for (const l of lenders) {
          if (!lenderMap.has(l.lender)) {
            lenderMap.set(l.lender, l);
          }
        }

        // Get trend data for each lender (last 10 data points)
        const results = await Promise.all(
          Array.from(lenderMap.values()).slice(0, input.limit).map(async (l) => {
            const trendData = await db
              .select({ score: lenderSentimentScores.sentimentScore })
              .from(lenderSentimentScores)
              .where(eq(lenderSentimentScores.lender, l.lender))
              .orderBy(desc(lenderSentimentScores.date))
              .limit(10);

            // Get 30 days ago score for change calculation
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const [oldScore] = await db
              .select({ score: lenderSentimentScores.sentimentScore })
              .from(lenderSentimentScores)
              .where(and(
                eq(lenderSentimentScores.lender, l.lender),
                lte(lenderSentimentScores.date, thirtyDaysAgo)
              ))
              .orderBy(desc(lenderSentimentScores.date))
              .limit(1);

            const currentScore = parseFloat(l.sentimentScore as string);
            const oldScoreValue = oldScore ? parseFloat(oldScore.score as string) : currentScore;

            return {
              lender: l.lender,
              sentiment: currentScore,
              change_30d: Math.round((currentScore - oldScoreValue) * 10) / 10,
              documents: l.documentCount,
              trend: trendData.reverse().map((t) => parseFloat(t.score as string)),
            };
          })
        );

        return results;
      } catch (error) {
        console.error("Failed to get lender scores:", error);
        return getMockLenders();
      }
    }),

  /**
   * Get document feed
   */
  getDocumentFeed: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(15),
      sentiment: z.enum(["BULLISH", "BEARISH", "NEUTRAL"]).optional(),
    }))
    .query(async ({ input }) => {
      try {
        const db = await requireDb();

        const conditions = [];
        if (input.sentiment) {
          conditions.push(eq(sentimentDocuments.sentiment, input.sentiment));
        }

        const docs = await db
          .select({
            id: sentimentDocuments.id,
            title: sentimentDocuments.title,
            source: sentimentDocuments.source,
            publishedDate: sentimentDocuments.publishedDate,
            sentiment: sentimentDocuments.sentiment,
            sentimentScore: sentimentDocuments.sentimentScore,
            url: sentimentDocuments.url,
          })
          .from(sentimentDocuments)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(sentimentDocuments.publishedDate))
          .limit(input.limit);

        if (docs.length === 0) {
          return getMockDocuments();
        }

        return docs.map((d) => ({
          id: String(d.id),
          title: d.title,
          source: d.source,
          published_date: d.publishedDate.toISOString(),
          sentiment: d.sentiment,
          sentiment_score: parseFloat(d.sentimentScore as string),
          url: d.url,
        }));
      } catch (error) {
        console.error("Failed to get document feed:", error);
        return getMockDocuments();
      }
    }),

  /**
   * Get fear component history
   */
  getFearComponentHistory: publicProcedure
    .input(z.object({
      lookbackDays: z.number().min(7).max(365).default(90),
    }))
    .query(async ({ input }) => {
      try {
        const db = await requireDb();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - input.lookbackDays);

        const data = await db
          .select({
            date: sentimentDailyIndex.date,
            regulatoryRisk: sentimentDailyIndex.regulatoryRisk,
            technologyRisk: sentimentDailyIndex.technologyRisk,
            feedstockRisk: sentimentDailyIndex.feedstockRisk,
            counterpartyRisk: sentimentDailyIndex.counterpartyRisk,
            marketRisk: sentimentDailyIndex.marketRisk,
            esgConcerns: sentimentDailyIndex.esgConcerns,
          })
          .from(sentimentDailyIndex)
          .where(gte(sentimentDailyIndex.date, startDate))
          .orderBy(sentimentDailyIndex.date);

        // Transform to component-based format
        const result: Record<string, { date: string; value: number }[]> = {
          regulatory_risk: [],
          technology_risk: [],
          feedstock_risk: [],
          counterparty_risk: [],
          market_risk: [],
          esg_concerns: [],
        };

        for (const row of data) {
          const dateStr = row.date instanceof Date ? row.date.toISOString().split("T")[0] : String(row.date);
          result.regulatory_risk.push({ date: dateStr, value: parseFloat(row.regulatoryRisk as string || "0") });
          result.technology_risk.push({ date: dateStr, value: parseFloat(row.technologyRisk as string || "0") });
          result.feedstock_risk.push({ date: dateStr, value: parseFloat(row.feedstockRisk as string || "0") });
          result.counterparty_risk.push({ date: dateStr, value: parseFloat(row.counterpartyRisk as string || "0") });
          result.market_risk.push({ date: dateStr, value: parseFloat(row.marketRisk as string || "0") });
          result.esg_concerns.push({ date: dateStr, value: parseFloat(row.esgConcerns as string || "0") });
        }

        return result;
      } catch (error) {
        console.error("Failed to get fear component history:", error);
        return {};
      }
    }),
});

export type SentimentRouter = typeof sentimentRouter;
