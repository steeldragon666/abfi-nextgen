/**
 * Seed Script for Policy & Carbon
 * Run with: npx tsx server/scripts/seedPolicy.ts
 *
 * This script populates the database with realistic policy data
 * including timeline events, kanban items, mandate scenarios, and ACCU prices.
 */

import "dotenv/config";
import { getDb } from "../db";
import {
  policyTimelineEvents,
  policyKanbanItems,
  mandateScenarios,
  offtakeAgreements,
  accuPriceHistory,
  policyConsultations,
} from "../../drizzle/schema";

async function seedTimelineEvents(db: any) {
  console.log("Seeding policy timeline events...");

  const events = [
    { jurisdiction: "Federal", date: new Date("2025-01-15"), eventType: "enacted" as const, title: "Safeguard Mechanism Reform Act Implementation", policyId: "SM-2025" },
    { jurisdiction: "NSW", date: new Date("2025-02-01"), eventType: "consultation_open" as const, title: "Renewable Fuel Standard Consultation", policyId: "NSW-RFS-2025" },
    { jurisdiction: "QLD", date: new Date("2025-03-10"), eventType: "expected_decision" as const, title: "Biofuel Mandate Review - E10/B5 Extension", policyId: "QLD-BM-2025" },
    { jurisdiction: "VIC", date: new Date("2025-04-20"), eventType: "enacted" as const, title: "Zero Emissions Vehicle Roadmap 2035", policyId: "VIC-ZEV-2025" },
    { jurisdiction: "Federal", date: new Date("2025-05-15"), eventType: "consultation_open" as const, title: "National Biofuels Strategy 2030", policyId: "FED-NBS-2025" },
    { jurisdiction: "SA", date: new Date("2025-06-01"), eventType: "expected_decision" as const, title: "Green Hydrogen Action Plan Phase 2", policyId: "SA-GH-2025" },
    { jurisdiction: "WA", date: new Date("2025-07-01"), eventType: "enacted" as const, title: "Renewable Energy Buyback Scheme Update", policyId: "WA-REBS-2025" },
    { jurisdiction: "Federal", date: new Date("2025-09-01"), eventType: "expected_decision" as const, title: "Sustainable Aviation Fuel Mandate", policyId: "FED-SAF-2025" },
    { jurisdiction: "NSW", date: new Date("2025-10-15"), eventType: "enacted" as const, title: "Electric Vehicle Strategy Update", policyId: "NSW-EV-2025" },
    { jurisdiction: "QLD", date: new Date("2025-11-01"), eventType: "consultation_open" as const, title: "Waste-to-Energy Policy Framework", policyId: "QLD-WTE-2025" },
    { jurisdiction: "TAS", date: new Date("2025-08-15"), eventType: "enacted" as const, title: "Renewable Hydrogen Fund", policyId: "TAS-RHF-2025" },
    { jurisdiction: "ACT", date: new Date("2025-12-01"), eventType: "expected_decision" as const, title: "100% Renewable Electricity Target Review", policyId: "ACT-RET-2025" },
  ];

  await db.insert(policyTimelineEvents).values(events);
  console.log(`  Inserted ${events.length} timeline events`);
  return events.length;
}

async function seedKanbanItems(db: any) {
  console.log("Seeding policy kanban items...");

  const items = [
    // Proposed
    { title: "National B10 Biodiesel Mandate", jurisdiction: "Federal", policyType: "mandate", status: "proposed" as const, summary: "Proposal to increase biodiesel blend to 10% nationally" },
    { title: "SAF Production Incentive Scheme", jurisdiction: "Federal", policyType: "incentive", status: "proposed" as const, summary: "Tax incentives for domestic SAF production" },
    { title: "Biogas Feed-in Tariff", jurisdiction: "VIC", policyType: "tariff", status: "proposed" as const, summary: "Guaranteed tariff for biogas grid injection" },
    { title: "Green Ammonia Export Credits", jurisdiction: "WA", policyType: "credits", status: "proposed" as const, summary: "Export credits for green ammonia producers" },
    // Review
    { title: "Renewable Fuel Standard", jurisdiction: "NSW", policyType: "standard", status: "review" as const, summary: "Expanding fuel standards to include advanced biofuels" },
    { title: "Biofuel Mandate 2025 Extension", jurisdiction: "QLD", policyType: "mandate", status: "review" as const, summary: "Extending E10/B5 mandate with increased targets" },
    { title: "Hydrogen Blending in Gas Networks", jurisdiction: "SA", policyType: "regulation", status: "review" as const, summary: "10% hydrogen blending in natural gas networks" },
    // Enacted
    { title: "Safeguard Mechanism", jurisdiction: "Federal", policyType: "regulation", status: "enacted" as const, summary: "Emissions baseline reduction for large emitters" },
    { title: "Renewable Energy Target", jurisdiction: "Federal", policyType: "target", status: "enacted" as const, summary: "33,000 GWh renewable electricity by 2030" },
    { title: "E10 Mandate", jurisdiction: "NSW", policyType: "mandate", status: "enacted" as const, summary: "Mandatory E10 fuel availability at all stations" },
    { title: "E10 Mandate", jurisdiction: "QLD", policyType: "mandate", status: "enacted" as const, summary: "Mandatory E10 fuel availability at all stations" },
    { title: "Waste Levy Exemptions", jurisdiction: "VIC", policyType: "exemption", status: "enacted" as const, summary: "Waste levy exemptions for waste-to-energy facilities" },
    { title: "Clean Energy Finance Corporation", jurisdiction: "Federal", policyType: "finance", status: "enacted" as const, summary: "Financing for clean energy projects" },
  ];

  await db.insert(policyKanbanItems).values(items);
  console.log(`  Inserted ${items.length} kanban items`);
  return items.length;
}

async function seedMandateScenarios(db: any) {
  console.log("Seeding mandate scenarios...");

  const scenarios = [
    { name: "Current State (B2)", mandateLevel: "B2", revenueImpact: "12000000.00", description: "Current biodiesel blend rate of 2%" },
    { name: "B5 Scenario", mandateLevel: "B5", revenueImpact: "28000000.00", description: "5% biodiesel mandate as proposed" },
    { name: "B10 Scenario", mandateLevel: "B10", revenueImpact: "55000000.00", description: "10% biodiesel mandate (EU equivalent)" },
    { name: "B20 Scenario", mandateLevel: "B20", revenueImpact: "105000000.00", description: "20% biodiesel mandate (high ambition)" },
    { name: "SAF 2% Mandate", mandateLevel: "SAF2", revenueImpact: "45000000.00", description: "2% sustainable aviation fuel requirement" },
    { name: "SAF 5% Mandate", mandateLevel: "SAF5", revenueImpact: "120000000.00", description: "5% sustainable aviation fuel requirement" },
  ];

  await db.insert(mandateScenarios).values(scenarios);
  console.log(`  Inserted ${scenarios.length} mandate scenarios`);
  return scenarios.length;
}

async function seedOfftakeAgreements(db: any) {
  console.log("Seeding offtake agreements...");

  const agreements = [
    { offtaker: "Qantas Group", mandate: "SAF Commitment 2030", volume: "100ML/year", term: "10 years", premium: "+15%", isActive: true },
    { offtaker: "BP Australia", mandate: "B20 Supply Agreement", volume: "50ML/year", term: "5 years", premium: "+8%", isActive: true },
    { offtaker: "Ampol", mandate: "Renewable Diesel Supply", volume: "200ML/year", term: "7 years", premium: "+12%", isActive: true },
    { offtaker: "Viva Energy", mandate: "Biodiesel Blending", volume: "75ML/year", term: "5 years", premium: "+10%", isActive: true },
    { offtaker: "Shell Australia", mandate: "SAF Partnership", volume: "150ML/year", term: "8 years", premium: "+18%", isActive: true },
    { offtaker: "Caltex/Chevron", mandate: "B10 Supply", volume: "80ML/year", term: "6 years", premium: "+9%", isActive: true },
    { offtaker: "Virgin Australia", mandate: "SAF Commitment", volume: "30ML/year", term: "5 years", premium: "+20%", isActive: true },
    { offtaker: "Rex Airlines", mandate: "Regional SAF Trial", volume: "5ML/year", term: "3 years", premium: "+25%", isActive: true },
  ];

  await db.insert(offtakeAgreements).values(agreements);
  console.log(`  Inserted ${agreements.length} offtake agreements`);
  return agreements.length;
}

async function seedACCUPrices(db: any) {
  console.log("Seeding ACCU price history...");

  const prices = [];
  const now = new Date();
  let price = 32.0;

  // Generate 180 days of price history
  for (let i = 180; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random walk with slight upward trend
    const change = (Math.random() - 0.45) * 1.5;
    price = Math.max(20, Math.min(50, price + change));

    const previousPrice: number = i < 180 ? Number(prices[prices.length - 1]?.price) || price : price;
    const dailyChange: number = price - previousPrice;
    const changePct: number = previousPrice !== 0 ? (dailyChange / previousPrice) * 100 : 0;

    prices.push({
      date,
      price: price.toFixed(2),
      change: dailyChange.toFixed(2),
      changePct: changePct.toFixed(2),
      source: "Clean Energy Regulator",
    });
  }

  await db.insert(accuPriceHistory).values(prices);
  console.log(`  Inserted ${prices.length} ACCU price records`);
  return prices.length;
}

async function seedConsultations(db: any) {
  console.log("Seeding policy consultations...");

  const now = new Date();

  const consultations = [
    {
      title: "National Biofuels Strategy 2030 Consultation",
      jurisdiction: "Federal",
      opens: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      closes: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      relevance: "high",
      submissionUrl: "https://consult.industry.gov.au/biofuels-strategy",
    },
    {
      title: "Renewable Fuel Standard Review",
      jurisdiction: "NSW",
      opens: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      closes: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      relevance: "high",
      submissionUrl: "https://haveyoursay.nsw.gov.au/renewable-fuel-standard",
    },
    {
      title: "Waste-to-Energy Policy Framework",
      jurisdiction: "QLD",
      opens: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      closes: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      relevance: "medium",
      submissionUrl: "https://www.qld.gov.au/environment/waste-to-energy",
    },
    {
      title: "Hydrogen Blending Standards",
      jurisdiction: "SA",
      opens: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
      closes: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      relevance: "medium",
      submissionUrl: "https://www.sa.gov.au/hydrogen-standards",
    },
    {
      title: "SAF Production Incentive Design",
      jurisdiction: "Federal",
      opens: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      closes: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      relevance: "high",
      submissionUrl: "https://consult.dcceew.gov.au/saf-incentive",
    },
  ];

  await db.insert(policyConsultations).values(consultations);
  console.log(`  Inserted ${consultations.length} consultations`);
  return consultations.length;
}

async function main() {
  console.log("=".repeat(60));
  console.log("ABFI Policy & Carbon - Data Seeding Script");
  console.log("=".repeat(60));
  console.log();

  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    // Seed all tables
    const timelineCount = await seedTimelineEvents(db);
    const kanbanCount = await seedKanbanItems(db);
    const scenarioCount = await seedMandateScenarios(db);
    const offtakeCount = await seedOfftakeAgreements(db);
    const accuCount = await seedACCUPrices(db);
    const consultationCount = await seedConsultations(db);

    console.log();
    console.log("=".repeat(40));
    console.log("Summary:");
    console.log(`  Timeline events: ${timelineCount}`);
    console.log(`  Kanban items: ${kanbanCount}`);
    console.log(`  Mandate scenarios: ${scenarioCount}`);
    console.log(`  Offtake agreements: ${offtakeCount}`);
    console.log(`  ACCU price records: ${accuCount}`);
    console.log(`  Consultations: ${consultationCount}`);
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
