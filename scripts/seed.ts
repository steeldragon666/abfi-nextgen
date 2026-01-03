/**
 * Comprehensive Seed Data Script
 * Populates the ABFI platform with realistic Australian bioenergy data
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local for database connection
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { getDb } from "../server/db";
import { sql } from "drizzle-orm";
import {
  users,
  suppliers,
  buyers,
  feedstocks,
  certificates,
  qualityTests,
  inquiries,
  properties,
  productionHistory,
  carbonPractices,
  existingContracts,
  marketplaceListings,
  projects,
  supplyAgreements,
  growerQualifications,
  bankabilityAssessments,
  lenderAccess,
  stressTestResults,
  stressScenarios,
  covenantMonitoring,
} from "../drizzle/schema";

async function seed() {
  console.log("🌱 Starting seed data generation...");

  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Clear existing data (in reverse dependency order)
  console.log("🗑️  Clearing existing data...");
  await db.delete(stressTestResults);
  await db.delete(stressScenarios);
  await db.delete(covenantMonitoring);
  await db.delete(bankabilityAssessments);
  await db.delete(lenderAccess);
  await db.delete(growerQualifications);
  await db.delete(supplyAgreements);
  await db.delete(projects);
  await db.delete(marketplaceListings);
  await db.delete(existingContracts);
  await db.delete(carbonPractices);
  await db.delete(productionHistory);
  await db.delete(properties);
  await db.delete(inquiries);
  await db.delete(qualityTests);
  await db.delete(certificates);
  await db.delete(feedstocks);
  await db.delete(buyers);
  await db.delete(suppliers);
  await db.delete(users).where(sql`role != 'admin'`); // Keep admin users

  // 1. Create Supplier Users & Profiles
  console.log("👥 Creating suppliers...");

  const supplierData = [
    {
      email: "contact@canefarmers.com.au",
      name: "Queensland Cane Farmers Co-op",
      role: "supplier",
      abn: "12345678901",
      companyName: "Queensland Cane Farmers Co-op",
      location: "Mackay, QLD",
      feedstockTypes: ["sugarcane_bagasse"],
      verificationStatus: "verified",
      rating: 4.8,
    },
    {
      email: "info@graingrowers.com.au",
      name: "NSW Grain Growers Association",
      role: "supplier",
      abn: "23456789012",
      companyName: "NSW Grain Growers Association",
      location: "Wagga Wagga, NSW",
      feedstockTypes: ["wheat_straw", "barley_straw"],
      verificationStatus: "verified",
      rating: 4.6,
    },
    {
      email: "sales@forestryresidues.com.au",
      name: "Victorian Forestry Residues Pty Ltd",
      role: "supplier",
      abn: "34567890123",
      companyName: "Victorian Forestry Residues Pty Ltd",
      location: "Gippsland, VIC",
      feedstockTypes: ["wood_chips", "sawdust"],
      verificationStatus: "verified",
      rating: 4.7,
    },
    {
      email: "contact@biowastemanagement.com.au",
      name: "SA Biowaste Management",
      role: "supplier",
      abn: "45678901234",
      companyName: "SA Biowaste Management",
      location: "Adelaide, SA",
      feedstockTypes: ["food_waste", "green_waste"],
      verificationStatus: "verified",
      rating: 4.5,
    },
    {
      email: "info@bambooaustralia.com.au",
      name: "Bamboo Australia Plantations",
      role: "supplier",
      abn: "56789012345",
      companyName: "Bamboo Australia Plantations",
      location: "Cairns, QLD",
      feedstockTypes: ["bamboo"],
      verificationStatus: "verified",
      rating: 4.9,
    },
  ];

  const supplierIds: number[] = [];

  for (const supplier of supplierData) {
    await db.insert(users).values({
      email: supplier.email,
      name: supplier.name,
      role: supplier.role as "supplier",
      openId: `seed_${supplier.email}`,
    });

    // Get the user ID
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${supplier.email}`);

    await db.insert(suppliers).values({
      userId: user.id,
      abn: supplier.abn,
      companyName: supplier.companyName,
      contactEmail: supplier.email,
      verificationStatus: supplier.verificationStatus as "verified",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the supplier ID
    const [supplierProfile] = await db
      .select()
      .from(suppliers)
      .where(sql`${suppliers.userId} = ${user.id}`);
    supplierIds.push(supplierProfile.id);
    console.log(`  ✓ Created supplier: ${supplier.companyName}`);
  }

  // 2. Create Buyer Users & Profiles
  console.log("🏭 Creating buyers...");

  const buyerData = [
    {
      email: "procurement@biofuelrefinery.com.au",
      name: "Australian Biofuel Refinery",
      role: "buyer",
      abn: "98765432101",
      companyName: "Australian Biofuel Refinery Pty Ltd",
      location: "Brisbane, QLD",
      facilityType: "Biofuel Refinery",
      annualCapacity: 150000,
    },
    {
      email: "supply@greenenergyplant.com.au",
      name: "Green Energy Power Plant",
      role: "buyer",
      abn: "87654321012",
      companyName: "Green Energy Power Plant Ltd",
      location: "Newcastle, NSW",
      facilityType: "Biomass Power Plant",
      annualCapacity: 200000,
    },
    {
      email: "sourcing@biogasfacility.com.au",
      name: "Victoria Biogas Facility",
      role: "buyer",
      abn: "76543210123",
      companyName: "Victoria Biogas Facility Pty Ltd",
      location: "Melbourne, VIC",
      facilityType: "Biogas Plant",
      annualCapacity: 80000,
    },
  ];

  const buyerIds: number[] = [];

  for (const buyer of buyerData) {
    await db.insert(users).values({
      email: buyer.email,
      name: buyer.name,
      role: buyer.role as "buyer",
      openId: `seed_${buyer.email}`,
    });

    // Get the user ID
    const [user] = await db
      .select()
      .from(users)
      .where(sql`${users.email} = ${buyer.email}`);

    await db.insert(buyers).values({
      userId: user.id,
      abn: buyer.abn,
      companyName: buyer.companyName,
      contactEmail: buyer.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the buyer ID
    const [buyerProfile] = await db
      .select()
      .from(buyers)
      .where(sql`${buyers.userId} = ${user.id}`);
    buyerIds.push(buyerProfile.id);
    console.log(`  ✓ Created buyer: ${buyer.companyName}`);
  }

  // 3. Create Feedstock Listings
  console.log("🌾 Creating feedstock listings...");

  const feedstockData = [
    {
      supplierId: supplierIds[0],
      category: "agricultural",
      type: "sugarcane_bagasse",
      availableQuantity: 50000,
      unit: "tonnes",
      location: "Mackay, QLD",
      sustainabilityScore: 85,
      carbonIntensity: 12.5,
      qualityScore: 90,
      reliabilityScore: 88,
      status: "active",
    },
    {
      supplierId: supplierIds[1],
      category: "agricultural",
      type: "wheat_straw",
      availableQuantity: 30000,
      unit: "tonnes",
      location: "Wagga Wagga, NSW",
      sustainabilityScore: 80,
      carbonIntensity: 15.2,
      qualityScore: 85,
      reliabilityScore: 82,
      status: "active",
    },
    {
      supplierId: supplierIds[2],
      category: "forestry",
      type: "wood_chips",
      availableQuantity: 75000,
      unit: "tonnes",
      location: "Gippsland, VIC",
      sustainabilityScore: 78,
      carbonIntensity: 18.3,
      qualityScore: 88,
      reliabilityScore: 90,
      status: "active",
    },
    {
      supplierId: supplierIds[3],
      category: "waste",
      type: "food_waste",
      availableQuantity: 20000,
      unit: "tonnes",
      location: "Adelaide, SA",
      sustainabilityScore: 92,
      carbonIntensity: 8.7,
      qualityScore: 75,
      reliabilityScore: 80,
      status: "active",
    },
    {
      supplierId: supplierIds[4],
      category: "energy_crops",
      type: "bamboo",
      availableQuantity: 15000,
      unit: "tonnes",
      location: "Cairns, QLD",
      sustainabilityScore: 95,
      carbonIntensity: 6.2,
      qualityScore: 92,
      reliabilityScore: 85,
      status: "active",
    },
  ];

  const feedstockIds: number[] = [];

  for (const feedstock of feedstockData) {
    await db.insert(feedstocks).values({
      ...feedstock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the feedstock ID
    const [listing] = await db
      .select()
      .from(feedstocks)
      .where(
        sql`${feedstocks.supplierId} = ${feedstock.supplierId} AND ${feedstocks.type} = ${feedstock.type}`
      );
    feedstockIds.push(listing.id);
    console.log(
      `  ✓ Created feedstock: ${feedstock.type} (${feedstock.availableQuantity} ${feedstock.unit})`
    );
  }

  // 4. Create Sample Inquiries
  console.log("📧 Creating inquiries...");

  for (let i = 0; i < 5; i++) {
    await db.insert(inquiries).values({
      feedstockId: feedstockIds[i],
      buyerId: buyerIds[i % buyerIds.length],
      message: `Interested in purchasing ${feedstockData[i].type}. Please provide pricing and delivery terms.`,
      status: i % 3 === 0 ? "pending" : i % 3 === 1 ? "responded" : "closed",
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ), // Random date within last 30 days
    });
  }

  console.log(`  ✓ Created 5 sample inquiries`);

  // 5. Create Bioenergy Projects
  console.log("🏗️  Creating bioenergy projects...");

  const projectData = [
    {
      name: "Brisbane SAF Production Facility",
      location: "Brisbane, QLD",
      feedstockType: "sugarcane_bagasse",
      annualFeedstockVolume: 100000,
      status: "operational",
      tier1Target: 80,
      tier2Target: 15,
    },
    {
      name: "Newcastle Biomass Power Plant",
      location: "Newcastle, NSW",
      feedstockType: "wheat_straw",
      annualFeedstockVolume: 75000,
      status: "construction",
      tier1Target: 85,
      tier2Target: 10,
    },
  ];

  const projectIds: number[] = [];

  for (const project of projectData) {
    await db.insert(projects).values({
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the project ID
    const [proj] = await db
      .select()
      .from(projects)
      .where(sql`${projects.name} = ${project.name}`);
    projectIds.push(proj.id);
    console.log(`  ✓ Created project: ${project.name}`);
  }

  // 6. Create Supply Agreements for Projects
  console.log("📋 Creating supply agreements...");

  const now = new Date();
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  const fiveYearsFromNow = new Date(now.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

  // Brisbane SAF Facility supply agreements
  await db.insert(supplyAgreements).values([
    // Tier 1 - 60% of 100,000 = 60,000 tonnes (from Cane Farmers)
    {
      projectId: projectIds[0],
      supplierId: supplierIds[0], // Queensland Cane Farmers
      tier: "tier1",
      annualVolume: 60000,
      flexBandPercent: 10,
      startDate: oneYearAgo,
      endDate: fiveYearsFromNow,
      termYears: 6,
      pricingMechanism: "fixed_with_escalation",
      basePrice: 8500, // $85/tonne in cents
      escalationRate: "CPI+1%",
      takeOrPayPercent: 90,
      deliverOrPayPercent: 90,
    },
    // Tier 1 - 20% of 100,000 = 20,000 tonnes (from Forestry)
    {
      projectId: projectIds[0],
      supplierId: supplierIds[2], // Victorian Forestry
      tier: "tier1",
      annualVolume: 20000,
      flexBandPercent: 15,
      startDate: oneYearAgo,
      endDate: fiveYearsFromNow,
      termYears: 6,
      pricingMechanism: "fixed",
      basePrice: 9200, // $92/tonne
      takeOrPayPercent: 85,
      deliverOrPayPercent: 85,
    },
    // Tier 2 - 15% of 100,000 = 15,000 tonnes (from Grain Growers)
    {
      projectId: projectIds[0],
      supplierId: supplierIds[1], // NSW Grain Growers
      tier: "tier2",
      annualVolume: 15000,
      flexBandPercent: 20,
      startDate: oneYearAgo,
      endDate: fiveYearsFromNow,
      termYears: 6,
      pricingMechanism: "index_linked",
      basePrice: 7800, // $78/tonne
      escalationRate: "CPI",
      takeOrPayPercent: 70,
      deliverOrPayPercent: 70,
    },
  ]);
  console.log(`  ✓ Created 3 supply agreements for Brisbane SAF Facility`);

  // Newcastle Biomass Power Plant supply agreements
  await db.insert(supplyAgreements).values([
    // Tier 1 - 50% of 75,000 = 37,500 tonnes
    {
      projectId: projectIds[1],
      supplierId: supplierIds[1], // NSW Grain Growers
      tier: "tier1",
      annualVolume: 37500,
      flexBandPercent: 10,
      startDate: oneYearAgo,
      endDate: fiveYearsFromNow,
      termYears: 6,
      pricingMechanism: "fixed_with_escalation",
      basePrice: 7500, // $75/tonne
      escalationRate: "CPI+0.5%",
      takeOrPayPercent: 90,
      deliverOrPayPercent: 90,
    },
    // Tier 2 - 25% of 75,000 = 18,750 tonnes
    {
      projectId: projectIds[1],
      supplierId: supplierIds[2], // Victorian Forestry
      tier: "tier2",
      annualVolume: 18750,
      flexBandPercent: 15,
      startDate: oneYearAgo,
      endDate: fiveYearsFromNow,
      termYears: 6,
      pricingMechanism: "index_linked",
      basePrice: 8000, // $80/tonne
      takeOrPayPercent: 75,
      deliverOrPayPercent: 75,
    },
    // Option - 10,000 tonnes
    {
      projectId: projectIds[1],
      supplierId: supplierIds[4], // Bamboo Australia
      tier: "option",
      annualVolume: 10000,
      startDate: oneYearAgo,
      endDate: fiveYearsFromNow,
      termYears: 6,
      pricingMechanism: "fixed",
      strikePrice: 9500, // $95/tonne strike
      optionFeePercent: 5,
      exerciseWindowDays: 60,
    },
  ]);
  console.log(`  ✓ Created 3 supply agreements for Newcastle Biomass Power Plant`);

  // 7. Create Lender Access for Projects
  console.log("🏦 Creating lender access...");

  // Get Alice (admin user) for grantedBy
  const [adminUser] = await db
    .select()
    .from(users)
    .where(sql`${users.email} = 'alice@dev.local'`);

  if (adminUser) {
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    await db.insert(lenderAccess).values([
      {
        projectId: projectIds[0],
        lenderName: "Commonwealth Bank of Australia",
        lenderEmail: "alice@dev.local", // Use Alice's email so she can access
        lenderContact: "Project Finance Division",
        accessToken: "cba_brisbane_saf_" + Date.now().toString(36),
        grantedBy: adminUser.id,
        validFrom: now,
        validUntil: oneYearFromNow,
        status: "active",
        canViewAgreements: true,
        canViewAssessments: true,
        canViewCovenants: true,
        canDownloadReports: true,
      },
      {
        projectId: projectIds[1],
        lenderName: "National Australia Bank",
        lenderEmail: "alice@dev.local", // Also give Alice access to this one
        lenderContact: "Infrastructure Lending",
        accessToken: "nab_newcastle_bio_" + Date.now().toString(36),
        grantedBy: adminUser.id,
        validFrom: now,
        validUntil: oneYearFromNow,
        status: "active",
        canViewAgreements: true,
        canViewAssessments: true,
        canViewCovenants: true,
        canDownloadReports: true,
      },
    ]);
    console.log(`  ✓ Created 2 lender access records for Alice`);
  } else {
    console.log(`  ⚠ Admin user alice@dev.local not found, skipping lender access`);
  }

  // 8. Create Bankability Assessments for Projects
  console.log("📊 Creating bankability assessments...");

  await db.insert(bankabilityAssessments).values([
    {
      projectId: projectIds[0],
      overallScore: 78,
      tier1Coverage: 80, // 80,000 / 100,000 = 80%
      tier2Coverage: 15, // 15,000 / 100,000 = 15%
      optionsCoverage: 0,
      rofrCoverage: 0,
      averageContractTerm: 6,
      supplierConcentration: 35,
      priceStability: 82,
      volumeFlexibility: 12,
      assessmentDate: now,
      status: "current",
      recommendations: JSON.stringify([
        "Consider adding ROFR agreements for additional supply security",
        "Supplier concentration is within acceptable limits",
      ]),
    },
    {
      projectId: projectIds[1],
      overallScore: 68,
      tier1Coverage: 50, // 37,500 / 75,000 = 50%
      tier2Coverage: 25, // 18,750 / 75,000 = 25%
      optionsCoverage: 13.3, // 10,000 / 75,000 ≈ 13.3%
      rofrCoverage: 0,
      averageContractTerm: 6,
      supplierConcentration: 40,
      priceStability: 75,
      volumeFlexibility: 15,
      assessmentDate: now,
      status: "current",
      recommendations: JSON.stringify([
        "Tier 1 coverage below 80% target - increase firm commitments",
        "Consider converting options to tier 1 agreements",
      ]),
    },
  ]);
  console.log(`  ✓ Created 2 bankability assessments`);

  console.log("✅ Seed data generation complete!");
  console.log(`
📊 Summary:
  - ${supplierIds.length} suppliers created
  - ${buyerIds.length} buyers created
  - ${feedstockIds.length} feedstock listings created
  - 5 inquiries created
  - ${projectIds.length} bioenergy projects created
  - 6 supply agreements created
  - 2 lender access records created
  - 2 bankability assessments created
  `);
}

// Run seed script
seed()
  .then(() => {
    console.log("🎉 Seeding completed successfully");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
