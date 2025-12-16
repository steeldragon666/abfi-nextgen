/**
 * Bankability Stress-Testing Engine (Phase 6)
 * Simulates adverse scenarios to test project resilience
 */

import { getDb } from "./db.js";
import {
  stressScenarios,
  stressTestResults,
  contractEnforceabilityScores,
  type InsertStressScenario,
  type InsertStressTestResult,
  type InsertContractEnforceabilityScore,
} from "../drizzle/schema.js";
import { eq, and, desc } from "drizzle-orm";

/**
 * Calculate Herfindahl-Hirschman Index (HHI) for concentration risk
 * HHI = sum of squared market shares (0-10000)
 * < 1500 = low concentration
 * 1500-2500 = moderate concentration
 * > 2500 = high concentration
 */
export function calculateHHI(supplierVolumes: number[]): number {
  const totalVolume = supplierVolumes.reduce((sum, v) => sum + v, 0);
  if (totalVolume === 0) return 0;

  const hhi = supplierVolumes.reduce((sum, volume) => {
    const marketShare = (volume / totalVolume) * 100; // As percentage
    return sum + marketShare * marketShare;
  }, 0);

  return Math.round(hhi);
}

/**
 * Calculate rating from score (simplified mapping)
 */
export function scoreToRating(score: number): string {
  if (score >= 90) return "AAA";
  if (score >= 80) return "AA";
  if (score >= 70) return "A";
  if (score >= 60) return "BBB";
  if (score >= 50) return "BB";
  if (score >= 40) return "B";
  if (score >= 30) return "CCC";
  return "CC";
}

/**
 * Calculate rating delta (number of notches)
 */
export function calculateRatingDelta(
  baseRating: string,
  stressRating: string
): number {
  const ratings = ["CC", "CCC", "B", "BB", "BBB", "A", "AA", "AAA"];
  const baseIndex = ratings.indexOf(baseRating);
  const stressIndex = ratings.indexOf(stressRating);
  return stressIndex - baseIndex; // Negative = downgrade
}

/**
 * Run supplier loss scenario
 */
export async function runSupplierLossScenario(
  projectId: number,
  supplierId: number,
  agreements: Array<{ id: number; supplierId: number; committedVolume: number }>
): Promise<{
  baseHhi: number;
  stressHhi: number;
  supplyShortfallPercent: number;
  remainingSuppliers: number;
  affectedAgreements: number[];
}> {
  // Calculate base case
  const baseVolumes = agreements.map(a => a.committedVolume);
  const baseHhi = calculateHHI(baseVolumes);

  // Calculate stress case (remove supplier)
  const affectedAgreements = agreements.filter(
    a => a.supplierId === supplierId
  );
  const lostVolume = affectedAgreements.reduce(
    (sum, a) => sum + a.committedVolume,
    0
  );
  const totalVolume = baseVolumes.reduce((sum, v) => sum + v, 0);
  const supplyShortfallPercent =
    totalVolume > 0 ? (lostVolume / totalVolume) * 100 : 0;

  const stressVolumes = agreements
    .filter(a => a.supplierId !== supplierId)
    .map(a => a.committedVolume);
  const stressHhi = calculateHHI(stressVolumes);

  const remainingSuppliers = new Set(
    agreements.filter(a => a.supplierId !== supplierId).map(a => a.supplierId)
  ).size;

  return {
    baseHhi,
    stressHhi,
    supplyShortfallPercent: Math.round(supplyShortfallPercent),
    remainingSuppliers,
    affectedAgreements: affectedAgreements.map(a => a.id),
  };
}

/**
 * Run supply shortfall scenario
 */
export async function runSupplyShortfallScenario(
  projectId: number,
  shortfallPercent: number,
  agreements: Array<{ id: number; supplierId: number; committedVolume: number }>
): Promise<{
  baseHhi: number;
  stressHhi: number;
  supplyShortfallPercent: number;
  remainingSuppliers: number;
}> {
  // Calculate base case
  const baseVolumes = agreements.map(a => a.committedVolume);
  const baseHhi = calculateHHI(baseVolumes);

  // Calculate stress case (reduce all volumes proportionally)
  const stressVolumes = baseVolumes.map(v => v * (1 - shortfallPercent / 100));
  const stressHhi = calculateHHI(stressVolumes);

  return {
    baseHhi,
    stressHhi,
    supplyShortfallPercent: shortfallPercent,
    remainingSuppliers: agreements.length,
  };
}

/**
 * Check covenant breaches under stress
 */
export function checkCovenantBreaches(
  stressMetrics: {
    tier1Coverage: number;
    hhi: number;
    supplyShortfall: number;
  },
  covenants: Array<{
    type: string;
    threshold: number;
  }>
): Array<{
  covenantType: string;
  threshold: number;
  actualValue: number;
  breachSeverity: "minor" | "moderate" | "major" | "critical";
}> {
  const breaches: Array<{
    covenantType: string;
    threshold: number;
    actualValue: number;
    breachSeverity: "minor" | "moderate" | "major" | "critical";
  }> = [];

  for (const covenant of covenants) {
    let actualValue: number;
    let isBreached = false;

    switch (covenant.type) {
      case "min_tier1_coverage":
        actualValue = stressMetrics.tier1Coverage;
        isBreached = actualValue < covenant.threshold;
        break;
      case "max_hhi":
        actualValue = stressMetrics.hhi;
        isBreached = actualValue > covenant.threshold;
        break;
      case "max_supply_shortfall":
        actualValue = stressMetrics.supplyShortfall;
        isBreached = actualValue > covenant.threshold;
        break;
      default:
        continue;
    }

    if (isBreached) {
      // Calculate breach severity based on how far from threshold
      const deviation = Math.abs(actualValue - covenant.threshold);
      const deviationPercent = (deviation / covenant.threshold) * 100;

      let breachSeverity: "minor" | "moderate" | "major" | "critical";
      if (deviationPercent < 10) breachSeverity = "minor";
      else if (deviationPercent < 25) breachSeverity = "moderate";
      else if (deviationPercent < 50) breachSeverity = "major";
      else breachSeverity = "critical";

      breaches.push({
        covenantType: covenant.type,
        threshold: covenant.threshold,
        actualValue,
        breachSeverity,
      });
    }
  }

  return breaches;
}

/**
 * Run comprehensive stress test
 */
export async function runStressTest(params: {
  projectId: number;
  scenarioType: "supplier_loss" | "supply_shortfall" | "regional_shock";
  scenarioParams: {
    supplierId?: number;
    shortfallPercent?: number;
    region?: string;
  };
  baseScore: number;
  baseRating: string;
  agreements: Array<{
    id: number;
    supplierId: number;
    committedVolume: number;
  }>;
  covenants?: Array<{ type: string; threshold: number }>;
  testedBy: number;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Create scenario record
  const scenarioResult = await db.insert(stressScenarios).values({
    scenarioName: `${params.scenarioType} - ${new Date().toISOString()}`,
    scenarioType: params.scenarioType,
    parameters: params.scenarioParams,
    description: null,
    createdBy: params.testedBy,
    isTemplate: false,
  });

  const scenarioId = Number(scenarioResult[0].insertId);

  // Run scenario simulation
  let stressMetrics: {
    baseHhi: number;
    stressHhi: number;
    supplyShortfallPercent: number;
    remainingSuppliers: number;
  };

  if (
    params.scenarioType === "supplier_loss" &&
    params.scenarioParams.supplierId
  ) {
    stressMetrics = await runSupplierLossScenario(
      params.projectId,
      params.scenarioParams.supplierId,
      params.agreements
    );
  } else if (
    params.scenarioType === "supply_shortfall" &&
    params.scenarioParams.shortfallPercent
  ) {
    stressMetrics = await runSupplyShortfallScenario(
      params.projectId,
      params.scenarioParams.shortfallPercent,
      params.agreements
    );
  } else {
    throw new Error("Unsupported scenario type or missing parameters");
  }

  // Calculate stress score (simplified: reduce score based on shortfall and HHI increase)
  const shortfallPenalty = stressMetrics.supplyShortfallPercent * 0.5; // 0.5 points per % shortfall
  const hhiIncrease = stressMetrics.stressHhi - stressMetrics.baseHhi;
  const hhiPenalty = hhiIncrease > 0 ? Math.min(hhiIncrease / 100, 20) : 0; // Max 20 points penalty

  const stressScore = Math.max(
    0,
    Math.round(params.baseScore - shortfallPenalty - hhiPenalty)
  );
  const stressRating = scoreToRating(stressScore);
  const ratingDelta = calculateRatingDelta(params.baseRating, stressRating);

  // Calculate Tier 1 coverage (simplified)
  const baseTier1Coverage = 100; // Placeholder
  const stressTier1Coverage = Math.max(
    0,
    baseTier1Coverage - stressMetrics.supplyShortfallPercent
  );

  // Check covenant breaches
  const covenantBreaches = params.covenants
    ? checkCovenantBreaches(
        {
          tier1Coverage: stressTier1Coverage,
          hhi: stressMetrics.stressHhi,
          supplyShortfall: stressMetrics.supplyShortfallPercent,
        },
        params.covenants
      )
    : [];

  // Determine pass/fail
  const passesStressTest = covenantBreaches.length === 0 && ratingDelta >= -1; // Allow 1 notch downgrade
  const minimumRatingMaintained = stressRating >= "BBB"; // Investment grade threshold

  // Generate narrative
  const narrativeSummary = `Under ${params.scenarioType} scenario, project rating would decline from ${params.baseRating} to ${stressRating} (${ratingDelta} notches). Supply shortfall: ${stressMetrics.supplyShortfallPercent}%. HHI increases from ${stressMetrics.baseHhi} to ${stressMetrics.stressHhi}. ${covenantBreaches.length} covenant breach(es) detected.`;

  const recommendations: string[] = [];
  if (stressMetrics.supplyShortfallPercent > 20) {
    recommendations.push(
      "Diversify supplier base to reduce concentration risk"
    );
  }
  if (stressMetrics.stressHhi > 2500) {
    recommendations.push("Add additional suppliers to reduce HHI below 2500");
  }
  if (covenantBreaches.length > 0) {
    recommendations.push(
      "Negotiate covenant headroom or implement mitigation measures"
    );
  }

  // Store results
  const resultInsert = await db.insert(stressTestResults).values({
    projectId: params.projectId,
    scenarioId,
    testDate: new Date(),
    testedBy: params.testedBy,
    baseRating: params.baseRating,
    baseScore: params.baseScore,
    baseHhi: stressMetrics.baseHhi,
    baseTier1Coverage: baseTier1Coverage,
    stressRating,
    stressScore,
    stressHhi: stressMetrics.stressHhi,
    stressTier1Coverage,
    ratingDelta,
    scoreDelta: stressScore - params.baseScore,
    hhiDelta: stressMetrics.stressHhi - stressMetrics.baseHhi,
    supplyShortfallPercent: stressMetrics.supplyShortfallPercent,
    remainingSuppliers: stressMetrics.remainingSuppliers,
    covenantBreaches,
    narrativeSummary,
    recommendations,
    passesStressTest,
    minimumRatingMaintained,
  });

  return Number(resultInsert[0].insertId);
}

/**
 * Get stress test results for a project
 */
export async function getStressTestResults(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(stressTestResults)
    .where(eq(stressTestResults.projectId, projectId))
    .orderBy(desc(stressTestResults.testDate));
}

/**
 * Get stress test result by ID
 */
export async function getStressTestResult(resultId: number) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(stressTestResults)
    .where(eq(stressTestResults.id, resultId))
    .limit(1);

  return results[0] || null;
}

/**
 * Assess contract enforceability
 */
export async function assessContractEnforceability(params: {
  agreementId: number;
  governingLaw: string;
  jurisdiction: string;
  disputeResolution:
    | "litigation"
    | "arbitration"
    | "mediation"
    | "expert_determination";
  hasTerminationProtections: boolean;
  hasStepInRights: boolean;
  hasSecurityPackage: boolean;
  hasRemedies: boolean;
  assessedBy: number;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Score each component (0-10)
  const jurisdictionScore = [
    "New South Wales",
    "Victoria",
    "Queensland",
  ].includes(params.governingLaw)
    ? 10
    : 7;
  const terminationClauseScore = params.hasTerminationProtections ? 10 : 3;
  const stepInRightsScore = params.hasStepInRights ? 10 : 0;
  const securityPackageScore = params.hasSecurityPackage ? 10 : 2;
  const remediesScore = params.hasRemedies ? 10 : 5;

  const overallScore =
    jurisdictionScore +
    terminationClauseScore +
    stepInRightsScore +
    securityPackageScore +
    remediesScore;

  let rating: "strong" | "adequate" | "weak" | "very_weak";
  if (overallScore >= 40) rating = "strong";
  else if (overallScore >= 30) rating = "adequate";
  else if (overallScore >= 20) rating = "weak";
  else rating = "very_weak";

  const result = await db.insert(contractEnforceabilityScores).values({
    agreementId: params.agreementId,
    governingLaw: params.governingLaw,
    jurisdiction: params.jurisdiction,
    disputeResolution: params.disputeResolution,
    terminationClauseScore,
    stepInRightsScore,
    securityPackageScore,
    remediesScore,
    jurisdictionScore,
    overallEnforceabilityScore: overallScore,
    enforceabilityRating: rating,
    assessedBy: params.assessedBy,
    assessedDate: new Date(),
    legalOpinionAttached: false,
    notes: null,
  });

  return Number(result[0].insertId);
}

/**
 * Get contract enforceability score
 */
export async function getContractEnforceabilityScore(agreementId: number) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(contractEnforceabilityScores)
    .where(eq(contractEnforceabilityScores.agreementId, agreementId))
    .orderBy(desc(contractEnforceabilityScores.assessedDate))
    .limit(1);

  return results[0] || null;
}

// ============================================================================
// REGIONAL EVENT SCENARIO (Phase 6 - Scenario 2)
// ============================================================================

/**
 * Run regional event scenario
 * Simulates supply disruption in a geographic region
 */
export async function runRegionalEventScenario(
  projectId: number,
  region: string,
  reductionPercent: number,
  agreements: Array<{
    id: number;
    supplierId: number;
    committedVolume: number;
    supplierState?: string;
  }>
): Promise<{
  baseHhi: number;
  stressHhi: number;
  supplyShortfallPercent: number;
  remainingSuppliers: number;
  affectedAgreements: number[];
  affectedVolume: number;
  unaffectedVolume: number;
}> {
  // Calculate base case
  const baseVolumes = agreements.map(a => a.committedVolume);
  const baseHhi = calculateHHI(baseVolumes);

  // Apply regional reduction
  const affectedAgreements = agreements.filter(
    a => a.supplierState?.toUpperCase() === region.toUpperCase()
  );
  const unaffectedAgreements = agreements.filter(
    a => a.supplierState?.toUpperCase() !== region.toUpperCase()
  );

  const affectedVolume = affectedAgreements.reduce(
    (sum, a) => sum + a.committedVolume,
    0
  );
  const lostVolume = affectedVolume * (reductionPercent / 100);
  const totalVolume = baseVolumes.reduce((sum, v) => sum + v, 0);
  const supplyShortfallPercent =
    totalVolume > 0 ? (lostVolume / totalVolume) * 100 : 0;

  // Calculate stress volumes (reduce affected suppliers proportionally)
  const stressVolumes = agreements.map(a => {
    if (a.supplierState?.toUpperCase() === region.toUpperCase()) {
      return a.committedVolume * (1 - reductionPercent / 100);
    }
    return a.committedVolume;
  });
  const stressHhi = calculateHHI(stressVolumes);

  const remainingSuppliers = new Set(
    agreements
      .filter(
        a =>
          a.supplierState?.toUpperCase() !== region.toUpperCase() ||
          a.committedVolume * (1 - reductionPercent / 100) > 0
      )
      .map(a => a.supplierId)
  ).size;

  return {
    baseHhi,
    stressHhi,
    supplyShortfallPercent: Math.round(supplyShortfallPercent * 10) / 10,
    remainingSuppliers,
    affectedAgreements: affectedAgreements.map(a => a.id),
    affectedVolume,
    unaffectedVolume: unaffectedAgreements.reduce(
      (sum, a) => sum + a.committedVolume,
      0
    ),
  };
}

// ============================================================================
// PRICE SHOCK SCENARIO (Phase 6 - Scenario 3)
// ============================================================================

/**
 * Run price shock scenario
 * Simulates feedstock cost increases and impact on project economics
 */
export async function runPriceShockScenario(
  projectId: number,
  priceIncreasePercent: number,
  agreements: Array<{
    id: number;
    supplierId: number;
    committedVolume: number;
    pricePerTonne?: number;
  }>,
  projectEconomics: {
    baseRevenue: number;
    baseCost: number;
    targetMargin: number; // As percentage
  }
): Promise<{
  baseCost: number;
  stressCost: number;
  costIncrease: number;
  baseMargin: number;
  stressMargin: number;
  marginErosion: number;
  breakEvenPriceIncrease: number;
  viabilityStatus: "viable" | "marginal" | "unviable";
  affectedContracts: Array<{
    agreementId: number;
    baseCost: number;
    stressCost: number;
    costIncrease: number;
  }>;
}> {
  // Calculate base feedstock costs
  const baseFeedstockCost = agreements.reduce((sum, a) => {
    const price = a.pricePerTonne || 100; // Default price per tonne
    return sum + a.committedVolume * price;
  }, 0);

  // Calculate stress feedstock costs
  const stressFeedstockCost = baseFeedstockCost * (1 + priceIncreasePercent / 100);
  const costIncrease = stressFeedstockCost - baseFeedstockCost;

  // Calculate project margins
  const baseMargin =
    projectEconomics.baseRevenue > 0
      ? ((projectEconomics.baseRevenue - projectEconomics.baseCost) /
          projectEconomics.baseRevenue) *
        100
      : 0;

  const stressTotalCost = projectEconomics.baseCost + costIncrease;
  const stressMargin =
    projectEconomics.baseRevenue > 0
      ? ((projectEconomics.baseRevenue - stressTotalCost) /
          projectEconomics.baseRevenue) *
        100
      : 0;

  const marginErosion = baseMargin - stressMargin;

  // Calculate break-even price increase
  const marginBuffer = baseMargin - projectEconomics.targetMargin;
  const breakEvenPriceIncrease =
    baseFeedstockCost > 0
      ? (marginBuffer / 100) *
        projectEconomics.baseRevenue /
        baseFeedstockCost *
        100
      : 0;

  // Determine viability
  let viabilityStatus: "viable" | "marginal" | "unviable";
  if (stressMargin >= projectEconomics.targetMargin) {
    viabilityStatus = "viable";
  } else if (stressMargin >= 0) {
    viabilityStatus = "marginal";
  } else {
    viabilityStatus = "unviable";
  }

  // Calculate per-contract impact
  const affectedContracts = agreements.map(a => {
    const price = a.pricePerTonne || 100;
    const baseCost = a.committedVolume * price;
    const stressCost = baseCost * (1 + priceIncreasePercent / 100);
    return {
      agreementId: a.id,
      baseCost,
      stressCost,
      costIncrease: stressCost - baseCost,
    };
  });

  return {
    baseCost: baseFeedstockCost,
    stressCost: stressFeedstockCost,
    costIncrease,
    baseMargin: Math.round(baseMargin * 10) / 10,
    stressMargin: Math.round(stressMargin * 10) / 10,
    marginErosion: Math.round(marginErosion * 10) / 10,
    breakEvenPriceIncrease: Math.round(breakEvenPriceIncrease * 10) / 10,
    viabilityStatus,
    affectedContracts,
  };
}

/**
 * Run comprehensive stress test with all scenario types
 */
export async function runComprehensiveStressTest(params: {
  projectId: number;
  scenarioType:
    | "supplier_loss"
    | "supply_shortfall"
    | "regional_shock"
    | "price_spike";
  scenarioParams: {
    supplierId?: number;
    shortfallPercent?: number;
    region?: string;
    reductionPercent?: number;
    priceIncreasePercent?: number;
  };
  baseScore: number;
  baseRating: string;
  agreements: Array<{
    id: number;
    supplierId: number;
    committedVolume: number;
    supplierState?: string;
    pricePerTonne?: number;
  }>;
  projectEconomics?: {
    baseRevenue: number;
    baseCost: number;
    targetMargin: number;
  };
  covenants?: Array<{ type: string; threshold: number }>;
  testedBy: number;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Create scenario record
  const scenarioResult = await db.insert(stressScenarios).values({
    scenarioName: `${params.scenarioType} - ${new Date().toISOString()}`,
    scenarioType: params.scenarioType,
    parameters: params.scenarioParams,
    description: null,
    createdBy: params.testedBy,
    isTemplate: false,
  });

  const scenarioId = Number(scenarioResult[0].insertId);

  // Run appropriate scenario simulation
  let stressMetrics: {
    baseHhi: number;
    stressHhi: number;
    supplyShortfallPercent: number;
    remainingSuppliers: number;
  };

  let priceShockResults: Awaited<ReturnType<typeof runPriceShockScenario>> | null = null;

  switch (params.scenarioType) {
    case "supplier_loss":
      if (!params.scenarioParams.supplierId) {
        throw new Error("supplierId required for supplier_loss scenario");
      }
      stressMetrics = await runSupplierLossScenario(
        params.projectId,
        params.scenarioParams.supplierId,
        params.agreements
      );
      break;

    case "supply_shortfall":
      if (params.scenarioParams.shortfallPercent === undefined) {
        throw new Error("shortfallPercent required for supply_shortfall scenario");
      }
      stressMetrics = await runSupplyShortfallScenario(
        params.projectId,
        params.scenarioParams.shortfallPercent,
        params.agreements
      );
      break;

    case "regional_shock":
      if (!params.scenarioParams.region || params.scenarioParams.reductionPercent === undefined) {
        throw new Error("region and reductionPercent required for regional_shock scenario");
      }
      stressMetrics = await runRegionalEventScenario(
        params.projectId,
        params.scenarioParams.region,
        params.scenarioParams.reductionPercent,
        params.agreements
      );
      break;

    case "price_spike":
      if (params.scenarioParams.priceIncreasePercent === undefined || !params.projectEconomics) {
        throw new Error("priceIncreasePercent and projectEconomics required for price_spike scenario");
      }
      priceShockResults = await runPriceShockScenario(
        params.projectId,
        params.scenarioParams.priceIncreasePercent,
        params.agreements,
        params.projectEconomics
      );
      // For price shock, HHI doesn't change
      stressMetrics = {
        baseHhi: calculateHHI(params.agreements.map(a => a.committedVolume)),
        stressHhi: calculateHHI(params.agreements.map(a => a.committedVolume)),
        supplyShortfallPercent: 0,
        remainingSuppliers: params.agreements.length,
      };
      break;

    default:
      throw new Error("Unsupported scenario type");
  }

  // Calculate stress score
  let stressScore: number;
  if (params.scenarioType === "price_spike" && priceShockResults) {
    // For price shock, reduce score based on margin erosion
    const marginPenalty = Math.min(priceShockResults.marginErosion * 2, 30);
    const viabilityPenalty = priceShockResults.viabilityStatus === "unviable" ? 20
      : priceShockResults.viabilityStatus === "marginal" ? 10 : 0;
    stressScore = Math.max(0, Math.round(params.baseScore - marginPenalty - viabilityPenalty));
  } else {
    const shortfallPenalty = stressMetrics.supplyShortfallPercent * 0.5;
    const hhiIncrease = stressMetrics.stressHhi - stressMetrics.baseHhi;
    const hhiPenalty = hhiIncrease > 0 ? Math.min(hhiIncrease / 100, 20) : 0;
    stressScore = Math.max(0, Math.round(params.baseScore - shortfallPenalty - hhiPenalty));
  }

  const stressRating = scoreToRating(stressScore);
  const ratingDelta = calculateRatingDelta(params.baseRating, stressRating);

  // Calculate Tier 1 coverage
  const baseTier1Coverage = 100;
  const stressTier1Coverage = Math.max(
    0,
    baseTier1Coverage - stressMetrics.supplyShortfallPercent
  );

  // Check covenant breaches
  const covenantBreaches = params.covenants
    ? checkCovenantBreaches(
        {
          tier1Coverage: stressTier1Coverage,
          hhi: stressMetrics.stressHhi,
          supplyShortfall: stressMetrics.supplyShortfallPercent,
        },
        params.covenants
      )
    : [];

  // Determine pass/fail
  const passesStressTest = covenantBreaches.length === 0 && ratingDelta >= -1;
  const minimumRatingMaintained = stressRating >= "BBB";

  // Generate narrative
  let narrativeSummary: string;
  if (params.scenarioType === "price_spike" && priceShockResults) {
    narrativeSummary = `Under ${params.scenarioParams.priceIncreasePercent}% price shock scenario, project margin would decline from ${priceShockResults.baseMargin}% to ${priceShockResults.stressMargin}%. Rating impact: ${params.baseRating} to ${stressRating} (${ratingDelta} notches). Viability: ${priceShockResults.viabilityStatus}. Break-even at ${priceShockResults.breakEvenPriceIncrease}% price increase.`;
  } else if (params.scenarioType === "regional_shock") {
    narrativeSummary = `Under regional shock scenario (${params.scenarioParams.region} -${params.scenarioParams.reductionPercent}%), project rating would decline from ${params.baseRating} to ${stressRating} (${ratingDelta} notches). Supply shortfall: ${stressMetrics.supplyShortfallPercent}%. HHI changes from ${stressMetrics.baseHhi} to ${stressMetrics.stressHhi}.`;
  } else {
    narrativeSummary = `Under ${params.scenarioType} scenario, project rating would decline from ${params.baseRating} to ${stressRating} (${ratingDelta} notches). Supply shortfall: ${stressMetrics.supplyShortfallPercent}%. HHI increases from ${stressMetrics.baseHhi} to ${stressMetrics.stressHhi}. ${covenantBreaches.length} covenant breach(es) detected.`;
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (stressMetrics.supplyShortfallPercent > 20) {
    recommendations.push("Diversify supplier base to reduce concentration risk");
  }
  if (stressMetrics.stressHhi > 2500) {
    recommendations.push("Add additional suppliers to reduce HHI below 2500");
  }
  if (covenantBreaches.length > 0) {
    recommendations.push("Negotiate covenant headroom or implement mitigation measures");
  }
  if (params.scenarioType === "price_spike" && priceShockResults?.viabilityStatus !== "viable") {
    recommendations.push("Negotiate price caps or index clauses in supply contracts");
    recommendations.push("Consider hedging instruments or long-term fixed-price agreements");
  }
  if (params.scenarioType === "regional_shock") {
    recommendations.push("Diversify supplier base across multiple regions");
    recommendations.push("Consider weather/climate insurance products");
  }

  // Store results
  const resultInsert = await db.insert(stressTestResults).values({
    projectId: params.projectId,
    scenarioId,
    testDate: new Date(),
    testedBy: params.testedBy,
    baseRating: params.baseRating,
    baseScore: params.baseScore,
    baseHhi: stressMetrics.baseHhi,
    baseTier1Coverage,
    stressRating,
    stressScore,
    stressHhi: stressMetrics.stressHhi,
    stressTier1Coverage,
    ratingDelta,
    scoreDelta: stressScore - params.baseScore,
    hhiDelta: stressMetrics.stressHhi - stressMetrics.baseHhi,
    supplyShortfallPercent: stressMetrics.supplyShortfallPercent,
    remainingSuppliers: stressMetrics.remainingSuppliers,
    covenantBreaches,
    narrativeSummary,
    recommendations,
    passesStressTest,
    minimumRatingMaintained,
  });

  return Number(resultInsert[0].insertId);
}
