import mysql from 'mysql2/promise';
import { randomBytes } from 'crypto';

// Database connection
const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🌱 Starting seed data generation...\n');

// Helper functions
const randomId = () => randomBytes(16).toString('hex');

function calculateABFIScore(sustainability, carbon, quality, reliability) {
  return Math.round((sustainability + carbon + quality + reliability) / 4);
}

function getRatingGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  return 'C-';
}

// 1. Create Supplier Users and Suppliers
console.log('Creating suppliers...');

const supplierCompanies = [
  { name: 'Wilmar Sugar Australia', state: 'QLD', type: 'Sugar Mill' },
  { name: 'MSF Sugar', state: 'QLD', type: 'Sugar Mill' },
  { name: 'GrainCorp', state: 'NSW', type: 'Grain Producer' },
  { name: 'CBH Group', state: 'WA', type: 'Grain Producer' },
  { name: 'Australian Sustainable Hardwoods', state: 'VIC', type: 'Forestry' },
  { name: 'Tallow Australia', state: 'QLD', type: 'Tallow Processor' },
  { name: 'Biodiesel Producers Ltd', state: 'NSW', type: 'UCO Collector' },
  { name: 'Green Waste Solutions', state: 'VIC', type: 'Waste Management' },
  { name: 'Pacific Bioenergy', state: 'WA', type: 'Biomass Supplier' },
  { name: 'Queensland Biogas', state: 'QLD', type: 'Biogas Producer' },
  { name: 'Southern Cross Biofuels', state: 'SA', type: 'Biofuel Producer' },
  { name: 'Tasmanian Forestry Products', state: 'TAS', type: 'Forestry' }
];

const supplierIds = [];

for (const company of supplierCompanies) {
  const supplierId = randomId();
  
  const [result] = await connection.execute(
    `INSERT INTO users (openId, name, role) VALUES (?, ?, ?)`,
    [`supplier_${company.name.toLowerCase().replace(/\s+/g, '_')}`, `${company.name} Manager`, 'user']
  );
  
  const userId = result.insertId;

  const city = company.state === 'QLD' ? 'Brisbane' :
               company.state === 'NSW' ? 'Sydney' :
               company.state === 'VIC' ? 'Melbourne' :
               company.state === 'WA' ? 'Perth' :
               company.state === 'SA' ? 'Adelaide' :
               company.state === 'TAS' ? 'Hobart' : 'Darwin';

  await connection.execute(
    `INSERT INTO suppliers (id, userId, companyName, abn, contactPerson, email, phone, address, city, state, postcode, country, businessType, yearsInOperation, certifications, verificationStatus, verifiedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      supplierId,
      userId,
      company.name,
      `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      `${company.name} Manager`,
      `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com.au`,
      `+61 400${Math.floor(100000 + Math.random() * 899999)}`,
      `${Math.floor(1 + Math.random() * 999)} Industrial Road`,
      city,
      company.state,
      `${Math.floor(1000 + Math.random() * 8999)}`,
      'Australia',
      company.type,
      Math.floor(10 + Math.random() * 40),
      'ISCC',
      'verified',
      new Date()
    ]
  );

  supplierIds.push({ supplierId, company });
}

console.log(`✅ Created ${supplierIds.length} suppliers\n`);

// 2. Create Buyer Users and Buyers
console.log('Creating buyers...');

const buyerCompanies = [
  'BP Australia',
  'Ampol',
  'Viva Energy',
  'Neste Australia',
  'Australian Renewable Fuels',
  'Clean Energy Partners',
  'Sustainable Fuels Australia'
];

const buyerIds = [];

for (const company of buyerCompanies) {
  const buyerId = randomId();
  
  const [result] = await connection.execute(
    `INSERT INTO users (openId, name, role) VALUES (?, ?, ?)`,
    [`buyer_${company.toLowerCase().replace(/\s+/g, '_')}`, `${company} Procurement`, 'user']
  );
  
  const userId = result.insertId;

  await connection.execute(
    `INSERT INTO buyers (id, userId, companyName, abn, contactPerson, email, phone, address, city, state, postcode, country, businessType, annualDemand, verificationStatus, verifiedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      buyerId,
      userId,
      company,
      `${Math.floor(10000000000 + Math.random() * 90000000000)}`,
      `${company} Procurement`,
      `procurement@${company.toLowerCase().replace(/\s+/g, '')}.com.au`,
      `+61 400${Math.floor(100000 + Math.random() * 899999)}`,
      `${Math.floor(1 + Math.random() * 999)} Corporate Drive`,
      ['Sydney', 'Melbourne', 'Brisbane'][Math.floor(Math.random() * 3)],
      ['NSW', 'VIC', 'QLD'][Math.floor(Math.random() * 3)],
      `${Math.floor(1000 + Math.random() * 8999)}`,
      'Australia',
      'Biofuel Producer',
      Math.floor(50000 + Math.random() * 450000),
      'verified',
      new Date()
    ]
  );

  buyerIds.push({ buyerId, company });
}

console.log(`✅ Created ${buyerIds.length} buyers\n`);

// 3. Create Feedstocks
console.log('Creating feedstocks...');

const feedstockTemplates = [
  { category: 'Sugar Cane Bagasse', description: 'High-quality bagasse from sugar milling operations', minPrice: 50, maxPrice: 80 },
  { category: 'Wheat Straw', description: 'Agricultural residue from wheat harvesting', minPrice: 35, maxPrice: 60 },
  { category: 'Wood Chips', description: 'Sustainably sourced hardwood chips', minPrice: 60, maxPrice: 90 },
  { category: 'Tallow (Category 1)', description: 'Premium grade animal tallow', minPrice: 900, maxPrice: 1100 },
  { category: 'Used Cooking Oil', description: 'Collected and filtered UCO', minPrice: 700, maxPrice: 900 },
  { category: 'Municipal Solid Waste', description: 'Sorted organic fraction', minPrice: 30, maxPrice: 45 },
  { category: 'Forestry Residue', description: 'Logging and sawmill residues', minPrice: 45, maxPrice: 70 }
];

let feedstockCount = 0;
const feedstockIds = [];

for (const supplier of supplierIds) {
  const numFeedstocks = Math.floor(2 + Math.random() * 3); // 2-4 feedstocks per supplier
  
  for (let i = 0; i < numFeedstocks; i++) {
    const template = feedstockTemplates[Math.floor(Math.random() * feedstockTemplates.length)];
    const feedstockId = randomId();
    
    // Generate ABFI scores
    const sustainability = Math.floor(75 + Math.random() * 25); // 75-100
    const carbon = Math.floor(70 + Math.random() * 30); // 70-100
    const quality = Math.floor(75 + Math.random() * 25); // 75-100
    const reliability = Math.floor(80 + Math.random() * 20); // 80-100
    const abfiScore = calculateABFIScore(sustainability, carbon, quality, reliability);
    
    await connection.execute(
      `INSERT INTO feedstocks (id, supplierId, name, category, description, quantityAvailable, unit, pricePerUnit, location, harvestSeason, moistureContent, carbonIntensity, certifications, sustainabilityScore, carbonScore, qualityScore, reliabilityScore, abfiScore, abfiGrade, status, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        feedstockId,
        supplier.supplierId,
        `${template.category} - ${supplier.company.name}`,
        template.category,
        template.description,
        Math.floor(1000 + Math.random() * 49000), // 1000-50000 MT
        'MT',
        Math.floor(template.minPrice + Math.random() * (template.maxPrice - template.minPrice)),
        supplier.company.state,
        ['Year-round', 'Summer', 'Winter'][Math.floor(Math.random() * 3)],
        Math.floor(10 + Math.random() * 20), // 10-30%
        Math.floor(20 + Math.random() * 60), // 20-80 gCO2e/MJ
        JSON.stringify(['ISCC']),
        sustainability,
        carbon,
        quality,
        reliability,
        abfiScore,
        getRatingGrade(abfiScore),
        'active',
        new Date()
      ]
    );
    
    feedstockIds.push(feedstockId);
    feedstockCount++;
  }
}

console.log(`✅ Created ${feedstockCount} feedstocks\n`);

// 4. Create Inquiries
console.log('Creating inquiries...');

const inquiryCount = Math.min(15, feedstockCount);

for (let i = 0; i < inquiryCount; i++) {
  const feedstockId = feedstockIds[Math.floor(Math.random() * feedstockIds.length)];
  const buyer = buyerIds[Math.floor(Math.random() * buyerIds.length)];
  const inquiryId = randomId();
  
  const statuses = ['pending', 'responded', 'accepted'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  await connection.execute(
    `INSERT INTO inquiries (id, feedstockId, buyerId, message, status, createdAt, respondedAt) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      inquiryId,
      feedstockId,
      buyer.buyerId,
      `We are interested in purchasing ${Math.floor(500 + Math.random() * 4500)} MT. Please provide pricing and delivery terms.`,
      status,
      new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status !== 'pending' ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : null
    ]
  );
}

console.log(`✅ Created ${inquiryCount} inquiries\n`);

console.log('🎉 Seed data generation complete!\n');
console.log('Summary:');
console.log(`- ${supplierIds.length} suppliers`);
console.log(`- ${buyerIds.length} buyers`);
console.log(`- ${feedstockCount} feedstocks`);
console.log(`- ${inquiryCount} inquiries`);

await connection.end();
