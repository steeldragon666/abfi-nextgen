-- ============================================
-- ABFI Platform Database Schema
-- Migration: 00001_initial_schema.sql
-- ============================================

-- ============================================
-- Step 1: Extensions and Enums
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('supplier', 'buyer', 'admin', 'auditor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'suspended', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('starter', 'professional', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE feedstock_status AS ENUM ('draft', 'pending_review', 'active', 'suspended', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verification_level AS ENUM ('self_declared', 'document_verified', 'third_party_audited', 'abfi_certified');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE feedstock_category AS ENUM ('oilseed', 'UCO', 'tallow', 'lignocellulosic', 'waste', 'algae', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE production_method AS ENUM ('crop', 'waste', 'residue', 'processing_byproduct');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE certification_type AS ENUM ('ISCC_EU', 'ISCC_PLUS', 'RSB', 'RED_II', 'GO', 'ABFI', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE certification_status AS ENUM ('active', 'expired', 'revoked', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE inquiry_status AS ENUM ('pending', 'responded', 'closed', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'disputed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE australian_state AS ENUM ('NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- Step 2: Extend existing public.profiles
-- ============================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'supplier';

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================
-- Step 3: Domain tables (reference profiles.user_id)
-- ============================================

-- Suppliers
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  abn TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  trading_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state australian_state NOT NULL,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Australia',
  website TEXT,
  description TEXT,
  logo_url TEXT,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  subscription_tier subscription_tier NOT NULL DEFAULT 'starter',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Buyers
CREATE TABLE IF NOT EXISTS public.buyers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  abn TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  trading_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state australian_state NOT NULL,
  postcode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Australia',
  facility_location GEOGRAPHY(POINT, 4326),
  website TEXT,
  description TEXT,
  logo_url TEXT,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  subscription_tier subscription_tier NOT NULL DEFAULT 'starter',
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feedstocks
CREATE TABLE IF NOT EXISTS public.feedstocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedstock_id TEXT NOT NULL UNIQUE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  category feedstock_category NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  state australian_state NOT NULL,
  region TEXT,
  production_method production_method NOT NULL,
  annual_capacity_tonnes NUMERIC NOT NULL,
  available_volume_current NUMERIC NOT NULL DEFAULT 0,
  available_volume_forward JSONB,
  price_indication NUMERIC,
  price_unit TEXT DEFAULT 'AUD/tonne',
  abfi_score NUMERIC NOT NULL DEFAULT 0,
  sustainability_score NUMERIC NOT NULL DEFAULT 0,
  carbon_intensity_score NUMERIC NOT NULL DEFAULT 0,
  quality_score NUMERIC NOT NULL DEFAULT 0,
  reliability_score NUMERIC NOT NULL DEFAULT 0,
  carbon_intensity_value NUMERIC,
  carbon_intensity_method TEXT,
  status feedstock_status NOT NULL DEFAULT 'draft',
  verification_level verification_level NOT NULL DEFAULT 'self_declared',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(user_id)
);

-- Certificates
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedstock_id UUID NOT NULL REFERENCES public.feedstocks(id) ON DELETE CASCADE,
  type certification_type NOT NULL,
  certificate_number TEXT NOT NULL,
  issuing_body TEXT NOT NULL,
  issued_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status certification_status NOT NULL DEFAULT 'active',
  document_url TEXT,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quality Tests
CREATE TABLE IF NOT EXISTS public.quality_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedstock_id UUID NOT NULL REFERENCES public.feedstocks(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  laboratory TEXT NOT NULL,
  report_number TEXT,
  parameters JSONB NOT NULL,
  report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  feedstock_id UUID REFERENCES public.feedstocks(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  volume_required NUMERIC,
  delivery_location TEXT,
  delivery_date_start DATE,
  delivery_date_end DATE,
  status inquiry_status NOT NULL DEFAULT 'pending',
  response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feedstock_id UUID NOT NULL REFERENCES public.feedstocks(id),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id),
  inquiry_id UUID REFERENCES public.inquiries(id),
  volume_tonnes NUMERIC NOT NULL,
  price_per_tonne NUMERIC,
  total_value NUMERIC,
  delivery_date DATE NOT NULL,
  delivery_address TEXT NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  quality_receipt_url TEXT,
  supplier_rating SMALLINT CHECK (supplier_rating >= 1 AND supplier_rating <= 5),
  supplier_feedback TEXT,
  buyer_rating SMALLINT CHECK (buyer_rating >= 1 AND buyer_rating <= 5),
  buyer_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Documents
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('supplier', 'buyer')),
  feedstock_id UUID REFERENCES public.feedstocks(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('inquiry', 'transaction', 'certificate', 'verification', 'system')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(user_id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shortlists
CREATE TABLE IF NOT EXISTS public.shortlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  feedstock_id UUID NOT NULL REFERENCES public.feedstocks(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(buyer_id, feedstock_id)
);

-- ============================================
-- Step 4: Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_feedstocks_supplier ON public.feedstocks(supplier_id);
CREATE INDEX IF NOT EXISTS idx_feedstocks_category ON public.feedstocks(category);
CREATE INDEX IF NOT EXISTS idx_feedstocks_state ON public.feedstocks(state);
CREATE INDEX IF NOT EXISTS idx_feedstocks_status ON public.feedstocks(status);
CREATE INDEX IF NOT EXISTS idx_feedstocks_abfi_score ON public.feedstocks(abfi_score DESC);
CREATE INDEX IF NOT EXISTS idx_feedstocks_location ON public.feedstocks USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_certificates_feedstock ON public.certificates(feedstock_id);
CREATE INDEX IF NOT EXISTS idx_certificates_expiry ON public.certificates(expiry_date);

CREATE INDEX IF NOT EXISTS idx_quality_tests_feedstock ON public.quality_tests(feedstock_id);

CREATE INDEX IF NOT EXISTS idx_inquiries_buyer ON public.inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_supplier ON public.inquiries(supplier_id);

CREATE INDEX IF NOT EXISTS idx_transactions_supplier ON public.transactions(supplier_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON public.transactions(buyer_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_feedstocks_search ON public.feedstocks USING GIN(
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(type, ''))
);

-- ============================================
-- Step 5: Triggers and Functions
-- ============================================

-- update_updated_at()
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_buyers_updated_at ON public.buyers;
CREATE TRIGGER update_buyers_updated_at
BEFORE UPDATE ON public.buyers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_feedstocks_updated_at ON public.feedstocks;
CREATE TRIGGER update_feedstocks_updated_at
BEFORE UPDATE ON public.feedstocks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_certificates_updated_at ON public.certificates;
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_quality_tests_updated_at ON public.quality_tests;
CREATE TRIGGER update_quality_tests_updated_at
BEFORE UPDATE ON public.quality_tests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER update_inquiries_updated_at
BEFORE UPDATE ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- generate_feedstock_id()
CREATE OR REPLACE FUNCTION public.generate_feedstock_id()
RETURNS TRIGGER AS $$
DECLARE
  category_code TEXT;
  state_code TEXT;
  sequence_num INTEGER;
BEGIN
  category_code := UPPER(LEFT(NEW.category::TEXT, 3));
  state_code := NEW.state::TEXT;

  SELECT COALESCE(MAX(CAST(RIGHT(feedstock_id, 6) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.feedstocks
  WHERE feedstock_id LIKE 'ABFI-' || category_code || '-' || state_code || '-%';

  NEW.feedstock_id := 'ABFI-' || category_code || '-' || state_code || '-' || LPAD(sequence_num::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS generate_feedstock_id_trigger ON public.feedstocks;
CREATE TRIGGER generate_feedstock_id_trigger
BEFORE INSERT ON public.feedstocks
FOR EACH ROW
WHEN (NEW.feedstock_id IS NULL)
EXECUTE FUNCTION public.generate_feedstock_id();

-- ============================================
-- Step 6: Auth signup hook (handle_new_user)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, full_name, role)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'supplier')
  )
  ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Step 7: Enable RLS and Policies
-- ============================================

-- Enable RLS
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedstocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;
-- profiles already enabled in your project; keep as-is.

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Suppliers
DROP POLICY IF EXISTS "Suppliers can view their own company" ON public.suppliers;
CREATE POLICY "Suppliers can view their own company" ON public.suppliers
  FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Suppliers can update their own company" ON public.suppliers;
CREATE POLICY "Suppliers can update their own company" ON public.suppliers
  FOR UPDATE USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Suppliers can insert their own company" ON public.suppliers;
CREATE POLICY "Suppliers can insert their own company" ON public.suppliers
  FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Verified suppliers are viewable by all" ON public.suppliers;
CREATE POLICY "Verified suppliers are viewable by all" ON public.suppliers
  FOR SELECT USING (verification_status = 'verified');

DROP POLICY IF EXISTS "Admins can manage all suppliers" ON public.suppliers;
CREATE POLICY "Admins can manage all suppliers" ON public.suppliers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Buyers
DROP POLICY IF EXISTS "Buyers can view their own company" ON public.buyers;
CREATE POLICY "Buyers can view their own company" ON public.buyers
  FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Buyers can update their own company" ON public.buyers;
CREATE POLICY "Buyers can update their own company" ON public.buyers
  FOR UPDATE USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Buyers can insert their own company" ON public.buyers;
CREATE POLICY "Buyers can insert their own company" ON public.buyers
  FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all buyers" ON public.buyers;
CREATE POLICY "Admins can manage all buyers" ON public.buyers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Feedstocks
DROP POLICY IF EXISTS "Active feedstocks are viewable by all authenticated" ON public.feedstocks;
CREATE POLICY "Active feedstocks are viewable by all authenticated" ON public.feedstocks
  FOR SELECT USING (status = 'active' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Suppliers can manage their own feedstocks" ON public.feedstocks;
CREATE POLICY "Suppliers can manage their own feedstocks" ON public.feedstocks
  FOR ALL USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all feedstocks" ON public.feedstocks;
CREATE POLICY "Admins can manage all feedstocks" ON public.feedstocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Certificates
DROP POLICY IF EXISTS "Certificates viewable with feedstock" ON public.certificates;
CREATE POLICY "Certificates viewable with feedstock" ON public.certificates
  FOR SELECT USING (
    feedstock_id IN (SELECT id FROM public.feedstocks WHERE status = 'active')
  );

DROP POLICY IF EXISTS "Suppliers can manage their feedstock certificates" ON public.certificates;
CREATE POLICY "Suppliers can manage their feedstock certificates" ON public.certificates
  FOR ALL USING (
    feedstock_id IN (
      SELECT f.id FROM public.feedstocks f
      JOIN public.suppliers s ON f.supplier_id = s.id
      WHERE s.profile_id = auth.uid()
    )
  );

-- Quality tests
DROP POLICY IF EXISTS "Quality tests viewable with feedstock" ON public.quality_tests;
CREATE POLICY "Quality tests viewable with feedstock" ON public.quality_tests
  FOR SELECT USING (
    feedstock_id IN (SELECT id FROM public.feedstocks WHERE status = 'active')
  );

DROP POLICY IF EXISTS "Suppliers can manage their feedstock quality tests" ON public.quality_tests;
CREATE POLICY "Suppliers can manage their feedstock quality tests" ON public.quality_tests
  FOR ALL USING (
    feedstock_id IN (
      SELECT f.id FROM public.feedstocks f
      JOIN public.suppliers s ON f.supplier_id = s.id
      WHERE s.profile_id = auth.uid()
    )
  );

-- Inquiries
DROP POLICY IF EXISTS "Buyers can view their own inquiries" ON public.inquiries;
CREATE POLICY "Buyers can view their own inquiries" ON public.inquiries
  FOR SELECT USING (
    buyer_id IN (SELECT id FROM public.buyers WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "Suppliers can view inquiries sent to them" ON public.inquiries;
CREATE POLICY "Suppliers can view inquiries sent to them" ON public.inquiries
  FOR SELECT USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "Buyers can create inquiries" ON public.inquiries;
CREATE POLICY "Buyers can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (
    buyer_id IN (SELECT id FROM public.buyers WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "Suppliers can respond to inquiries" ON public.inquiries;
CREATE POLICY "Suppliers can respond to inquiries" ON public.inquiries
  FOR UPDATE USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE profile_id = auth.uid())
  );

-- Transactions
DROP POLICY IF EXISTS "Parties can view their transactions" ON public.transactions;
CREATE POLICY "Parties can view their transactions" ON public.transactions
  FOR SELECT USING (
    supplier_id IN (SELECT id FROM public.suppliers WHERE profile_id = auth.uid())
    OR buyer_id IN (SELECT id FROM public.buyers WHERE profile_id = auth.uid())
  );

-- Documents
DROP POLICY IF EXISTS "Owners can manage their documents" ON public.documents;
CREATE POLICY "Owners can manage their documents" ON public.documents
  FOR ALL USING (
    (owner_type = 'supplier' AND owner_id IN (SELECT id FROM public.suppliers WHERE profile_id = auth.uid()))
    OR
    (owner_type = 'buyer' AND owner_id IN (SELECT id FROM public.buyers WHERE profile_id = auth.uid()))
  );

-- Notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Audit logs (admins only)
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Shortlists
DROP POLICY IF EXISTS "Buyers can manage their shortlists" ON public.shortlists;
CREATE POLICY "Buyers can manage their shortlists" ON public.shortlists
  FOR ALL USING (
    buyer_id IN (SELECT id FROM public.buyers WHERE profile_id = auth.uid())
  );

-- ============================================
-- Migration Complete
-- ============================================
