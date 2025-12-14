-- ============================================
-- ABFI Platform Seed Data
-- Run AFTER 00001_initial_schema.sql migration
-- ============================================

-- ============================================
-- 1. PROFILES (test data with NULL user_id)
-- ============================================

-- Insert test profiles (suppliers)
-- Note: user_id is NULL for seed data since there are no corresponding auth.users entries
-- In production, user_id would be set by the signup trigger to auth.users.id
INSERT INTO profiles (id, user_id, email, full_name, role, phone, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', NULL, 'operations@mackaysugar.com.au', 'James Mitchell', 'supplier', '+61 7 4963 2001', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', NULL, 'contact@wilmarsugar.com.au', 'Sarah Chen', 'supplier', '+61 7 4776 8101', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', NULL, 'biomass@graincorp.com.au', 'Michael Thompson', 'supplier', '+61 2 9325 9101', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', NULL, 'sales@aptimber.com.au', 'Emma Wilson', 'supplier', '+61 3 5174 9301', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', NULL, 'operations@nswforestry.com.au', 'David Brown', 'supplier', '+61 2 6581 1001', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', NULL, 'supply@sagrowers.com.au', 'Lisa Anderson', 'supplier', '+61 8 8531 2001', NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', NULL, 'feedstock@qldcanegrowers.com.au', 'Robert Taylor', 'supplier', '+61 7 3864 6001', NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', NULL, 'biowaste@cleanwaste.com.au', 'Jennifer Lee', 'supplier', '+61 3 9555 7001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert test profiles (buyers)
INSERT INTO profiles (id, user_id, email, full_name, role, phone, created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 'procurement@vivaenergy.com.au', 'Andrew Smith', 'buyer', '+61 3 9668 3001', NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 'biofuels@ampol.com.au', 'Rachel Green', 'buyer', '+61 2 9250 5001', NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 'renewables@originenergy.com.au', 'Mark Johnson', 'buyer', '+61 2 8345 5001', NOW(), NOW()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', NULL, 'saf@qantas.com.au', 'Kate Williams', 'buyer', '+61 2 9691 3001', NOW(), NOW()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', NULL, 'procurement@cleanergy.com.au', 'Peter Davis', 'buyer', '+61 7 3221 1001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert admin profile
INSERT INTO profiles (id, user_id, email, full_name, role, phone, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, 'admin@abfi.com.au', 'ABFI Admin', 'admin', '+61 2 9000 0001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. SUPPLIERS
-- ============================================

INSERT INTO suppliers (id, profile_id, abn, company_name, trading_name, contact_email, contact_phone, address_line1, address_line2, city, state, postcode, country, website, description, verification_status, subscription_tier, created_at, updated_at)
VALUES
  -- Mackay Sugar Limited
  ('s1111111-1111-1111-1111-111111111111', NULL,
   '12345678901', 'Mackay Sugar Limited', 'Mackay Sugar',
   'operations@mackaysugar.com.au', '+61 7 4963 2001',
   'Racecourse Mill, Racecourse Road', NULL, 'Mackay', 'QLD', '4740', 'Australia',
   'https://www.mackaysugar.com.au',
   'Leading sugar producer in Queensland with extensive cane crushing operations across Mackay region. Our mills produce over 750,000 tonnes of raw sugar annually and generate substantial bagasse for bioenergy applications. ISCC certified with strong sustainability credentials.',
   'verified', 'professional', NOW(), NOW()),

  -- Wilmar Sugar Australia
  ('s2222222-2222-2222-2222-222222222222', NULL,
   '23456789012', 'Wilmar Sugar Australia', 'Wilmar Sugar',
   'contact@wilmarsugar.com.au', '+61 7 4776 8101',
   'Victoria Mill Road', 'Herbert River District', 'Ingham', 'QLD', '4850', 'Australia',
   'https://www.wilmarsugar-anz.com',
   'Australia''s largest sugar milling company operating 8 mills across Queensland. Major producer of bagasse-based renewable energy with 120MW co-generation capacity. Bonsucro and ISCC certified supply chain.',
   'verified', 'enterprise', NOW(), NOW()),

  -- GrainCorp Operations
  ('s3333333-3333-3333-3333-333333333333', NULL,
   '34567890123', 'GrainCorp Operations Limited', 'GrainCorp',
   'biomass@graincorp.com.au', '+61 2 9325 9101',
   'Level 28, 175 Liverpool Street', NULL, 'Sydney', 'NSW', '2000', 'Australia',
   'https://www.graincorp.com.au',
   'Australia''s largest grain handler with access to substantial agricultural residues. Our network spans 280+ receival sites across NSW, Victoria and Queensland, providing reliable cereal straw and stubble feedstocks.',
   'verified', 'professional', NOW(), NOW()),

  -- Australian Plantation Timber
  ('s4444444-4444-4444-4444-444444444444', NULL,
   '45678901234', 'Australian Plantation Timber Pty Ltd', 'APT',
   'sales@aptimber.com.au', '+61 3 5174 9301',
   '45 Plantation Road', 'Gippsland Region', 'Sale', 'VIC', '3850', 'Australia',
   'https://www.aptimber.com.au',
   'Sustainable plantation forestry operation in Gippsland, Victoria. FSC and PEFC certified. Specializing in premium wood chips and sawmill residues for domestic and export bioenergy markets.',
   'verified', 'starter', NOW(), NOW()),

  -- NSW Forestry Corporation
  ('s5555555-5555-5555-5555-555555555555', NULL,
   '56789012345', 'Forestry Corporation of NSW', 'FCNSW',
   'operations@nswforestry.com.au', '+61 2 6581 1001',
   '121 King Street', NULL, 'Port Macquarie', 'NSW', '2444', 'Australia',
   'https://www.forestrycorporation.com.au',
   'State-owned forestry enterprise managing over 2 million hectares. Sustainable supply of plantation thinnings, harvesting residues and mill by-products. ISO 14001 environmental certification.',
   'verified', 'professional', NOW(), NOW()),

  -- SA Growers Cooperative
  ('s6666666-6666-6666-6666-666666666666', NULL,
   '67890123456', 'South Australian Growers Cooperative', 'SA Growers',
   'supply@sagrowers.com.au', '+61 8 8531 2001',
   '22 Murray Street', NULL, 'Murray Bridge', 'SA', '5253', 'Australia',
   'https://www.sagrowers.com.au',
   'Farmer cooperative representing 450+ grain producers across SA. Aggregating wheat straw, barley straw and canola stubble for bioenergy. Member of Australian Farm Institute sustainability program.',
   'verified', 'starter', NOW(), NOW()),

  -- QLD Cane Growers
  ('s7777777-7777-7777-7777-777777777777', NULL,
   '78901234567', 'Queensland Cane Growers Organisation', 'CANEGROWERS',
   'feedstock@qldcanegrowers.com.au', '+61 7 3864 6001',
   'Level 6, 100 Edward Street', NULL, 'Brisbane', 'QLD', '4000', 'Australia',
   'https://www.canegrowers.com.au',
   'Peak body representing 3,000+ cane farming businesses. Coordinating bagasse and cane trash supply for renewable energy projects. Strong focus on sustainable agriculture practices.',
   'verified', 'professional', NOW(), NOW()),

  -- Clean Waste Solutions
  ('s8888888-8888-8888-8888-888888888888', NULL,
   '89012345678', 'Clean Waste Solutions Pty Ltd', 'CleanWaste',
   'biowaste@cleanwaste.com.au', '+61 3 9555 7001',
   '150 Industrial Avenue', 'Dandenong South', 'Melbourne', 'VIC', '3175', 'Australia',
   'https://www.cleanwaste.com.au',
   'Leading organic waste processor in Victoria. Operating anaerobic digestion and composting facilities. Processing food waste, green waste and agricultural organics into biogas and soil amendments.',
   'verified', 'starter', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. BUYERS
-- ============================================

INSERT INTO buyers (id, profile_id, abn, company_name, trading_name, contact_email, contact_phone, address_line1, address_line2, city, state, postcode, country, facility_location, website, description, verification_status, subscription_tier, created_at, updated_at)
VALUES
  -- Viva Energy
  ('b1111111-1111-1111-1111-111111111111', NULL,
   '98765432101', 'Viva Energy Australia Pty Ltd', 'Viva Energy',
   'procurement@vivaenergy.com.au', '+61 3 9668 3001',
   'Refinery Road', 'Geelong Refinery', 'Geelong', 'VIC', '3220', 'Australia',
   ST_SetSRID(ST_MakePoint(144.3907, -38.1485), 4326),
   'https://www.vivaenergy.com.au',
   'Operating Australia''s largest oil refinery at Geelong. Investing in renewable diesel production capacity targeting 50% SAF blend by 2030. Seeking ISCC certified feedstocks.',
   'verified', 'enterprise', NOW(), NOW()),

  -- Ampol
  ('b2222222-2222-2222-2222-222222222222', NULL,
   '87654321012', 'Ampol Limited', 'Ampol',
   'biofuels@ampol.com.au', '+61 2 9250 5001',
   'Ampol Place, 29-33 Bourke Road', NULL, 'Alexandria', 'NSW', '2015', 'Australia',
   ST_SetSRID(ST_MakePoint(151.1943, -33.9083), 4326),
   'https://www.ampol.com.au',
   'Australia''s leading transport fuel supplier. Lytton Refinery in Brisbane developing advanced biofuels capability. Target: 10% sustainable aviation fuel production by 2028.',
   'verified', 'enterprise', NOW(), NOW()),

  -- Origin Energy
  ('b3333333-3333-3333-3333-333333333333', NULL,
   '76543210123', 'Origin Energy Limited', 'Origin',
   'renewables@originenergy.com.au', '+61 2 8345 5001',
   'Level 32, Tower 1', '100 Barangaroo Avenue', 'Sydney', 'NSW', '2000', 'Australia',
   ST_SetSRID(ST_MakePoint(151.2025, -33.8621), 4326),
   'https://www.originenergy.com.au',
   'Integrated energy company with renewable energy portfolio. Developing biomass co-firing at Eraring Power Station and exploring biogas-to-electricity projects across NSW.',
   'verified', 'professional', NOW(), NOW()),

  -- Qantas
  ('b4444444-4444-4444-4444-444444444444', NULL,
   '65432101234', 'Qantas Airways Limited', 'Qantas',
   'saf@qantas.com.au', '+61 2 9691 3001',
   '10 Bourke Road', 'Mascot', 'Sydney', 'NSW', '2020', 'Australia',
   ST_SetSRID(ST_MakePoint(151.1753, -33.9399), 4326),
   'https://www.qantas.com',
   'Australia''s flagship carrier committed to net zero by 2050. Partnering on domestic SAF production. Seeking CORSIA-eligible feedstocks with verified low carbon intensity.',
   'verified', 'enterprise', NOW(), NOW()),

  -- Cleanergy
  ('b5555555-5555-5555-5555-555555555555', NULL,
   '54321012345', 'Cleanergy Pty Ltd', 'Cleanergy',
   'procurement@cleanergy.com.au', '+61 7 3221 1001',
   'Level 12, 240 Queen Street', NULL, 'Brisbane', 'QLD', '4000', 'Australia',
   ST_SetSRID(ST_MakePoint(153.0260, -27.4705), 4326),
   'https://www.cleanergy.com.au',
   'Independent renewable fuels company developing Australia''s first commercial-scale renewable diesel refinery in Queensland. Planning 200ML annual capacity using domestic feedstocks.',
   'verified', 'professional', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. FEEDSTOCKS
-- ============================================

INSERT INTO feedstocks (id, feedstock_id, supplier_id, category, type, name, description, location, state, region, production_method, annual_capacity_tonnes, available_volume_current, price_indication, price_unit, abfi_score, sustainability_score, carbon_intensity_score, quality_score, reliability_score, carbon_intensity_value, status, verification_level, created_at, updated_at)
VALUES
  -- Mackay Sugar - Bagasse
  ('f1111111-1111-1111-1111-111111111111', 'ABFI-LIG-QLD-000001', 's1111111-1111-1111-1111-111111111111',
   'lignocellulosic', 'Sugarcane Bagasse', 'Premium Mackay Bagasse',
   'High-quality bagasse from Mackay Sugar mills. Consistent moisture content, low contamination. Suitable for co-generation, cellulosic ethanol, and pyrolysis applications. ISCC certified.',
   ST_SetSRID(ST_MakePoint(149.1858, -21.1417), 4326), 'QLD', 'Mackay-Whitsunday',
   'processing_byproduct', 280000, 180000, 45.00, 'AUD/tonne',
   89, 90, 85, 92, 88, 12.5, 'active', 'third_party_audited', NOW(), NOW()),

  -- Wilmar Sugar - Bagasse
  ('f2222222-2222-2222-2222-222222222222', 'ABFI-LIG-QLD-000002', 's2222222-2222-2222-2222-222222222222',
   'lignocellulosic', 'Sugarcane Bagasse', 'Wilmar Bulk Bagasse',
   'Industrial-grade bagasse from Victoria and Herbert mills. Large volumes available during crushing season (June-December). Bonsucro certified sustainable sugarcane.',
   ST_SetSRID(ST_MakePoint(146.1833, -18.6500), 4326), 'QLD', 'Herbert-Burdekin',
   'processing_byproduct', 350000, 220000, 42.00, 'AUD/tonne',
   86, 88, 82, 88, 90, 14.2, 'active', 'third_party_audited', NOW(), NOW()),

  -- GrainCorp - Wheat Straw
  ('f3333333-3333-3333-3333-333333333333', 'ABFI-LIG-NSW-000001', 's3333333-3333-3333-3333-333333333333',
   'lignocellulosic', 'Wheat Straw', 'NSW Grain Belt Wheat Straw',
   'Premium wheat straw bales from NSW grain belt. Harvested and baled with GPS tracking for full traceability. Low moisture, consistent quality. RSB certified.',
   ST_SetSRID(ST_MakePoint(146.0500, -34.2833), 4326), 'NSW', 'Riverina',
   'residue', 75000, 50000, 85.00, 'AUD/tonne',
   83, 82, 78, 88, 85, 18.5, 'active', 'document_verified', NOW(), NOW()),

  -- GrainCorp - Canola Stubble
  ('f4444444-4444-4444-4444-444444444444', 'ABFI-LIG-VIC-000001', 's3333333-3333-3333-3333-333333333333',
   'lignocellulosic', 'Canola Stubble', 'Victorian Canola Residue',
   'Canola stubble from Victorian Wimmera farms. Lower ash content than cereal straws. Suitable for advanced conversion processes. Available March-August post-harvest.',
   ST_SetSRID(ST_MakePoint(142.1992, -36.7178), 4326), 'VIC', 'Wimmera',
   'residue', 40000, 28000, 75.00, 'AUD/tonne',
   81, 80, 80, 84, 82, 16.8, 'active', 'document_verified', NOW(), NOW()),

  -- APT - Wood Chips
  ('f5555555-5555-5555-5555-555555555555', 'ABFI-LIG-VIC-000002', 's4444444-4444-4444-4444-444444444444',
   'lignocellulosic', 'Wood Chips', 'Gippsland Plantation Pine Chips',
   'Clean wood chips from FSC/PEFC certified plantation pine. Uniform chip size (30-50mm), low moisture. Ideal for biomass boilers and pellet production. Year-round availability.',
   ST_SetSRID(ST_MakePoint(147.0667, -38.1000), 4326), 'VIC', 'Gippsland',
   'processing_byproduct', 90000, 72000, 95.00, 'AUD/tonne',
   91, 92, 88, 94, 95, 10.2, 'active', 'abfi_certified', NOW(), NOW()),

  -- APT - Sawdust
  ('f6666666-6666-6666-6666-666666666666', 'ABFI-LIG-VIC-000003', 's4444444-4444-4444-4444-444444444444',
   'lignocellulosic', 'Sawdust', 'Softwood Sawmill Sawdust',
   'Fine sawdust from plantation softwood milling. Suitable for pellet production, animal bedding or direct combustion. Consistent supply from operational sawmill.',
   ST_SetSRID(ST_MakePoint(147.0667, -38.1000), 4326), 'VIC', 'Gippsland',
   'processing_byproduct', 25000, 18000, 55.00, 'AUD/tonne',
   87, 88, 86, 90, 88, 11.5, 'active', 'third_party_audited', NOW(), NOW()),

  -- FCNSW - Forest Residues
  ('f7777777-7777-7777-7777-777777777777', 'ABFI-LIG-NSW-000002', 's5555555-5555-5555-5555-555555555555',
   'lignocellulosic', 'Forest Residues', 'NSW Plantation Harvest Residues',
   'Mixed forestry residues from sustainable plantation operations. Includes logging slash, thinnings and processing residues. ISO 14001 certified operations.',
   ST_SetSRID(ST_MakePoint(152.9000, -31.4333), 4326), 'NSW', 'Mid North Coast',
   'residue', 60000, 42000, 65.00, 'AUD/tonne',
   79, 82, 75, 80, 78, 22.0, 'active', 'document_verified', NOW(), NOW()),

  -- SA Growers - Barley Straw
  ('f8888888-8888-8888-8888-888888888888', 'ABFI-LIG-SA-000001', 's6666666-6666-6666-6666-666666666666',
   'lignocellulosic', 'Barley Straw', 'Mallee Barley Straw Bales',
   'Quality barley straw from SA Mallee region. Baled at optimal moisture for long-term storage. Aggregated supply from cooperative members ensures reliability.',
   ST_SetSRID(ST_MakePoint(139.8333, -34.8500), 4326), 'SA', 'Murray-Mallee',
   'residue', 35000, 25000, 80.00, 'AUD/tonne',
   80, 78, 77, 84, 82, 19.2, 'active', 'document_verified', NOW(), NOW()),

  -- QLD Cane Growers - Cane Trash
  ('f9999999-9999-9999-9999-999999999999', 'ABFI-LIG-QLD-000003', 's7777777-7777-7777-7777-777777777777',
   'lignocellulosic', 'Cane Trash', 'Queensland Cane Tops & Trash',
   'Sugarcane harvest residues including tops and trash. Previously burnt, now collected for bioenergy. Significant soil carbon benefits from residue removal management.',
   ST_SetSRID(ST_MakePoint(147.1200, -19.4914), 4326), 'QLD', 'Burdekin',
   'residue', 45000, 32000, 35.00, 'AUD/tonne',
   77, 85, 72, 75, 76, 24.5, 'active', 'self_declared', NOW(), NOW()),

  -- CleanWaste - Food Waste
  ('fa000000-0000-0000-0000-000000000001', 'ABFI-WAS-VIC-000001', 's8888888-8888-8888-8888-888888888888',
   'waste', 'Food Waste', 'Melbourne Metro FOGO',
   'Source-separated food and garden organics from Melbourne metropolitan councils. Processed through modern AD facility. Consistent feedstock quality from established collection contracts.',
   ST_SetSRID(ST_MakePoint(145.1831, -38.0489), 4326), 'VIC', 'Greater Melbourne',
   'waste', 55000, 48000, 25.00, 'AUD/tonne',
   82, 90, 88, 75, 80, 8.5, 'active', 'document_verified', NOW(), NOW()),

  -- CleanWaste - UCO
  ('fa000000-0000-0000-0000-000000000002', 'ABFI-UCO-VIC-000001', 's8888888-8888-8888-8888-888888888888',
   'UCO', 'Used Cooking Oil', 'Metro Melbourne UCO Collection',
   'Restaurant and food service used cooking oil. Collected from 500+ venues across Melbourne. Tested for FFA and moisture content. ISCC mass balance certified.',
   ST_SetSRID(ST_MakePoint(144.9631, -37.8136), 4326), 'VIC', 'Greater Melbourne',
   'waste', 8000, 6500, 850.00, 'AUD/tonne',
   88, 92, 90, 85, 86, 6.5, 'active', 'third_party_audited', NOW(), NOW()),

  -- QLD Cane Growers - Tallow
  ('fa000000-0000-0000-0000-000000000003', 'ABFI-TAL-QLD-000001', 's7777777-7777-7777-7777-777777777777',
   'tallow', 'Tallow Category 3', 'Queensland Beef Tallow',
   'Food-grade beef tallow from QLD processing facilities. Category 3 (edible grade), suitable for premium biodiesel and SAF. Regular supply from major meatworks.',
   ST_SetSRID(ST_MakePoint(153.0912, -27.5598), 4326), 'QLD', 'South East Queensland',
   'processing_byproduct', 25000, 18000, 1100.00, 'AUD/tonne',
   85, 80, 88, 90, 88, 15.0, 'active', 'third_party_audited', NOW(), NOW()),

  -- GrainCorp - Canola Oil
  ('fa000000-0000-0000-0000-000000000004', 'ABFI-OIL-NSW-000001', 's3333333-3333-3333-3333-333333333333',
   'oilseed', 'Canola Oil', 'NSW Crush Canola Oil',
   'HEFA-grade canola oil from NSW crushing facilities. Meeting EU RED II sustainability criteria. ISCC certified with full chain of custody documentation.',
   ST_SetSRID(ST_MakePoint(147.3598, -35.1082), 4326), 'NSW', 'Riverina',
   'crop', 15000, 10000, 1450.00, 'AUD/tonne',
   84, 82, 85, 88, 86, 28.0, 'active', 'third_party_audited', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CERTIFICATES
-- ============================================

INSERT INTO certificates (id, feedstock_id, type, certificate_number, issuing_body, issued_date, expiry_date, status, created_at)
VALUES
  -- Mackay Sugar certs
  (gen_random_uuid(), 'f1111111-1111-1111-1111-111111111111', 'ISCC_EU', 'ISCC-EU-2024-0001234', 'ISCC System GmbH', '2024-01-15', '2025-01-14', 'active', NOW()),

  -- Wilmar certs
  (gen_random_uuid(), 'f2222222-2222-2222-2222-222222222222', 'ISCC_PLUS', 'ISCC-PLUS-2024-0002345', 'ISCC System GmbH', '2024-01-20', '2025-01-19', 'active', NOW()),

  -- GrainCorp certs
  (gen_random_uuid(), 'f3333333-3333-3333-3333-333333333333', 'RSB', 'RSB-2024-0567', 'Roundtable on Sustainable Biomaterials', '2024-04-01', '2025-03-31', 'active', NOW()),

  -- APT certs
  (gen_random_uuid(), 'f5555555-5555-5555-5555-555555555555', 'OTHER', 'FSC-C123456', 'Forest Stewardship Council', '2023-06-01', '2028-05-31', 'active', NOW()),
  (gen_random_uuid(), 'f5555555-5555-5555-5555-555555555555', 'ISCC_PLUS', 'ISCC-PLUS-2024-0003456', 'ISCC System GmbH', '2024-02-15', '2025-02-14', 'active', NOW()),

  -- UCO certs
  (gen_random_uuid(), 'fa000000-0000-0000-0000-000000000002', 'ISCC_EU', 'ISCC-EU-2024-0004567', 'ISCC System GmbH', '2024-03-01', '2025-02-28', 'active', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. QUALITY TESTS
-- ============================================

INSERT INTO quality_tests (id, feedstock_id, test_date, laboratory, report_number, parameters, created_at)
VALUES
  -- Mackay Bagasse tests
  (gen_random_uuid(), 'f1111111-1111-1111-1111-111111111111', '2024-11-01', 'ALS Environmental Brisbane', 'ALS-2024-001',
   '{"moisture_content": 48.5, "ash_content": 2.8, "energy_content_mj_kg": 8.2, "volatile_matter": 78.5, "fixed_carbon": 18.7}', NOW()),

  -- Wood Chips tests
  (gen_random_uuid(), 'f5555555-5555-5555-5555-555555555555', '2024-10-15', 'SGS Melbourne', 'SGS-2024-002',
   '{"moisture_content": 25.0, "ash_content": 1.2, "energy_content_mj_kg": 18.5, "volatile_matter": 82.5, "fixed_carbon": 16.3}', NOW()),

  -- UCO tests
  (gen_random_uuid(), 'fa000000-0000-0000-0000-000000000002', '2024-11-10', 'Intertek Melbourne', 'INT-2024-003',
   '{"moisture_content": 0.5, "ffa_content": 3.2, "miu": 0.8, "energy_content_mj_kg": 37.0}', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. SAMPLE INQUIRIES
-- ============================================

INSERT INTO inquiries (id, buyer_id, supplier_id, feedstock_id, subject, message, volume_required, delivery_location, delivery_date_start, delivery_date_end, status, created_at, updated_at)
VALUES
  -- Viva Energy inquiring about bagasse
  (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111',
   'Bagasse Supply for Geelong Renewable Diesel Project',
   'We are developing renewable diesel production at our Geelong refinery and are interested in securing long-term bagasse supply. Could you provide details on: 1) Available volumes for 2025-2027, 2) Delivered pricing to Geelong, 3) ISCC certification documentation. We anticipate requiring 50,000 tonnes annually.',
   50000, 'Geelong Refinery, VIC', '2025-06-01', '2025-12-31', 'pending', NOW(), NOW()),

  -- Qantas inquiring about UCO
  (gen_random_uuid(), 'b4444444-4444-4444-4444-444444444444', 's8888888-8888-8888-8888-888888888888', 'fa000000-0000-0000-0000-000000000002',
   'UCO Sourcing for SAF Production Partnership',
   'Qantas is partnering with a SAF producer and seeking ISCC-certified UCO feedstock. We require: 1) Volumes available for dedicated supply contract, 2) Carbon intensity documentation, 3) Collection logistics to Brisbane. Our partner facility will require consistent monthly deliveries.',
   5000, 'Brisbane Airport Fuel Facility', '2025-03-01', '2026-02-28', 'responded', NOW(), NOW()),

  -- Cleanergy inquiring about tallow
  (gen_random_uuid(), 'b5555555-5555-5555-5555-555555555555', 's7777777-7777-7777-7777-777777777777', 'fa000000-0000-0000-0000-000000000003',
   'Category 3 Tallow for Renewable Diesel Facility',
   'Cleanergy is commissioning a renewable diesel facility in Queensland and requires Category 3 tallow supply. Please advise on: 1) Annual supply capacity, 2) Pricing structure, 3) Quality specifications and consistency, 4) Delivery to Gladstone industrial area.',
   15000, 'Gladstone Industrial Estate, QLD', '2025-07-01', '2026-06-30', 'pending', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. SHORTLISTS
-- ============================================

INSERT INTO shortlists (id, buyer_id, feedstock_id, notes, created_at)
VALUES
  (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Priority feedstock for renewable diesel - good CI score', NOW()),
  (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', 'f2222222-2222-2222-2222-222222222222', 'Backup bagasse supply option', NOW()),
  (gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', 'fa000000-0000-0000-0000-000000000002', 'UCO for blending - excellent CI', NOW()),

  (gen_random_uuid(), 'b4444444-4444-4444-4444-444444444444', 'fa000000-0000-0000-0000-000000000002', 'Key UCO source for SAF project', NOW()),
  (gen_random_uuid(), 'b4444444-4444-4444-4444-444444444444', 'fa000000-0000-0000-0000-000000000003', 'Tallow option - good for CORSIA', NOW()),
  (gen_random_uuid(), 'b4444444-4444-4444-4444-444444444444', 'fa000000-0000-0000-0000-000000000004', 'Canola oil alternative', NOW()),

  (gen_random_uuid(), 'b3333333-3333-3333-3333-333333333333', 'f5555555-5555-5555-5555-555555555555', 'Wood chips for Eraring co-firing trial', NOW()),
  (gen_random_uuid(), 'b3333333-3333-3333-3333-333333333333', 'f7777777-7777-7777-7777-777777777777', 'Forest residues - cost competitive', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. NOTIFICATIONS
-- ============================================

INSERT INTO notifications (id, user_id, title, message, type, read, action_url, created_at)
VALUES
  (gen_random_uuid(), NULL, 'New Feedstock Match', 'A new bagasse listing matches your procurement criteria', 'system', false, '/buyer/search?category=lignocellulosic', NOW()),
  (gen_random_uuid(), NULL, 'New Inquiry Received', 'Viva Energy has submitted an inquiry for your bagasse', 'inquiry', false, '/supplier/inquiries', NOW()),
  (gen_random_uuid(), NULL, 'ISCC Certification Reminder', 'Your preferred feedstock UCO certification expires in 60 days', 'certificate', false, '/buyer/shortlist', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- SEED COMPLETE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ ABFI Seed Data Complete!';
  RAISE NOTICE 'Created:';
  RAISE NOTICE '  - 14 user profiles (8 suppliers, 5 buyers, 1 admin)';
  RAISE NOTICE '  - 8 supplier companies';
  RAISE NOTICE '  - 5 buyer companies';
  RAISE NOTICE '  - 14 feedstock listings with ABFI scores';
  RAISE NOTICE '  - 6 certificates';
  RAISE NOTICE '  - 3 quality test records';
  RAISE NOTICE '  - 3 sample inquiries';
  RAISE NOTICE '  - 8 shortlist entries';
  RAISE NOTICE '  - 3 notifications';
END $$;
