// =========================================================
// Search Engine Configuration for AADreamland Market Research
// =========================================================
// Each engine defines: name, base URL, how to build search URLs
// from client criteria, and what data fields to extract.
// =========================================================

export interface SearchEngine {
  id: string;
  name: string;
  baseUrl: string;
  enabled: boolean;
  priority: number; // 1=highest, lower numbers searched first
  category: "primary" | "secondary" | "auction";
  description: string;
  /** Builds a search URL from client search criteria */
  buildSearchUrl: (criteria: SearchCriteria) => string;
  /** Fields this site typically provides */
  availableFields: string[];
  /** Notes about this site for the researcher */
  researchNotes: string;
}

export interface SearchCriteria {
  states: string[];
  counties: string[];
  budgetCashMin: number;
  budgetCashMax: number;
  acreageMin: number;
  acreageMax: number;
  ownerFinancing: boolean;
  rvMobileOk: boolean;
  unrestricted: boolean;
}

// State abbreviation map
const STATE_ABBR: Record<string, string> = {
  "Missouri": "MO", "Arkansas": "AR", "Oklahoma": "OK", "Texas": "TX",
  "Kansas": "KS", "Tennessee": "TN", "Kentucky": "KY", "Illinois": "IL",
  "Alabama": "AL", "Arizona": "AZ", "California": "CA", "Colorado": "CO",
  "Florida": "FL", "Georgia": "GA", "Idaho": "ID", "Indiana": "IN",
  "Iowa": "IA", "Louisiana": "LA", "Michigan": "MI", "Minnesota": "MN",
  "Mississippi": "MS", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Mexico": "NM", "North Carolina": "NC", "Ohio": "OH", "Oregon": "OR",
  "Pennsylvania": "PA", "South Carolina": "SC", "Virginia": "VA", "Washington": "WA",
  "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY",
};

function stateSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, "-");
}

function countySlug(county: string): string {
  return county.toLowerCase().replace(/[.\s]+/g, "-");
}

// =========================================================
// DEFAULT SEARCH ENGINES
// =========================================================
export const DEFAULT_SEARCH_ENGINES: SearchEngine[] = [
  // ───────── PRIMARY SITES ─────────
  {
    id: "landmodo",
    name: "Landmodo",
    baseUrl: "https://www.landmodo.com",
    enabled: true,
    priority: 1,
    category: "primary",
    description: "Large land marketplace — owner financing, direct listing URLs, filters for mobile/RV",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      let url = `https://www.landmodo.com/${stateSlug(state)}-land-for-sale`;
      const params: string[] = [];
      if (c.budgetCashMax > 0) params.push(`price_max=${c.budgetCashMax}`);
      if (c.budgetCashMin > 0) params.push(`price_min=${c.budgetCashMin}`);
      if (c.acreageMin > 0) params.push(`lot_size_min=${c.acreageMin}`);
      if (c.acreageMax > 0 && c.acreageMax < 1000) params.push(`lot_size_max=${c.acreageMax}`);
      if (c.ownerFinancing) params.push(`financing=owner`);
      if (params.length) url += "?" + params.join("&");
      return url;
    },
    availableFields: ["cashPrice", "acres", "location", "seller", "ownerFinancing", "monthlyPayment", "downPayment", "listingUrl", "lat", "lng"],
    researchNotes: "Each listing has a unique URL like /properties/XXXXX/address/description. Always grab the full URL from each property page.",
  },
  {
    id: "landwatch",
    name: "LandWatch",
    baseUrl: "https://www.landwatch.com",
    enabled: true,
    priority: 1,
    category: "primary",
    description: "Major land listings aggregator — large inventory, detailed property pages",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      const county = c.counties[0] || "";
      if (county) {
        return `https://www.landwatch.com/${stateSlug(state)}-land-for-sale/${countySlug(county)}-county?minPrice=${c.budgetCashMin}&maxPrice=${c.budgetCashMax}&minAcreage=${c.acreageMin}&maxAcreage=${c.acreageMax}`;
      }
      return `https://www.landwatch.com/${stateSlug(state)}-land-for-sale?minPrice=${c.budgetCashMin}&maxPrice=${c.budgetCashMax}&minAcreage=${c.acreageMin}&maxAcreage=${c.acreageMax}`;
    },
    availableFields: ["cashPrice", "acres", "location", "seller", "listingUrl", "lat", "lng", "roadAccess"],
    researchNotes: "Listings have URLs like /property/description-PID/. Each has a unique PID. Check for owner financing in listing details.",
  },
  {
    id: "zillow",
    name: "Zillow",
    baseUrl: "https://www.zillow.com",
    enabled: true,
    priority: 1,
    category: "primary",
    description: "Largest real estate site — land/lots section has great filtering and verified data",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      const abbr = STATE_ABBR[state] || "MO";
      const county = c.counties[0] || "";
      if (county) {
        return `https://www.zillow.com/${countySlug(county)}-county-${abbr.toLowerCase()}/land/?searchQueryState=%7B%22price%22%3A%7B%22min%22%3A${c.budgetCashMin}%2C%22max%22%3A${c.budgetCashMax}%7D%2C%22lotSize%22%3A%7B%22min%22%3A${Math.round(c.acreageMin * 43560)}%7D%7D`;
      }
      return `https://www.zillow.com/${abbr.toLowerCase()}/land/?searchQueryState=%7B%22price%22%3A%7B%22min%22%3A${c.budgetCashMin}%2C%22max%22%3A${c.budgetCashMax}%7D%7D`;
    },
    availableFields: ["cashPrice", "acres", "location", "listingUrl", "lat", "lng", "apn"],
    researchNotes: "Zillow listings have URLs like /homedetails/address/ZPID_zpid/. Always get the specific ZPID URL. Filter by 'Lots/Land' type.",
  },
  {
    id: "landsearch",
    name: "LandSearch",
    baseUrl: "https://www.landsearch.com",
    enabled: true,
    priority: 2,
    category: "primary",
    description: "Clean land marketplace — good filters for cheap land, owner financing",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      const county = c.counties[0] || "";
      if (county) {
        return `https://www.landsearch.com/${stateSlug(state)}/${countySlug(county)}-county?min_price=${c.budgetCashMin}&max_price=${c.budgetCashMax}`;
      }
      return `https://www.landsearch.com/${stateSlug(state)}?min_price=${c.budgetCashMin}&max_price=${c.budgetCashMax}`;
    },
    availableFields: ["cashPrice", "acres", "location", "seller", "listingUrl"],
    researchNotes: "Each listing has a clean URL. Good for finding cheap land parcels.",
  },
  {
    id: "land_com",
    name: "Land.com",
    baseUrl: "https://www.land.com",
    enabled: true,
    priority: 2,
    category: "primary",
    description: "Premium land marketplace — part of the Lands of America network",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      return `https://www.land.com/${stateSlug(state)}/land-for-sale?priceMin=${c.budgetCashMin}&priceMax=${c.budgetCashMax}&acreageMin=${c.acreageMin}`;
    },
    availableFields: ["cashPrice", "acres", "location", "seller", "listingUrl", "lat", "lng"],
    researchNotes: "Part of CoStar. Listings have detailed info. URLs like /property/SLUG/ID/",
  },
  {
    id: "landandfarm",
    name: "LandAndFarm",
    baseUrl: "https://www.landandfarm.com",
    enabled: true,
    priority: 2,
    category: "primary",
    description: "Land & Farm — rural land marketplace with good county-level search",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      return `https://www.landandfarm.com/search/${state.replace(/\s/g, "-")}-land-for-sale/?Price_Range=${c.budgetCashMin}-${c.budgetCashMax}&Acreage=${c.acreageMin}-${c.acreageMax}`;
    },
    availableFields: ["cashPrice", "acres", "location", "seller", "listingUrl"],
    researchNotes: "URLs like /property/description-ID/. Good inventory of rural land.",
  },

  // ───────── SECONDARY / NICHE SITES ─────────
  {
    id: "landcentral",
    name: "LandCentral",
    baseUrl: "https://www.landcentral.com",
    enabled: true,
    priority: 3,
    category: "secondary",
    description: "Owner financing specialist — no credit check, low monthly payments",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      return `https://www.landcentral.com/land-for-sale/${stateSlug(state)}?price_max=${c.budgetCashMax}`;
    },
    availableFields: ["cashPrice", "acres", "location", "ownerFinancing", "monthlyPayment", "downPayment", "listingUrl"],
    researchNotes: "Specializes in owner financing. Good for clients with limited cash. Each listing page has unique URL.",
  },
  {
    id: "onceuponabrick",
    name: "Once Upon a Brick",
    baseUrl: "https://onceuponabrick.com",
    enabled: true,
    priority: 3,
    category: "secondary",
    description: "Budget land seller — owner financing, low down, low monthly",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      return `https://onceuponabrick.com/collections/${stateSlug(state)}-land-for-sale`;
    },
    availableFields: ["cashPrice", "acres", "location", "ownerFinancing", "monthlyPayment", "downPayment", "listingUrl", "apn"],
    researchNotes: "Shopify-based store. Each property has a product URL like /products/SLUG. Always get the specific product URL.",
  },
  {
    id: "landdirectusa",
    name: "Land Direct USA",
    baseUrl: "https://www.landdirectusa.com",
    enabled: true,
    priority: 3,
    category: "secondary",
    description: "Direct land seller — owner financing, mobile home friendly listings",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      return `https://www.landdirectusa.com/land-for-sale/?state=${state}`;
    },
    availableFields: ["cashPrice", "acres", "location", "ownerFinancing", "monthlyPayment", "downPayment", "rvMobileOk", "listingUrl", "apn"],
    researchNotes: "Each listing has a detail page. Filter by state. Look for mobile home allowed listings.",
  },
  {
    id: "landflip",
    name: "LandFlip",
    baseUrl: "https://www.landflip.com",
    enabled: true,
    priority: 3,
    category: "secondary",
    description: "Land marketplace — good for finding deals with owner financing",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      const abbr = STATE_ABBR[state] || "MO";
      return `https://www.landflip.com/land-for-sale/${abbr.toLowerCase()}?minprice=${c.budgetCashMin}&maxprice=${c.budgetCashMax}&minacres=${c.acreageMin}`;
    },
    availableFields: ["cashPrice", "acres", "location", "seller", "listingUrl"],
    researchNotes: "Each listing has unique URL. Good inventory of cheap rural land.",
  },
  {
    id: "realtor",
    name: "Realtor.com",
    baseUrl: "https://www.realtor.com",
    enabled: true,
    priority: 2,
    category: "primary",
    description: "Major real estate platform — land/lots section with verified MLS data",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      const abbr = STATE_ABBR[state] || "MO";
      const county = c.counties[0] || "";
      if (county) {
        return `https://www.realtor.com/realestateandhomes-search/${county.replace(/\s/g, "-")}_${abbr}/type-land/price-${c.budgetCashMin}-${c.budgetCashMax}`;
      }
      return `https://www.realtor.com/realestateandhomes-search/${abbr}/type-land/price-${c.budgetCashMin}-${c.budgetCashMax}`;
    },
    availableFields: ["cashPrice", "acres", "location", "listingUrl", "lat", "lng", "apn"],
    researchNotes: "MLS-backed data. Listings have URLs like /realestateandhomes-detail/ADDRESS_MLSID. Very reliable data.",
  },

  // ───────── AUCTION SITES ─────────
  {
    id: "govdeals",
    name: "GovDeals",
    baseUrl: "https://www.govdeals.com",
    enabled: true,
    priority: 4,
    category: "auction",
    description: "Government surplus auction — tax-forfeited land, county surplus",
    buildSearchUrl: () => {
      return `https://www.govdeals.com/index.cfm?fa=Main.AdvSearchResultsNew&searchPg=Category&additession=&category=83`;
    },
    availableFields: ["cashPrice", "acres", "location", "listingUrl"],
    researchNotes: "Category 83 = Real Estate/Land. Filter by state. Auction items have unique IDs. Great for tax sale deals.",
  },
  {
    id: "bid4assets",
    name: "Bid4Assets",
    baseUrl: "https://www.bid4assets.com",
    enabled: true,
    priority: 4,
    category: "auction",
    description: "Tax deed auction platform — county tax sale properties",
    buildSearchUrl: (c) => {
      const state = c.states[0] || "Missouri";
      return `https://www.bid4assets.com/auction/residential/land?state=${STATE_ABBR[state] || "MO"}`;
    },
    availableFields: ["cashPrice", "acres", "location", "listingUrl", "apn"],
    researchNotes: "Tax deed auctions. Each auction has unique URL. Check auction dates. Great for below-market deals.",
  },
];

// =========================================================
// LOCAL STORAGE HELPERS
// =========================================================
const STORAGE_KEY = "aadreamland_search_engines";

export function loadSearchEngines(): SearchEngine[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as SearchEngine[];
      // Merge with defaults — keep user's enabled/priority but add any new engines
      const merged = DEFAULT_SEARCH_ENGINES.map(def => {
        const saved_engine = parsed.find(s => s.id === def.id);
        if (saved_engine) {
          return { ...def, enabled: saved_engine.enabled, priority: saved_engine.priority };
        }
        return def;
      });
      // Also keep any custom engines the user added
      const customEngines = parsed.filter(s => !DEFAULT_SEARCH_ENGINES.find(d => d.id === s.id));
      return [...merged, ...customEngines];
    }
  } catch { /* ignore */ }
  return [...DEFAULT_SEARCH_ENGINES];
}

export function saveSearchEngines(engines: SearchEngine[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(engines));
  } catch { /* ignore */ }
}

// =========================================================
// GENERATE SEARCH PLAN
// =========================================================
export interface SearchPlan {
  engine: SearchEngine;
  searchUrl: string;
  state: string;
  county?: string;
}

/**
 * Given client criteria, generate a full search plan:
 * one search per (engine × state × county) combination.
 */
export function generateSearchPlan(criteria: SearchCriteria): SearchPlan[] {
  const engines = loadSearchEngines().filter(e => e.enabled).sort((a, b) => a.priority - b.priority);
  const plans: SearchPlan[] = [];

  for (const engine of engines) {
    if (criteria.counties.length > 0) {
      // Search each county specifically
      for (const county of criteria.counties) {
        for (const state of criteria.states) {
          const criteriaForCounty = { ...criteria, states: [state], counties: [county] };
          plans.push({
            engine,
            searchUrl: engine.buildSearchUrl(criteriaForCounty),
            state,
            county,
          });
        }
      }
    } else {
      // Search by state only
      for (const state of criteria.states) {
        const criteriaForState = { ...criteria, states: [state] };
        plans.push({
          engine,
          searchUrl: engine.buildSearchUrl(criteriaForState),
          state,
        });
      }
    }
  }

  return plans;
}
