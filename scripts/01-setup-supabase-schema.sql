-- Barangay Management System - Supabase Schema Setup
-- This script creates all tables, RLS policies, and enables realtime subscriptions

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (Admin, Officials, Residents)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(500),
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('admin', 'official', 'resident')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),
  is_verified BOOLEAN DEFAULT FALSE,
  is_activated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- RESIDENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  purok VARCHAR(100),
  civil_status VARCHAR(50),
  occupation VARCHAR(100),
  birthdate DATE,
  gender VARCHAR(20),
  id_number VARCHAR(50),
  id_type VARCHAR(50),
  precinct_number VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- OFFICIALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS officials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  contact_number VARCHAR(20),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- DOCUMENTS TABLE (Birth, Marriage, Death Certificates, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  document_number VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason VARCHAR(500),
  notes VARCHAR(1000),
  file_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- BLOTTER TABLE (Incident Reports)
-- ============================================================================
CREATE TABLE IF NOT EXISTS blotter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blotter_number VARCHAR(50) UNIQUE,
  incident_type VARCHAR(100) NOT NULL,
  location VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  reported_by_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  respondent_name VARCHAR(255),
  respondent_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'reported' CHECK (status IN ('reported', 'investigating', 'mediation', 'resolved', 'escalated')),
  incident_date DATE NOT NULL,
  incident_time TIME,
  description TEXT,
  narrative TEXT,
  witnesses TEXT[],
  notify_parties BOOLEAN DEFAULT FALSE,
  assigned_to_id UUID REFERENCES officials(id) ON DELETE SET NULL,
  resolution VARCHAR(1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  views INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- ORDINANCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS ordinances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ordinance_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  effective_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'repealed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'ongoing' CHECK (status IN ('planning', 'ongoing', 'completed', 'on_hold')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15, 2),
  responsible_official_id UUID REFERENCES officials(id) ON DELETE SET NULL,
  beneficiaries TEXT[],
  progress_percentage INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- ASSETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(100) NOT NULL,
  description TEXT,
  quantity INT,
  unit_price DECIMAL(10, 2),
  acquisition_date DATE,
  location VARCHAR(500),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'damaged', 'lost', 'disposed')),
  responsible_official_id UUID REFERENCES officials(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- BUSINESSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name VARCHAR(255) NOT NULL,
  owner_id UUID REFERENCES residents(id) ON DELETE SET NULL,
  business_type VARCHAR(100),
  location VARCHAR(500),
  permit_number VARCHAR(50),
  permit_expiry DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- REQUESTS TABLE (Miscellaneous Service Requests)
-- ============================================================================
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,
  request_type VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  assigned_to_id UUID REFERENCES officials(id) ON DELETE SET NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes VARCHAR(1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_residents_user_id ON residents(user_id);
CREATE INDEX IF NOT EXISTS idx_residents_purok ON residents(purok);
CREATE INDEX IF NOT EXISTS idx_officials_user_id ON officials(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_resident_id ON documents(resident_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_blotter_reported_by_id ON blotter(reported_by_id);
CREATE INDEX IF NOT EXISTS idx_blotter_incident_date ON blotter(incident_date);
CREATE INDEX IF NOT EXISTS idx_blotter_status ON blotter(status);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON announcements(author_id);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_ordinances_author_id ON ordinances(author_id);
CREATE INDEX IF NOT EXISTS idx_projects_responsible_official_id ON projects(responsible_official_id);
CREATE INDEX IF NOT EXISTS idx_assets_responsible_official_id ON assets(responsible_official_id);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_requests_resident_id ON requests(resident_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE blotter ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordinances ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Users - Admins can see all, users can see only themselves
CREATE POLICY "users_admin_all" ON users
  FOR SELECT USING (
    auth.jwt() ->> 'user_type' = 'admin' OR
    auth.uid() = id
  );

CREATE POLICY "users_insert_self" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_self_or_admin" ON users
  FOR UPDATE USING (
    auth.jwt() ->> 'user_type' = 'admin' OR
    auth.uid() = id
  );

-- Residents - Can view their own, officials can view all active, admins see all
CREATE POLICY "residents_select" ON residents
  FOR SELECT USING (
    auth.jwt() ->> 'user_type' = 'admin' OR
    auth.jwt() ->> 'user_type' = 'official' OR
    auth.uid() = user_id
  );

-- Documents - Residents can see their own, officials/admins can see all
CREATE POLICY "documents_select" ON documents
  FOR SELECT USING (
    auth.jwt() ->> 'user_type' = 'admin' OR
    auth.jwt() ->> 'user_type' = 'official' OR
    resident_id IN (
      SELECT id FROM residents WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "documents_insert_self" ON documents
  FOR INSERT WITH CHECK (
    resident_id IN (SELECT id FROM residents WHERE user_id = auth.uid()) OR
    auth.jwt() ->> 'user_type' = 'admin'
  );

-- Blotter - Residents can view and create, officials/admins can view all
CREATE POLICY "blotter_select" ON blotter
  FOR SELECT USING (
    auth.jwt() ->> 'user_type' = 'admin' OR
    auth.jwt() ->> 'user_type' = 'official' OR
    reported_by_id IN (SELECT id FROM residents WHERE user_id = auth.uid())
  );

CREATE POLICY "blotter_insert_resident" ON blotter
  FOR INSERT WITH CHECK (
    reported_by_id IN (SELECT id FROM residents WHERE user_id = auth.uid()) OR
    auth.jwt() ->> 'user_type' = 'admin'
  );

-- Announcements - Public read, officials/admins write
CREATE POLICY "announcements_select" ON announcements
  FOR SELECT USING (status = 'published' OR auth.jwt() ->> 'user_type' IN ('admin', 'official'));

CREATE POLICY "announcements_insert" ON announcements
  FOR INSERT WITH CHECK (auth.jwt() ->> 'user_type' IN ('admin', 'official'));

-- Ordinances - Public read, officials/admins write
CREATE POLICY "ordinances_select" ON ordinances
  FOR SELECT USING (status = 'active' OR auth.jwt() ->> 'user_type' IN ('admin', 'official'));

CREATE POLICY "ordinances_insert" ON ordinances
  FOR INSERT WITH CHECK (auth.jwt() ->> 'user_type' IN ('admin', 'official'));

-- Projects - Public read, officials/admins manage
CREATE POLICY "projects_select" ON projects
  FOR SELECT USING (true);

CREATE POLICY "projects_insert" ON projects
  FOR INSERT WITH CHECK (auth.jwt() ->> 'user_type' IN ('admin', 'official'));

-- Assets - Officials/admins only
CREATE POLICY "assets_select" ON assets
  FOR SELECT USING (auth.jwt() ->> 'user_type' IN ('admin', 'official'));

CREATE POLICY "assets_insert" ON assets
  FOR INSERT WITH CHECK (auth.jwt() ->> 'user_type' IN ('admin', 'official'));

-- Businesses - Owners can view their own, officials/admins can view all
CREATE POLICY "businesses_select" ON businesses
  FOR SELECT USING (
    auth.jwt() ->> 'user_type' = 'admin' OR
    auth.jwt() ->> 'user_type' = 'official' OR
    owner_id IN (SELECT id FROM residents WHERE user_id = auth.uid())
  );

-- Requests - Residents can view their own, officials/admins can view all
CREATE POLICY "requests_select" ON requests
  FOR SELECT USING (
    auth.jwt() ->> 'user_type' = 'admin' OR
    auth.jwt() ->> 'user_type' = 'official' OR
    resident_id IN (SELECT id FROM residents WHERE user_id = auth.uid())
  );

CREATE POLICY "requests_insert" ON requests
  FOR INSERT WITH CHECK (
    resident_id IN (SELECT id FROM residents WHERE user_id = auth.uid()) OR
    auth.jwt() ->> 'user_type' = 'admin'
  );

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE documents;
ALTER PUBLICATION supabase_realtime ADD TABLE blotter;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE requests;
