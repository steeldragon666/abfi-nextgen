/**
 * Score Explainability Engine (Phase 4)
 * Provides full audit trails and transparency for all score calculations
 */

import { getDb } from "./db.js";
import {
  scoreCalculations,
  scoreSensitivityAnalysis,
  scoreImprovementSimulations,
  type InsertScoreCalculation,
  type InsertScoreSensitivityAnalysis,
  type InsertScoreImprovementSimulation,
} from "../drizzle/schema.js";
import { eq, desc } from "drizzle-orm";

/**
 * Record a score calculation with full audit trail
 */
export async function recordScoreCalculation(data: {
  scoreId: number;
  scoreType: string;
  inputs: Record<string, any>;
  weights: Record<string, number>;
  contributions: Array<{
    component: string;
    inputValue: any;
    weight: number;
    contribution: number;
    notes?: string;
  }>;
  finalScore: number;
  rating?: string;
  evidenceIds?: number[];
  calculatedBy?: number;
  engineVersion?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(scoreCalculations).values({
    scoreId: data.scoreId,
    scoreType: data.scoreType as any,
    calculationTimestamp: new Date(),
    calculatedBy: data.calculatedBy || null,
    calculationEngineVersion: data.engineVersion || "v1.0.0",
    inputsSnapshot: data.inputs,
    weightsUsed: data.weights,
    contributions: data.contributions,
    evidenceIds: data.evidenceIds || [],
    finalScore: data.finalScore,
    rating: data.rating || null,
    isOverridden: false,
    overrideReason: null,
    overriddenBy: null,
    overriddenAt: null,
  });

  return Number(result[0].insertId);
}

/**
 * Get score decomposition (breakdown of how score was calculated)
 */
export async function getScoreDecomposition(
  scoreId: number,
  scoreType: string
) {
  const db = await getDb();
  if (!db) return null;

  const results = await db
    .select()
    .from(scoreCalculations)
    .where(eq(scoreCalculations.scoreId, scoreId))
    .orderBy(desc(scoreCalculations.calculationTimestamp))
    .limit(1);

  return results[0] || null;
}

/**
 * Get calculation history for a score
 */
export async function getCalculationHistory(
  scoreId: number,
  scoreType: string
) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(scoreCalculations)
    .where(eq(scoreCalculations.scoreId, scoreId))
    .orderBy(desc(scoreCalculations.calculationTimestamp));
}

/**
 * Record admin override of a score
 */
export async function recordScoreOverride(
  calculationId: number,
  overriddenBy: number,
  reason: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(scoreCalculations)
    .set({
      isOverridden: true,
      overrideReason: reason,
      overriddenBy: overriddenBy,
      overriddenAt: new Date(),
    })
    .where(eq(scoreCalculations.id, calculationId));
}

/**
 * Perform sensitivity analysis on a score
 * Returns how much the score would change if each input changed by ±10%
 */
export async function performSensitivityAnalysis(
  calculationId: number,
  inputs: Record<string, number>,
  recalculateFunction: (modifiedInputs: Record<string, number>) => number
): Promise<
  Array<{
    inputField: string;
    currentValue: number;
    deltaPlus10: number;
    deltaMinus10: number;
    sensitivityCoefficient: number;
    impactLevel: "low" | "medium" | "high" | "critical";
  }>
> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const results: Array<{
    inputField: string;
    currentValue: number;
    deltaPlus10: number;
    deltaMinus10: number;
    sensitivityCoefficient: number;
    impactLevel: "low" | "medium" | "high" | "critical";
  }> = [];

  const baseScore = recalculateFunction(inputs);

  for (const [field, value] of Object.entries(inputs)) {
    if (typeof value !== "number") continue;

    // Calculate score with +10% change
    const inputsPlus10 = { ...inputs, [field]: value * 1.1 };
    const scorePlus10 = recalculateFunction(inputsPlus10);
    const deltaPlus10 = scorePlus10 - baseScore;

    // Calculate score with -10% change
    const inputsMinus10 = { ...inputs, [field]: value * 0.9 };
    const scoreMinus10 = recalculateFunction(inputsMinus10);
    const deltaMinus10 = scoreMinus10 - baseScore;

    // Calculate sensitivity coefficient (average absolute change per 10% input change)
    const sensitivityCoefficient =
      (Math.abs(deltaPlus10) + Math.abs(deltaMinus10)) / 2;

    // Determine impact level
    let impactLevel: "low" | "medium" | "high" | "critical";
    if (sensitivityCoefficient < 2) impactLevel = "low";
    else if (sensitivityCoefficient < 5) impactLevel = "medium";
    else if (sensitivityCoefficient < 10) impactLevel = "high";
    else impactLevel = "critical";

    results.push({
      inputField: field,
      currentValue: value,
      deltaPlus10,
      deltaMinus10,
      sensitivityCoefficient,
      impactLevel,
    });

    // Store in database
    await db.insert(scoreSensitivityAnalysis).values({
      calculationId,
      inputField: field,
      currentValue: value.toString(),
      deltaPlus10,
      deltaMinus10,
      sensitivityCoefficient: Math.round(sensitivityCoefficient * 100),
      impactLevel,
    });
  }

  // Sort by sensitivity (most impactful first)
  return results.sort(
    (a, b) => b.sensitivityCoefficient - a.sensitivityCoefficient
  );
}

/**
 * Get sensitivity analysis for a calculation
 */
export async function getSensitivityAnalysis(calculationId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(scoreSensitivityAnalysis)
    .where(eq(scoreSensitivityAnalysis.calculationId, calculationId))
    .orderBy(desc(scoreSensitivityAnalysis.sensitivityCoefficient));
}

/**
 * Simulate score improvement
 * Calculates what changes are needed to reach a target rating
 */
export async function simulateScoreImprovement(data: {
  scoreId: number;
  scoreType: string;
  currentInputs: Record<string, any>;
  targetRating: string;
  targetScore: number;
  recalculateFunction: (inputs: Record<string, any>) => number;
  simulatedBy: number;
}): Promise<{
  requiredChanges: Array<{
    field: string;
    currentValue: any;
    targetValue: any;
    changePercent: number;
    difficulty: "easy" | "moderate" | "hard" | "very_hard";
  }>;
  feasibilityScore: number;
  estimatedTimelineDays: number;
  recommendations: string[];
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const currentScore = data.recalculateFunction(data.currentInputs);
  const scoreGap = data.targetScore - currentScore;

  if (scoreGap <= 0) {
    return {
      requiredChanges: [],
      feasibilityScore: 100,
      estimatedTimelineDays: 0,
      recommendations: ["Target score already achieved"],
    };
  }

  // Identify which inputs have the most impact (use sensitivity analysis)
  const requiredChanges: Array<{
    field: string;
    currentValue: any;
    targetValue: any;
    changePercent: number;
    difficulty: "easy" | "moderate" | "hard" | "very_hard";
  }> = [];

  // Simple heuristic: increase each numeric input proportionally
  for (const [field, value] of Object.entries(data.currentInputs)) {
    if (typeof value !== "number") continue;

    // Calculate required increase (simplified)
    const requiredIncrease = (scoreGap / 10) * 1.5; // Rough estimate
    const targetValue = value + requiredIncrease;
    const changePercent = ((targetValue - value) / value) * 100;

    // Assess difficulty based on change magnitude
    let difficulty: "easy" | "moderate" | "hard" | "very_hard";
    if (changePercent < 10) difficulty = "easy";
    else if (changePercent < 25) difficulty = "moderate";
    else if (changePercent < 50) difficulty = "hard";
    else difficulty = "very_hard";

    requiredChanges.push({
      field,
      currentValue: value,
      targetValue,
      changePercent,
      difficulty,
    });
  }

  // Calculate feasibility score
  const avgDifficulty =
    requiredChanges.reduce((sum, c) => {
      const difficultyScore = {
        easy: 100,
        moderate: 70,
        hard: 40,
        very_hard: 20,
      }[c.difficulty];
      return sum + difficultyScore;
    }, 0) / requiredChanges.length;

  const feasibilityScore = Math.round(avgDifficulty);

  // Estimate timeline based on difficulty
  const estimatedTimelineDays = Math.round(
    requiredChanges.reduce((sum, c) => {
      const days = { easy: 30, moderate: 90, hard: 180, very_hard: 365 }[
        c.difficulty
      ];
      return sum + days;
    }, 0) / requiredChanges.length
  );

  // Generate recommendations
  const recommendations: string[] = [];
  const easiestChanges = requiredChanges
    .filter(c => c.difficulty === "easy" || c.difficulty === "moderate")
    .slice(0, 3);

  for (const change of easiestChanges) {
    recommendations.push(
      `Focus on improving ${change.field} by ${Math.round(change.changePercent)}% (${change.difficulty} difficulty)`
    );
  }

  if (feasibilityScore < 50) {
    recommendations.push(
      "Consider a longer-term improvement plan with incremental milestones"
    );
  }

  // Store simulation
  await db.insert(scoreImprovementSimulations).values({
    scoreId: data.scoreId,
    scoreType: data.scoreType as any,
    simulationDate: new Date(),
    targetRating: data.targetRating,
    requiredChanges,
    feasibilityScore,
    estimatedTimelineDays,
    estimatedCost: null,
    recommendations,
    simulatedBy: data.simulatedBy,
  });

  return {
    requiredChanges,
    feasibilityScore,
    estimatedTimelineDays,
    recommendations,
  };
}

/**
 * Get improvement simulations for a score
 */
export async function getImprovementSimulations(scoreId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(scoreImprovementSimulations)
    .where(eq(scoreImprovementSimulations.scoreId, scoreId))
    .orderBy(desc(scoreImprovementSimulations.simulationDate));
}

/**
 * Check for score consistency issues
 * Identifies contradictions or anomalies in score inputs
 */
export function checkScoreConsistency(
  inputs: Record<string, any>,
  contributions: Array<{
    component: string;
    inputValue: any;
    contribution: number;
  }>
): Array<{
  type: "warning" | "error";
  message: string;
  affectedFields: string[];
}> {
  const issues: Array<{
    type: "warning" | "error";
    message: string;
    affectedFields: string[];
  }> = [];

  // Check for missing critical inputs
  const criticalFields = [
    "annualCapacityTonnes",
    "abfiScore",
    "carbonIntensityValue",
  ];
  for (const field of criticalFields) {
    if (inputs[field] === null || inputs[field] === undefined) {
      issues.push({
        type: "warning",
        message: `Critical field '${field}' is missing`,
        affectedFields: [field],
      });
    }
  }

  // Check for zero contributions (inputs that don't affect score)
  const zeroContributions = contributions.filter(c => c.contribution === 0);
  if (zeroContributions.length > 0) {
    issues.push({
      type: "warning",
      message: `${zeroContributions.length} inputs have zero contribution to the score`,
      affectedFields: zeroContributions.map(c => c.component),
    });
  }

  // Check for negative values where they shouldn't exist
  const negativeFields = Object.entries(inputs).filter(
    ([key, value]) =>
      typeof value === "number" &&
      value < 0 &&
      (key.includes("Score") ||
        key.includes("Volume") ||
        key.includes("Capacity"))
  );

  if (negativeFields.length > 0) {
    issues.push({
      type: "error",
      message: "Negative values found in fields that should be positive",
      affectedFields: negativeFields.map(([key]) => key),
    });
  }

  return issues;
}
