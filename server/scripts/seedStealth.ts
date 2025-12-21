/**
 * Seed Script for Stealth Discovery
 * Run with: npx tsx server/scripts/seedStealth.ts
 *
 * This script runs all data connectors and populates the database
 * with real data from Australian government sources.
 */

import "dotenv/config";
import { runAllConnectors } from "../connectors";
import { processSignals } from "../services/entityResolution";
import { recalculateAllScores } from "../services/signalScoring";

async function main() {
  console.log("=".repeat(60));
  console.log("ABFI Stealth Discovery - Data Seeding Script");
  console.log("=".repeat(60));
  console.log();

  const since = new Date();
  since.setDate(since.getDate() - 90); // Last 90 days

  console.log(`Fetching signals since: ${since.toISOString()}`);
  console.log();

  try {
    // Run all connectors
    console.log("Running data connectors...");
    const result = await runAllConnectors(since);

    console.log();
    console.log("Connector Results:");
    console.log("-".repeat(40));

    let totalSignals = 0;
    let totalEntitiesCreated = 0;
    let totalEntitiesUpdated = 0;

    for (const [name, connectorResult] of Object.entries(result.results)) {
      console.log(`  ${name}:`);
      console.log(`    Signals: ${connectorResult.signalsDiscovered}`);
      console.log(`    Success: ${connectorResult.success}`);
      if (connectorResult.errors.length > 0) {
        console.log(`    Errors: ${connectorResult.errors.join(", ")}`);
      }
      console.log(`    Duration: ${connectorResult.duration}ms`);
      console.log();

      // Process signals for this connector
      if (connectorResult.signals.length > 0) {
        console.log(`    Processing ${connectorResult.signals.length} signals...`);
        const processed = await processSignals(connectorResult.signals, name);
        console.log(`    Entities created: ${processed.entitiesCreated}`);
        console.log(`    Entities updated: ${processed.entitiesUpdated}`);
        console.log(`    Signals stored: ${processed.signalsStored}`);
        if (processed.errors.length > 0) {
          console.log(`    Processing errors: ${processed.errors.length}`);
        }
        console.log();

        totalSignals += connectorResult.signalsDiscovered;
        totalEntitiesCreated += processed.entitiesCreated;
        totalEntitiesUpdated += processed.entitiesUpdated;
      }
    }

    console.log("=".repeat(40));
    console.log("Summary:");
    console.log(`  Total signals discovered: ${totalSignals}`);
    console.log(`  Total entities created: ${totalEntitiesCreated}`);
    console.log(`  Total entities updated: ${totalEntitiesUpdated}`);
    console.log();

    // Recalculate scores
    console.log("Recalculating entity scores...");
    const scoreResult = await recalculateAllScores();
    console.log(`  Entities scored: ${scoreResult.updated}`);
    if (scoreResult.errors.length > 0) {
      console.log(`  Scoring errors: ${scoreResult.errors.length}`);
    }

    console.log();
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
