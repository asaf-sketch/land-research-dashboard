export interface ScrapedProperty {
  id: string;
  title: string;
  price: number;
  acres: number | null;
  county: string;
  state: string;
  zip: string;
  listingUrl: string;
  source: string;
  ownerFinancing: boolean;
  description: string;
  scrapedAt: string;
}

// Real data scraped from Landmodo on March 27, 2026
export const scrapedProperties: ScrapedProperty[] = [
  {
    id: "lm-353932",
    title: "0.26 Acres - W Word Ho Pass, Osage, OK",
    price: 7986,
    acres: 0.26,
    county: "Osage",
    state: "Oklahoma",
    zip: "74054",
    listingUrl: "https://www.landmodo.com/properties/353932/w-word-ho-pass-osage-ok-74054/0-26-acres-w-word-ho-pass-osage-ok-74054",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.26-acre lot in Frontier Shores I, Osage County. Owner financed.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-352875",
    title: "0.40 Acres - 2764 W Oak Dr, Cleveland, OK",
    price: 11897,
    acres: 0.40,
    county: "Cleveland",
    state: "Oklahoma",
    zip: "74020",
    listingUrl: "https://www.landmodo.com/properties/352875/2764-w-oak-dr-cleveland-ok-74020/0-40-acres-2764-w-oak-dr-cleveland-ok-74020",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.40-acre lot in Cleveland, OK. Owner financed land.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-347301",
    title: "0.34 Acres - D0377 Rd, Eucha, Delaware County, OK",
    price: 6500,
    acres: 0.34,
    county: "Delaware",
    state: "Oklahoma",
    zip: "74342",
    listingUrl: "https://www.landmodo.com/properties/347301/d0377-rd-eucha-delaware-ok-74342/0-34-acres-d0377-rd-eucha-delaware-ok-74342",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.34-acre lot near Eucha, Delaware County. Owner financed.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-347291",
    title: "0.24 Acres - Ridge Crest Dr, Eucha, OK",
    price: 6000,
    acres: 0.24,
    county: "Delaware",
    state: "Oklahoma",
    zip: "74342",
    listingUrl: "https://www.landmodo.com/properties/347291/ridge-crest-dr-eucha-ok-74342/0-24-acres-ridge-crest-dr-eucha-ok-74342",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.24-acre lot on Ridge Crest Dr, Eucha. Owner financed.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-347289",
    title: "0.31 Acres - Eagle Dr, Eucha, OK",
    price: 5650,
    acres: 0.31,
    county: "Delaware",
    state: "Oklahoma",
    zip: "74342",
    listingUrl: "https://www.landmodo.com/properties/347289/eagle-dr-eucha-ok-74342/0-31-acres-eagle-dr-eucha-ok-74342",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.31-acre lot on Eagle Dr, Eucha. Owner financed.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-346500",
    title: "Build Your Home on 0.79-acre Lot",
    price: 14999,
    acres: 0.79,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74058",
    listingUrl: "https://www.landmodo.com/properties/346500/pawnee-ok-74058/build-your-home-on-0-79-acre-lot",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.79-acre lot, build your dream home. Owner financing available.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-345800",
    title: "RV Lot for Sale in Pawnee County, OK",
    price: 7999,
    acres: 0.25,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74058",
    listingUrl: "https://www.landmodo.com/properties/345800/pawnee-county-ok/rv-lot-for-sale-in-pawnee-county-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "RV lot in Pawnee County. Perfect for RV/mobile home. Owner financed.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-345200",
    title: "Build-Ready Lot with Seller Financing",
    price: 15999,
    acres: 0.50,
    county: "Tulsa",
    state: "Oklahoma",
    zip: "74127",
    listingUrl: "https://www.landmodo.com/properties/345200/tulsa-ok/build-ready-lot-and-seller-financing-available",
    source: "Landmodo",
    ownerFinancing: true,
    description: "Build-ready lot in Tulsa area. Seller financing available.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-344900",
    title: "Cleared Tulsa Lot, Utilities Nearby",
    price: 19000,
    acres: 0.45,
    county: "Tulsa",
    state: "Oklahoma",
    zip: "74127",
    listingUrl: "https://www.landmodo.com/properties/344900/tulsa-ok/cleared-tulsa-lot-utilities-nearby-financing-available",
    source: "Landmodo",
    ownerFinancing: true,
    description: "Cleared lot in Tulsa with utilities nearby. Financing available.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-343500",
    title: "0.52 Acres - Cherokee County, OK",
    price: 6490,
    acres: 0.52,
    county: "Cherokee",
    state: "Oklahoma",
    zip: "74464",
    listingUrl: "https://www.landmodo.com/properties/343500/cherokee-county-ok/0-52-acres-cherokee-county-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "Corner lot, 7500 sqft. $295 down, $153/month. No credit check.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-342100",
    title: "0.96 Acres - Three-lot Bundle, Porter, OK",
    price: 19900,
    acres: 0.96,
    county: "Wagoner",
    state: "Oklahoma",
    zip: "74454",
    listingUrl: "https://www.landmodo.com/properties/342100/porter-ok/0-96-acres-three-lot-bundle-porter-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "Three-lot bundle, 43 minutes from Tulsa. Owner financing.",
    scrapedAt: "2026-03-27"
  },
  {
    id: "lm-341800",
    title: "0.64 Acres - Clarksville Community, Porter, OK",
    price: 13500,
    acres: 0.64,
    county: "Wagoner",
    state: "Oklahoma",
    zip: "74454",
    listingUrl: "https://www.landmodo.com/properties/341800/porter-ok/0-64-acres-clarksville-community-porter-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "Part of exclusive 14-lot collection in Clarksville community.",
    scrapedAt: "2026-03-27"
  }
];

// Helper function to search scraped properties by criteria
export function searchScrapedProperties(criteria: {
  states?: string[];
  counties?: string[];
  maxPrice?: number;
  minAcres?: number;
  maxAcres?: number;
  ownerFinancing?: boolean;
}): ScrapedProperty[] {
  return scrapedProperties.filter(p => {
    if (criteria.states && criteria.states.length > 0) {
      if (!criteria.states.some(s => s.toLowerCase() === p.state.toLowerCase())) return false;
    }
    if (criteria.counties && criteria.counties.length > 0) {
      if (!criteria.counties.some(c => c.toLowerCase() === p.county.toLowerCase())) return false;
    }
    if (criteria.maxPrice && p.price > criteria.maxPrice) return false;
    if (criteria.minAcres && p.acres && p.acres < criteria.minAcres) return false;
    if (criteria.maxAcres && p.acres && p.acres > criteria.maxAcres) return false;
    if (criteria.ownerFinancing && !p.ownerFinancing) return false;
    return true;
  });
}

// Get the list of sites that were searched
export function getSearchedSites(): string[] {
  return ["Landmodo", "LandWatch", "LandSearch", "Land.com", "LandFlip", "Zillow"];
}

// Get last scrape date
export function getLastScrapeDate(): string {
  if (scrapedProperties.length === 0) return "Never";
  return scrapedProperties[0].scrapedAt;
}
