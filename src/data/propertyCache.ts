// =========================================================
// Property Cache System — AADreamland
// =========================================================
// Maintains a localStorage-based cache of ALL properties ever
// found across all research runs. Before searching external
// sites, we check the cache first — saving time and ensuring
// we never lose previously found leads.
//
// CTO Vision: This cache is the foundation for the property
// database that will eventually feed into the STO pipeline.
// Every verified property with a direct listing URL becomes
// a potential tokenization candidate.
// =========================================================

import type { Property } from "./properties";

const CACHE_KEY = "aadreamland_property_cache";
const RESEARCH_LOG_KEY = "aadreamland_research_log";

// ─────────── CACHED PROPERTY ───────────
export interface CachedProperty extends Property {
  /** When this property was first discovered */
  discoveredAt: string;
  /** Which search engine found it */
  sourceEngine: string;
  /** Whether the listing URL has been verified (opens correct page) */
  urlVerified: boolean;
  /** Last time we checked if the listing is still active */
  lastChecked: string;
  /** Is the listing still active? */
  isActive: boolean;
  /** Original search criteria that found this property */
  foundByCriteria: string;
  /** Tags for organization */
  tags: string[];
}

// ─────────── RESEARCH LOG ───────────
export interface ResearchLogEntry {
  id: string;
  clientName: string;
  timestamp: string;
  criteria: {
    states: string[];
    counties: string[];
    budgetCashMin: number;
    budgetCashMax: number;
    acreageMin: number;
    acreageMax: number;
    ownerFinancing: boolean;
  };
  enginesSearched: string[];
  propertiesFound: number;
  propertiesFromCache: number;
  newPropertiesAdded: number;
  status: "pending" | "in_progress" | "completed" | "failed";
  notes: string;
}

// =========================================================
// CACHE OPERATIONS
// =========================================================

/** Load all cached properties */
export function loadPropertyCache(): CachedProperty[] {
  try {
    const data = localStorage.getItem(CACHE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Save the full cache */
export function savePropertyCache(cache: CachedProperty[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* ignore */ }
}

/** Add properties to cache (deduplicates by listingUrl and APN) */
export function addToCache(properties: CachedProperty[]): { added: number; duplicates: number } {
  const cache = loadPropertyCache();
  let added = 0;
  let duplicates = 0;

  for (const prop of properties) {
    const isDuplicate = cache.some(cached =>
      // Match by listing URL
      (prop.listingUrl && cached.listingUrl && prop.listingUrl === cached.listingUrl) ||
      // Match by APN + county + state
      (prop.apn !== "TBD" && cached.apn !== "TBD" && prop.apn === cached.apn && prop.county === cached.county && prop.state === cached.state) ||
      // Match by name + county (fuzzy)
      (prop.name === cached.name && prop.county === cached.county)
    );

    if (!isDuplicate) {
      cache.push(prop);
      added++;
    } else {
      duplicates++;
    }
  }

  savePropertyCache(cache);
  return { added, duplicates };
}

/** Search cache for properties matching criteria */
export function searchCache(criteria: {
  states?: string[];
  counties?: string[];
  budgetCashMax?: number;
  budgetCashMin?: number;
  acreageMin?: number;
  acreageMax?: number;
  client?: string;
}): CachedProperty[] {
  const cache = loadPropertyCache();
  return cache.filter(p => {
    if (criteria.states?.length && !criteria.states.includes(p.state)) return false;
    if (criteria.counties?.length && !criteria.counties.includes(p.county)) return false;
    if (criteria.budgetCashMax && p.cashPrice && p.cashPrice > criteria.budgetCashMax) return false;
    if (criteria.budgetCashMin && p.cashPrice && p.cashPrice < criteria.budgetCashMin) return false;
    if (criteria.acreageMin && p.acres && p.acres < criteria.acreageMin) return false;
    if (criteria.acreageMax && p.acres && p.acres > criteria.acreageMax) return false;
    if (criteria.client && p.client !== criteria.client) return false;
    return true;
  });
}

/** Get cache stats */
export function getCacheStats(): {
  totalProperties: number;
  verifiedUrls: number;
  activeListings: number;
  byState: Record<string, number>;
  byEngine: Record<string, number>;
  byClient: Record<string, number>;
} {
  const cache = loadPropertyCache();
  const byState: Record<string, number> = {};
  const byEngine: Record<string, number> = {};
  const byClient: Record<string, number> = {};

  for (const p of cache) {
    byState[p.state] = (byState[p.state] || 0) + 1;
    byEngine[p.sourceEngine] = (byEngine[p.sourceEngine] || 0) + 1;
    byClient[p.client] = (byClient[p.client] || 0) + 1;
  }

  return {
    totalProperties: cache.length,
    verifiedUrls: cache.filter(p => p.urlVerified).length,
    activeListings: cache.filter(p => p.isActive).length,
    byState,
    byEngine,
    byClient,
  };
}

/** Remove a property from cache by ID */
export function removeFromCache(id: number): void {
  const cache = loadPropertyCache().filter(p => p.id !== id);
  savePropertyCache(cache);
}

/** Mark a property URL as verified/unverified */
export function setUrlVerified(id: number, verified: boolean): void {
  const cache = loadPropertyCache();
  const prop = cache.find(p => p.id === id);
  if (prop) {
    prop.urlVerified = verified;
    prop.lastChecked = new Date().toISOString();
    savePropertyCache(cache);
  }
}

/** Generate next available property ID */
export function getNextPropertyId(): number {
  const cache = loadPropertyCache();
  if (cache.length === 0) return 1001;
  return Math.max(...cache.map(p => p.id)) + 1;
}

// =========================================================
// RESEARCH LOG OPERATIONS
// =========================================================

export function loadResearchLog(): ResearchLogEntry[] {
  try {
    const data = localStorage.getItem(RESEARCH_LOG_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveResearchLog(log: ResearchLogEntry[]): void {
  try {
    localStorage.setItem(RESEARCH_LOG_KEY, JSON.stringify(log));
  } catch { /* ignore */ }
}

export function addResearchLogEntry(entry: ResearchLogEntry): void {
  const log = loadResearchLog();
  log.unshift(entry); // newest first
  // Keep last 100 entries
  if (log.length > 100) log.length = 100;
  saveResearchLog(log);
}

export function updateResearchLogEntry(id: string, updates: Partial<ResearchLogEntry>): void {
  const log = loadResearchLog();
  const entry = log.find(e => e.id === id);
  if (entry) {
    Object.assign(entry, updates);
    saveResearchLog(log);
  }
}

// =========================================================
// CONVERT HARDCODED PROPERTIES TO CACHE FORMAT
// =========================================================
export function propertyToCached(p: Property, sourceEngine: string = "manual"): CachedProperty {
  return {
    ...p,
    discoveredAt: p.researchDate || new Date().toISOString().split("T")[0],
    sourceEngine,
    urlVerified: false,
    lastChecked: new Date().toISOString(),
    isActive: true,
    foundByCriteria: p.client,
    tags: [],
  };
}
