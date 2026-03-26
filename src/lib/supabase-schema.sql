-- Research runs table
CREATE TABLE IF NOT EXISTS research_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  client_name TEXT NOT NULL,
  budget_cash_min NUMERIC DEFAULT 0,
  budget_cash_max NUMERIC DEFAULT 0,
  budget_down_min NUMERIC DEFAULT 0,
  budget_down_max NUMERIC DEFAULT 0,
  budget_monthly_min NUMERIC DEFAULT 0,
  budget_monthly_max NUMERIC DEFAULT 0,
  states TEXT[] DEFAULT '{}',
  counties TEXT[] DEFAULT '{}',
  hoa_allowed BOOLEAN DEFAULT false,
  land_uses TEXT[] DEFAULT '{}',
  min_acres NUMERIC,
  max_acres NUMERIC,
  road_requirement TEXT DEFAULT '',
  power_nearby TEXT DEFAULT 'any',
  owner_financing BOOLEAN DEFAULT true,
  immediate_residence BOOLEAN DEFAULT false,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed'))
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  research_id UUID REFERENCES research_runs(id),
  name TEXT NOT NULL,
  cash_price NUMERIC,
  acres NUMERIC,
  price_per_acre NUMERIC,
  down_payment TEXT DEFAULT '',
  monthly_payment TEXT DEFAULT '',
  monthly_num NUMERIC DEFAULT 0,
  county TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'MO',
  location TEXT DEFAULT '',
  seller TEXT DEFAULT '',
  seller_type TEXT DEFAULT 'TBD',
  wholesale_score INTEGER DEFAULT 0,
  road_access TEXT DEFAULT '',
  power_nearby TEXT DEFAULT '',
  unrestricted BOOLEAN DEFAULT true,
  owner_financing BOOLEAN DEFAULT false,
  rv_mobile_ok TEXT DEFAULT '',
  listing_url TEXT DEFAULT '',
  apn TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  lat NUMERIC DEFAULT 0,
  lng NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'negotiate',
  client TEXT NOT NULL,
  research_date TEXT DEFAULT '',
  soil_quality TEXT DEFAULT '',
  elevation TEXT DEFAULT ''
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL UNIQUE,
  purpose TEXT DEFAULT '',
  target_states TEXT[] DEFAULT '{}',
  target_counties TEXT[] DEFAULT '{}',
  budget_cash_min NUMERIC DEFAULT 0,
  budget_cash_max NUMERIC DEFAULT 0,
  budget_down TEXT DEFAULT '',
  budget_monthly TEXT DEFAULT '',
  acreage_min NUMERIC DEFAULT 0,
  acreage_max NUMERIC DEFAULT 100,
  must_unrestricted BOOLEAN DEFAULT true,
  must_no_hoa BOOLEAN DEFAULT true,
  must_owner_financing BOOLEAN DEFAULT false,
  must_road_access TEXT DEFAULT 'Any',
  must_live_on_site BOOLEAN DEFAULT false,
  notes TEXT DEFAULT ''
);

-- Enable Row Level Security
ALTER TABLE research_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Allow all access for now (use auth later)
CREATE POLICY "Allow all" ON research_runs FOR ALL USING (true);
CREATE POLICY "Allow all" ON properties FOR ALL USING (true);
CREATE POLICY "Allow all" ON clients FOR ALL USING (true);
