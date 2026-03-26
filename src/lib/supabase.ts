import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if credentials are provided; otherwise use null
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface DBResearch {
  id?: string;
  created_at?: string;
  client_name: string;
  budget_cash_min: number;
  budget_cash_max: number;
  budget_down_min: number;
  budget_down_max: number;
  budget_monthly_min: number;
  budget_monthly_max: number;
  states: string[];
  counties: string[];
  hoa_allowed: boolean;
  land_uses: string[];
  min_acres: number | null;
  max_acres: number | null;
  road_requirement: string;
  power_nearby: string;
  owner_financing: boolean;
  immediate_residence: boolean;
  notes: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface DBProperty {
  id?: string;
  created_at?: string;
  research_id?: string;
  name: string;
  cash_price: number | null;
  acres: number | null;
  price_per_acre: number | null;
  down_payment: string;
  monthly_payment: string;
  monthly_num: number;
  county: string;
  state: string;
  location: string;
  seller: string;
  seller_type: string;
  wholesale_score: number;
  road_access: string;
  power_nearby: string;
  unrestricted: boolean;
  owner_financing: boolean;
  rv_mobile_ok: string;
  listing_url: string;
  apn: string;
  notes: string;
  lat: number;
  lng: number;
  category: string;
  client: string;
  research_date: string;
  soil_quality: string;
  elevation: string;
}
