/**
 * Seed script for ABFI platform
 * Populates database with realistic Australian bioenergy feedstock data
 * Uses direct database access for efficiency
 */

import { getDb } from "../server/db";
import { users, suppliers, buyers, feedstocks } from "../drizzle/schema";
import { like } from "drizzle-orm";

console.log("🌱 Starting ABFI seed data generation...\n");

async function seed() {
  const db = await getDb();

  try {
    // Clean up any existing seed data
    console.log("Cleaning up existing seed data...");
    await db.delete(users).where(like(users.openId, "seed-%"));
    console.log("✅ Cleanup complete\n");

    // Create supplier users
    console.log("Creating supplier users...");
    const supplierUsers = await Promise.all([
      db.insert(users).values({
        openId: "seed-supplier-1",
        name: "Mackay Sugar Limited",
        email: "operations@mackaysugar.com.au",
        role: "user",
      }),
      db.insert(users).values({
        openId: "seed-supplier-2",
        name: "Wilmar Sugar Australia",
        email: "contact@wilmarsug ar.com.au",
        role: "user",
      }),
      db.insert(users).values({
        openId: "seed-supplier-3",
        name: "GrainCorp Operations",
        email: "sales@graincorp.com.au",
        role: "user",
      }),
      db.insert(users).values({
        openId: "seed-supplier-4",
        name: "Australian Plantation Timber",
        email: "info@aptimber.com.au",
        role: "user",
      }),
      db.insert(users).values({
        openId: "seed-supplier-5",
        name: "Riverina BioEnergy",
        email: "contact@riverbio.com.au",
        role: "user",
      }),
    ]);

    console.log(`✅ Created ${supplierUsers.length} supplier users\n`);

    // Create buyer users
    console.log("Creating buyer users...");
    const buyerUsers = await Promise.all([
      db.insert(users).values({
        openId: "seed-buyer-1",
        name: "Viva Energy Australia",
        email: "procurement@vivaenergy.com.au",
        role: "user",
      }),
      db.insert(users).values({
        openId: "seed-buyer-2",
        name: "Origin Energy",
        email: "renewables@originenergy.com.au",
        role: "user",
      }),
      db.insert(users).values({
        openId: "seed-buyer-3",
        name: "AGL Energy",
        email: "biofuels@agl.com.au",
        role: "user",
      }),
    ]);

    console.log(`✅ Created ${buyerUsers.length} buyer users\n`);

    // Get inserted user IDs
    const [supplierIds, buyerIds] = await Promise.all([
      db
        .select({ id: users.id })
        .from(users)
        .where(like(users.openId, "seed-supplier-%")),
      db
        .select({ id: users.id })
        .from(users)
        .where(like(users.openId, "seed-buyer-%")),
    ]);

    // Create suppliers
    console.log("Creating suppliers...");
    await Promise.all([
      db.insert(suppliers).values({
        userId: supplierIds[0].id,
        abn: "12345678901",
        companyName: "Mackay Sugar Limited",
        contactEmail: "operations@mackaysugar.com.au",
        contactPhone: "+61 7 4963 2000",
        addressLine1: "Racecourse Mill, Racecourse Road",
        city: "Mackay",
        state: "QLD",
        postcode: "4740",
        latitude: "-21.1417",
        longitude: "149.1858",
        verificationStatus: "verified",
        subscriptionTier: "professional",
        description:
          "Leading sugar producer in Queensland with extensive cane crushing operations and bagasse co-generation facilities.",
        website: "https://www.mackaysugar.com.au",
      }),
      db.insert(suppliers).values({
        userId: supplierIds[1].id,
        abn: "23456789012",
        companyName: "Wilmar Sugar Australia",
        contactEmail: "contact@wilmarsugar.com.au",
        contactPhone: "+61 7 4776 8100",
        addressLine1: "Victoria Mill, Giru",
        city: "Townsville",
        state: "QLD",
        postcode: "4809",
        latitude: "-19.5167",
        longitude: "147.1000",
        verificationStatus: "verified",
        subscriptionTier: "enterprise",
        description:
          "Major integrated sugar and renewable energy producer with multiple mills across Queensland.",
        website: "https://www.wilmarsugar.com.au",
      }),
      db.insert(suppliers).values({
        userId: supplierIds[2].id,
        abn: "34567890123",
        companyName: "GrainCorp Operations",
        contactEmail: "sales@graincorp.com.au",
        contactPhone: "+61 2 9325 9100",
        addressLine1: "Level 26, 175 Liverpool Street",
        city: "Sydney",
        state: "NSW",
        postcode: "2000",
        latitude: "-33.8688",
        longitude: "151.2093",
        verificationStatus: "verified",
        subscriptionTier: "professional",
        description:
          "Australia's largest grain handler with extensive wheat straw and stubble resources across NSW and Victoria.",
        website: "https://www.graincorp.com.au",
      }),
      db.insert(suppliers).values({
        userId: supplierIds[3].id,
        abn: "45678901234",
        companyName: "Australian Plantation Timber",
        contactEmail: "info@aptimber.com.au",
        contactPhone: "+61 3 5174 9300",
        addressLine1: "Plantation Road",
        city: "Sale",
        state: "VIC",
        postcode: "3850",
        latitude: "-38.1000",
        longitude: "147.0667",
        verificationStatus: "verified",
        subscriptionTier: "starter",
        description:
          "Sustainable forestry operations providing sawmill residues and wood chips for bioenergy applications.",
        website: "https://www.aptimber.com.au",
      }),
      db.insert(suppliers).values({
        userId: supplierIds[4].id,
        abn: "56789012345",
        companyName: "Riverina BioEnergy",
        contactEmail: "contact@riverbio.com.au",
        contactPhone: "+61 2 6921 2300",
        addressLine1: "Industrial Estate, Kidman Way",
        city: "Wagga Wagga",
        state: "NSW",
        postcode: "2650",
        latitude: "-35.1082",
        longitude: "147.3598",
        verificationStatus: "pending",
        subscriptionTier: "starter",
        description:
          "Regional biogas facility processing agricultural waste and organic materials from Riverina farms.",
        website: "https://www.riverbio.com.au",
      }),
    ]);

    console.log("✅ Created 5 suppliers\n");

    // Create buyers
    console.log("Creating buyers...");
    await Promise.all([
      db.insert(buyers).values({
        userId: buyerIds[0].id,
        companyName: "Viva Energy Australia",
        abn: "67890123456",
        contactEmail: "procurement@vivaenergy.com.au",
        contactPhone: "+61 3 9668 3000",
        addressLine1: "Level 5, 720 Bourke Street",
        city: "Docklands",
        state: "VIC",
        postcode: "3008",
        verificationStatus: "verified",
        description:
          "Major fuel distributor seeking sustainable biofuel feedstocks for renewable diesel production.",
        website: "https://www.vivaenergy.com.au",
      }),
      db.insert(buyers).values({
        userId: buyerIds[1].id,
        companyName: "Origin Energy",
        abn: "78901234567",
        contactEmail: "renewables@originenergy.com.au",
        contactPhone: "+61 2 8345 5000",
        addressLine1: "Level 32, Tower 1, 100 Barangaroo Avenue",
        city: "Sydney",
        state: "NSW",
        postcode: "2000",
        verificationStatus: "verified",
        description:
          "Leading energy retailer investing in biomass power generation and renewable energy projects.",
        website: "https://www.originenergy.com.au",
      }),
      db.insert(buyers).values({
        userId: buyerIds[2].id,
        companyName: "AGL Energy",
        abn: "89012345678",
        contactEmail: "biofuels@agl.com.au",
        contactPhone: "+61 3 8633 6000",
        addressLine1: "Level 24, 200 George Street",
        city: "Sydney",
        state: "NSW",
        postcode: "2000",
        verificationStatus: "verified",
        description:
          "Australia's largest electricity generator exploring biomass co-firing opportunities.",
        website: "https://www.agl.com.au",
      }),
    ]);

    console.log("✅ Created 3 buyers\n");

    // Get supplier IDs for feedstock creation
    const supplierRecords = await db
      .select({ id: suppliers.id, companyName: suppliers.companyName })
      .from(suppliers);

    // Create feedstocks with ABFI ratings
    console.log("Creating feedstocks with ABFI ratings...");

    const mackayId = supplierRecords.find(
      s => s.companyName === "Mackay Sugar Limited"
    )?.id;
    const wilmarId = supplierRecords.find(
      s => s.companyName === "Wilmar Sugar Australia"
    )?.id;
    const grainCorpId = supplierRecords.find(
      s => s.companyName === "GrainCorp Operations"
    )?.id;
    const aptId = supplierRecords.find(
      s => s.companyName === "Australian Plantation Timber"
    )?.id;
    const riverinaId = supplierRecords.find(
      s => s.companyName === "Riverina BioEnergy"
    )?.id;

    await Promise.all([
      // Mackay Sugar - Bagasse
      db.insert(feedstocks).values({
        supplierId: mackayId!,
        name: "Premium Sugarcane Bagasse",
        type: "Agricultural Residue",
        category: "Sugarcane Bagasse",
        description:
          "High-quality bagasse from modern crushing operations, suitable for co-generation and advanced biofuel production. Consistent moisture content and minimal contamination.",
        quantity: 250000,
        unit: "tonnes",
        pricePerUnit: 45.0,
        location: "Mackay, QLD",
        latitude: "-21.1417",
        longitude: "149.1858",
        availableFrom: new Date("2025-06-01"),
        availableUntil: new Date("2025-12-31"),
        moistureContent: 48.5,
        energyContent: 8.2,
        ashContent: 2.8,
        carbonContent: 45.2,
        certifications: JSON.stringify(["ISO 14001", "ISCC"]),
        sustainabilityScore: 88,
        carbonIntensity: 12.5,
        qualityGrade: "A",
        reliabilityScore: 92,
        abfiScore: 89,
        status: "available",
      }),
      // Wilmar - Bagasse
      db.insert(feedstocks).values({
        supplierId: wilmarId!,
        name: "Industrial Grade Bagasse",
        type: "Agricultural Residue",
        category: "Sugarcane Bagasse",
        description:
          "Bulk bagasse supply from Victoria Mill with established logistics chain. Ideal for large-scale biomass power generation.",
        quantity: 180000,
        unit: "tonnes",
        pricePerUnit: 42.0,
        location: "Townsville, QLD",
        latitude: "-19.5167",
        longitude: "147.1000",
        availableFrom: new Date("2025-07-01"),
        availableUntil: new Date("2026-01-31"),
        moistureContent: 50.0,
        energyContent: 7.9,
        ashContent: 3.2,
        carbonContent: 44.8,
        certifications: JSON.stringify(["ISCC", "Bonsucro"]),
        sustainabilityScore: 85,
        carbonIntensity: 14.2,
        qualityGrade: "B+",
        reliabilityScore: 90,
        abfiScore: 86,
        status: "available",
      }),
      // GrainCorp - Wheat Straw
      db.insert(feedstocks).values({
        supplierId: grainCorpId!,
        name: "NSW Wheat Straw Bales",
        type: "Agricultural Residue",
        category: "Cereal Straw",
        description:
          "Premium wheat straw from NSW grain belt. Baled and ready for transport. Excellent for cellulosic ethanol production.",
        quantity: 50000,
        unit: "tonnes",
        pricePerUnit: 85.0,
        location: "Wagga Wagga, NSW",
        latitude: "-35.1082",
        longitude: "147.3598",
        availableFrom: new Date("2025-03-01"),
        availableUntil: new Date("2025-09-30"),
        moistureContent: 12.0,
        energyContent: 15.2,
        ashContent: 5.8,
        carbonContent: 42.5,
        certifications: JSON.stringify(["RSB", "ISCC"]),
        sustainabilityScore: 82,
        carbonIntensity: 18.5,
        qualityGrade: "A",
        reliabilityScore: 85,
        abfiScore: 83,
        status: "available",
      }),
      // GrainCorp - Canola Stubble
      db.insert(feedstocks).values({
        supplierId: grainCorpId!,
        name: "Canola Stubble Residue",
        type: "Agricultural Residue",
        category: "Oilseed Residue",
        description:
          "Canola stubble from Victorian farms. Lower ash content than cereal straws, suitable for advanced conversion processes.",
        quantity: 30000,
        unit: "tonnes",
        pricePerUnit: 75.0,
        location: "Horsham, VIC",
        latitude: "-36.7178",
        longitude: "142.1992",
        availableFrom: new Date("2025-02-01"),
        availableUntil: new Date("2025-08-31"),
        moistureContent: 10.5,
        energyContent: 16.8,
        ashContent: 4.2,
        carbonContent: 44.0,
        certifications: JSON.stringify(["ISCC"]),
        sustainabilityScore: 80,
        carbonIntensity: 16.8,
        qualityGrade: "B+",
        reliabilityScore: 82,
        abfiScore: 81,
        status: "available",
      }),
      // APT - Wood Chips
      db.insert(feedstocks).values({
        supplierId: aptId!,
        name: "Plantation Pine Wood Chips",
        type: "Forestry Residue",
        category: "Wood Chips",
        description:
          "Clean wood chips from sustainable plantation pine. Low moisture, consistent size distribution. Ideal for biomass boilers.",
        quantity: 75000,
        unit: "tonnes",
        pricePerUnit: 95.0,
        location: "Sale, VIC",
        latitude: "-38.1000",
        longitude: "147.0667",
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        moistureContent: 25.0,
        energyContent: 18.5,
        ashContent: 1.2,
        carbonContent: 48.5,
        certifications: JSON.stringify(["FSC", "PEFC", "ISCC"]),
        sustainabilityScore: 90,
        carbonIntensity: 10.2,
        qualityGrade: "A+",
        reliabilityScore: 95,
        abfiScore: 91,
        status: "available",
      }),
      // APT - Sawdust
      db.insert(feedstocks).values({
        supplierId: aptId!,
        name: "Sawmill Sawdust",
        type: "Forestry Residue",
        category: "Sawdust",
        description:
          "Fine sawdust from sawmill operations. Suitable for pellet production or direct combustion in specialized boilers.",
        quantity: 20000,
        unit: "tonnes",
        pricePerUnit: 55.0,
        location: "Sale, VIC",
        latitude: "-38.1000",
        longitude: "147.0667",
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        moistureContent: 18.0,
        energyContent: 17.2,
        ashContent: 0.8,
        carbonContent: 49.2,
        certifications: JSON.stringify(["FSC"]),
        sustainabilityScore: 87,
        carbonIntensity: 11.5,
        qualityGrade: "A",
        reliabilityScore: 88,
        abfiScore: 87,
        status: "available",
      }),
      // Riverina - Biogas Digestate
      db.insert(feedstocks).values({
        supplierId: riverinaId!,
        name: "Biogas Facility Digestate",
        type: "Organic Waste",
        category: "Digestate",
        description:
          "Nutrient-rich digestate from anaerobic digestion of agricultural waste. Excellent soil amendment with biofertilizer properties.",
        quantity: 15000,
        unit: "tonnes",
        pricePerUnit: 35.0,
        location: "Wagga Wagga, NSW",
        latitude: "-35.1082",
        longitude: "147.3598",
        availableFrom: new Date("2025-01-01"),
        availableUntil: new Date("2025-12-31"),
        moistureContent: 75.0,
        energyContent: 2.5,
        ashContent: 8.5,
        carbonContent: 12.0,
        certifications: JSON.stringify(["Organic Certified"]),
        sustainabilityScore: 78,
        carbonIntensity: 8.5,
        qualityGrade: "B",
        reliabilityScore: 75,
        abfiScore: 76,
        status: "available",
      }),
    ]);

    console.log("✅ Created 7 feedstocks with ABFI ratings\n");

    console.log("🎉 Seed data generation complete!\n");
    console.log("Summary:");
    console.log("- 8 users (5 suppliers + 3 buyers)");
    console.log("- 5 supplier companies");
    console.log("- 3 buyer companies");
    console.log("- 7 feedstock listings with ABFI scores\n");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("✅ Seeding completed successfully");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
