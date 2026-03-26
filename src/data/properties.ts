export interface Property {
  id: number;
  name: string;
  cashPrice: number | null;
  acres: number | null;
  pricePerAcre: number | null;
  downPayment: string;
  monthlyPayment: string;
  monthlyNum: number;
  county: string;
  state: string;
  location: string;
  seller: string;
  sellerType: "LLC" | "Corporation" | "Government" | "TBD";
  wholesaleScore: number; // 1-100
  roadAccess: string;
  powerNearby: string;
  unrestricted: boolean;
  ownerFinancing: boolean;
  rvMobileOk: string;
  listingUrl: string;
  apn: string;
  notes: string;
  lat: number;
  lng: number;
  category: "budget_match" | "negotiate" | "tax_sale" | "over_budget" | "too_small";
  client: string;
  researchDate: string;
  soilQuality: string;
  elevation: string;
}

export interface Client {
  name: string;
  purpose: string;
  targetCounties: string[];
  budgetCashMin: number;
  budgetCashMax: number;
  budgetDown: string;
  budgetMonthly: string;
  acreageMin: number;
  acreageMax: number;
  mustUnrestricted: boolean;
  mustNoHOA: boolean;
  mustOwnerFinancing: boolean;
  mustRoadAccess: string;
  mustLiveOnSite: boolean;
  notes: string;
}

export const clients: Client[] = [
  {
    name: "Marietta",
    purpose: "RV/Mobile Home, Greenhouse/Nursery, Agriculture",
    targetCounties: ["Douglas", "Ozark", "Howell"],
    budgetCashMin: 5000,
    budgetCashMax: 15000,
    budgetDown: "$200-$300",
    budgetMonthly: "$200-$300",
    acreageMin: 1,
    acreageMax: 10,
    mustUnrestricted: true,
    mustNoHOA: true,
    mustOwnerFinancing: true,
    mustRoadAccess: "Maintained — regular car, no 4x4",
    mustLiveOnSite: true,
    notes: "Prefers higher elevation (tornado concern). Away from Branson. Good soil for agriculture.",
  },
  {
    name: "Johnatan",
    purpose: "Land wholesale — buy and resell",
    targetCounties: ["Iron", "Reynolds", "Wayne", "Washington", "Dent"],
    budgetCashMin: 10000,
    budgetCashMax: 40000,
    budgetDown: "Cash or wholesale",
    budgetMonthly: "N/A — cash deals",
    acreageMin: 0.5,
    acreageMax: 40,
    mustUnrestricted: true,
    mustNoHOA: true,
    mustOwnerFinancing: false,
    mustRoadAccess: "Any access",
    mustLiveOnSite: false,
    notes: "Focus on LLC wholesale sellers only. Quick close deals.",
  },
];

export const properties: Property[] = [
  // === MARIETTA LEADS ===
  {
    id: 1, name: "RV/Tiny Home Lot — Lake Truman", cashPrice: 3150, acres: null,
    pricePerAcre: null, downPayment: "TBD", monthlyPayment: "TBD", monthlyNum: 0,
    county: "St. Clair", state: "MO", location: "Lake Truman, MO",
    seller: "American Dirt Properties", sellerType: "LLC", wholesaleScore: 72,
    roadAccess: "TBD", powerNearby: "TBD", unrestricted: true, ownerFinancing: true,
    rvMobileOk: "YES — RV & Tiny Homes explicitly allowed",
    listingUrl: "https://americandirt.us/", apn: "TBD",
    notes: "Explicitly allows full-time RV, tiny homes. No zoning, no restrictions. ⚠️ St. Clair County NOT on MO/AR border.",
    lat: 38.15, lng: -93.78, category: "budget_match", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "TBD", elevation: "~800ft",
  },
  {
    id: 2, name: "Benton County 0.26ac #1", cashPrice: 6250, acres: 0.26,
    pricePerAcre: 24038, downPayment: "$129", monthlyPayment: "$129/mo", monthlyNum: 129,
    county: "Benton", state: "MO", location: "Lincoln, MO 65338",
    seller: "Everland Equity / MT Land Ventures", sellerType: "LLC", wholesaleScore: 38,
    roadAccess: "Eagle Pass (gravel)", powerNearby: "TBD", unrestricted: true,
    ownerFinancing: true, rvMobileOk: "TBD",
    listingUrl: "https://mtlandventures.com/properties/",
    apn: "09-9.0-31-001-005-029.000",
    notes: "Fits budget $129/mo BUT only 0.26ac — too small. Benton County NOT target area.",
    lat: 38.39, lng: -93.39, category: "too_small", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "TBD", elevation: "~900ft",
  },
  {
    id: 3, name: "Ozark County 0.33ac", cashPrice: 4500, acres: 0.33,
    pricePerAcre: 13636, downPayment: "$75-$500", monthlyPayment: "$150/mo", monthlyNum: 150,
    county: "Ozark", state: "MO", location: "Ozark County, MO",
    seller: "Once Upon a Brick Inc.", sellerType: "LLC", wholesaleScore: 55,
    roadAccess: "TBD", powerNearby: "TBD", unrestricted: true, ownerFinancing: true,
    rvMobileOk: "YES — No county zoning",
    listingUrl: "https://onceuponabrick.com/collections/available-land-for-sale",
    apn: "17-0.4-20-002-014-021.002",
    notes: "Fits budget but only 0.33ac — too small for agriculture. Ozark County is TARGET. Ask seller for larger parcels.",
    lat: 36.65, lng: -92.45, category: "too_small", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "TBD", elevation: "~1,200ft",
  },
  {
    id: 4, name: "Camden County 0.41ac", cashPrice: 6297, acres: 0.41,
    pricePerAcre: 15358, downPayment: "Low", monthlyPayment: "$213/mo", monthlyNum: 213,
    county: "Camden", state: "MO", location: "Lake of the Ozarks area",
    seller: "LandCentral", sellerType: "LLC", wholesaleScore: 35,
    roadAccess: "TBD", powerNearby: "TBD", unrestricted: false, ownerFinancing: true,
    rvMobileOk: "TBD — Lake community, possible HOA",
    listingUrl: "https://www.landcentral.com/land-for-sale/missouri", apn: "TBD",
    notes: "$213/mo fits budget BUT possible HOA. Camden Co = Lake of the Ozarks, NOT target.",
    lat: 37.95, lng: -92.80, category: "too_small", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "TBD", elevation: "~1,000ft",
  },
  {
    id: 5, name: "★ Timber Crossing Lot 24", cashPrice: 17000, acres: 6.0,
    pricePerAcre: 2833, downPayment: "$500-$1,500", monthlyPayment: "$170/mo", monthlyNum: 170,
    county: "Douglas", state: "MO", location: "Drury, MO 65638",
    seller: "InstantAcres.com (Jake Ales)", sellerType: "LLC", wholesaleScore: 95,
    roadAccess: "Maintained gravel", powerNearby: "Within 1 mi",
    unrestricted: true, ownerFinancing: true,
    rvMobileOk: "YES — Douglas Co no restrictions",
    listingUrl: "https://www.instantacres.com/properties-for-sale/",
    apn: "TBD — Call 417-767-2223",
    notes: "⭐ BEST OVERALL. List $17K — negotiate $10-12K cash. 6ac perfect for RV+greenhouse+agriculture.",
    lat: 36.89, lng: -92.32, category: "negotiate", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "Ozark forest — amend for agriculture", elevation: "1,300ft",
  },
  {
    id: 6, name: "★ Timber Crossing Lot 19", cashPrice: 18500, acres: 8.81,
    pricePerAcre: 2100, downPayment: "$500-$1,500", monthlyPayment: "$215/mo", monthlyNum: 215,
    county: "Douglas", state: "MO", location: "Drury, MO 65638",
    seller: "InstantAcres.com (Jake Ales)", sellerType: "LLC", wholesaleScore: 93,
    roadAccess: "Maintained gravel", powerNearby: "Within 1 mi",
    unrestricted: true, ownerFinancing: true,
    rvMobileOk: "YES", listingUrl: "https://www.instantacres.com/properties-for-sale/", apn: "TBD",
    notes: "8.81ac = excellent privacy. Negotiate $10-12K cash. $215/mo fits budget if financing.",
    lat: 36.88, lng: -92.33, category: "negotiate", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "Ozark forest", elevation: "1,300ft",
  },
  {
    id: 7, name: "★ Timber Crossing Lot 15", cashPrice: 20500, acres: 9.81,
    pricePerAcre: 2090, downPayment: "$500-$1,500", monthlyPayment: "$240/mo", monthlyNum: 240,
    county: "Douglas", state: "MO", location: "Drury, MO 65638",
    seller: "InstantAcres.com (Jake Ales)", sellerType: "LLC", wholesaleScore: 91,
    roadAccess: "Maintained gravel", powerNearby: "Within 1 mi",
    unrestricted: true, ownerFinancing: true,
    rvMobileOk: "YES", listingUrl: "https://www.instantacres.com/properties-for-sale/", apn: "TBD",
    notes: "9.81ac huge lot. Try $12K cash offer.",
    lat: 36.87, lng: -92.34, category: "negotiate", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "Ozark forest", elevation: "1,300ft",
  },
  {
    id: 8, name: "★★ Douglas County Tax Sale", cashPrice: null, acres: null,
    pricePerAcre: null, downPayment: "Full at auction", monthlyPayment: "N/A — Cash", monthlyNum: 0,
    county: "Douglas", state: "MO", location: "Ava, MO (Courthouse)",
    seller: "Douglas County Collector", sellerType: "Government", wholesaleScore: 98,
    roadAccess: "Varies per parcel", powerNearby: "Varies",
    unrestricted: true, ownerFinancing: false,
    rvMobileOk: "YES — Douglas Co no restrictions",
    listingUrl: "https://douglascountycollector.com/taxsale.php", apn: "In Tax Sale Book",
    notes: "⭐⭐ BEST FOR $10K BUDGET. Annual 4th Monday August. Back taxes = $200-$3,000 for LARGE parcels.",
    lat: 36.95, lng: -92.66, category: "tax_sale", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "Varies", elevation: "1,100-1,700ft",
  },
  {
    id: 9, name: "★★ Ozark County Tax Sale", cashPrice: null, acres: null,
    pricePerAcre: null, downPayment: "Full at auction", monthlyPayment: "N/A — Cash", monthlyNum: 0,
    county: "Ozark", state: "MO", location: "Gainesville, MO (Courthouse)",
    seller: "Ozark County Collector", sellerType: "Government", wholesaleScore: 97,
    roadAccess: "Varies per parcel", powerNearby: "Varies",
    unrestricted: true, ownerFinancing: false,
    rvMobileOk: "YES — Ozark Co no restrictions",
    listingUrl: "https://ozarkcountycollector.com/taxsale.php",
    apn: "2025 Tax Sale Book online",
    notes: "⭐⭐ EXCELLENT. 4th Monday August. 2025 Tax Sale Book is online!",
    lat: 36.49, lng: -92.43, category: "tax_sale", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "Varies", elevation: "1,100-1,700ft",
  },
  {
    id: 10, name: "Ozark County 5.3ac", cashPrice: 18000, acres: 5.3,
    pricePerAcre: 3396, downPayment: "TBD", monthlyPayment: "$500/mo", monthlyNum: 500,
    county: "Ozark", state: "MO", location: "Ozark County, MO",
    seller: "Rural Vacant Land", sellerType: "LLC", wholesaleScore: 65,
    roadAccess: "TBD", powerNearby: "TBD", unrestricted: true, ownerFinancing: true,
    rvMobileOk: "YES",
    listingUrl: "https://ruralvacantland.com/properties/",
    apn: "17-0.4-20-002-013-0001-000",
    notes: "OVER BUDGET monthly ($500). 5.3ac in Ozark County is perfect otherwise. Try to negotiate.",
    lat: 36.60, lng: -92.50, category: "over_budget", client: "Marietta",
    researchDate: "2026-03-24", soilQuality: "TBD", elevation: "~1,200ft",
  },
  // === JOHNATAN LEADS (from previous research) ===
  {
    id: 11, name: "Apache Drive, Irondale", cashPrice: 6997, acres: 0.31,
    pricePerAcre: 22571, downPayment: "$400", monthlyPayment: "$150/mo", monthlyNum: 150,
    county: "Washington", state: "MO", location: "Irondale, MO 63648",
    seller: "Land Direct USA LLC", sellerType: "LLC", wholesaleScore: 90,
    roadAccess: "Paved road nearby", powerNearby: "Available", unrestricted: false,
    ownerFinancing: true, rvMobileOk: "NO — R1 Residential",
    listingUrl: "https://www.landdirectusa.com/", apn: "21-6.0-014-001-009-006.00000",
    notes: "Fully verified. Zoning R1 — mobile/tiny NOT allowed.",
    lat: 37.83, lng: -90.68, category: "budget_match", client: "Johnatan",
    researchDate: "2026-03-24", soilQuality: "N/A", elevation: "~1,000ft",
  },
  {
    id: 12, name: "Highway 72, Ironton", cashPrice: 20000, acres: 4.01,
    pricePerAcre: 4988, downPayment: "Negotiate", monthlyPayment: "TBD", monthlyNum: 0,
    county: "Iron", state: "MO", location: "Ironton, MO",
    seller: "TBD — Verify", sellerType: "TBD", wholesaleScore: 70,
    roadAccess: "Highway 72 frontage", powerNearby: "Available",
    unrestricted: true, ownerFinancing: false, rvMobileOk: "YES",
    listingUrl: "https://www.landwatch.com/missouri-land-for-sale/iron-county", apn: "TBD",
    notes: "237 days on market. Good wholesale opportunity.",
    lat: 37.60, lng: -90.63, category: "negotiate", client: "Johnatan",
    researchDate: "2026-03-24", soilQuality: "N/A", elevation: "~1,100ft",
  },
  {
    id: 13, name: "Cres 115, Annapolis", cashPrice: 25000, acres: 20,
    pricePerAcre: 1250, downPayment: "Negotiate", monthlyPayment: "N/A", monthlyNum: 0,
    county: "Iron", state: "MO", location: "Annapolis, MO",
    seller: "TBD", sellerType: "TBD", wholesaleScore: 85,
    roadAccess: "County road", powerNearby: "TBD",
    unrestricted: true, ownerFinancing: false, rvMobileOk: "YES",
    listingUrl: "https://www.landwatch.com/missouri-land-for-sale/iron-county", apn: "TBD",
    notes: "TOP RECOMMENDATION. $1,250/acre. 20 acres.",
    lat: 37.36, lng: -90.73, category: "budget_match", client: "Johnatan",
    researchDate: "2026-03-24", soilQuality: "N/A", elevation: "~900ft",
  },
  {
    id: 14, name: "Coffman Rd, Wayne Co", cashPrice: 38000, acres: 40,
    pricePerAcre: 950, downPayment: "Negotiate", monthlyPayment: "N/A", monthlyNum: 0,
    county: "Wayne", state: "MO", location: "Wayne County, MO",
    seller: "TBD", sellerType: "TBD", wholesaleScore: 82,
    roadAccess: "Coffman Rd (gravel)", powerNearby: "TBD",
    unrestricted: true, ownerFinancing: false, rvMobileOk: "YES",
    listingUrl: "https://www.landwatch.com/missouri-land-for-sale/wayne-county", apn: "TBD",
    notes: "$950/acre — great wholesale price. 40 acres.",
    lat: 37.11, lng: -90.45, category: "budget_match", client: "Johnatan",
    researchDate: "2026-03-24", soilQuality: "N/A", elevation: "~700ft",
  },
  {
    id: 15, name: "Wayne 505, Greenville", cashPrice: 3500, acres: 2.17,
    pricePerAcre: 1613, downPayment: "Cash", monthlyPayment: "N/A", monthlyNum: 0,
    county: "Wayne", state: "MO", location: "Greenville, MO",
    seller: "TBD", sellerType: "TBD", wholesaleScore: 75,
    roadAccess: "TBD", powerNearby: "TBD",
    unrestricted: true, ownerFinancing: false, rvMobileOk: "YES",
    listingUrl: "https://www.landwatch.com/missouri-land-for-sale/wayne-county", apn: "TBD",
    notes: "Very cheap. Good flip potential.",
    lat: 37.13, lng: -90.45, category: "budget_match", client: "Johnatan",
    researchDate: "2026-03-24", soilQuality: "N/A", elevation: "~700ft",
  },
];

export const countyData = [
  { county: "Douglas", state: "MO", zoning: "NONE", buildingCodes: "None", mobileRV: "Allowed", offGrid: "Allowed", taxRate: "0.56%", assessorPhone: "417-683-2829", taxSale: "4th Mon August, Ava", rating: 5, tornado: "Moderate-High", elevation: "1,100-1,700ft" },
  { county: "Ozark", state: "MO", zoning: "NONE", buildingCodes: "None", mobileRV: "Allowed", offGrid: "Allowed", taxRate: "0.55%", assessorPhone: "417-679-4705", taxSale: "4th Mon August, Gainesville", rating: 5, tornado: "Moderate-High", elevation: "1,100-1,700ft" },
  { county: "Howell", state: "MO", zoning: "NONE", buildingCodes: "Minimal", mobileRV: "Allowed", offGrid: "Allowed", taxRate: "0.58%", assessorPhone: "417-256-2502", taxSale: "Annual — call collector", rating: 4, tornado: "Moderate", elevation: "1,000-1,400ft" },
  { county: "Oregon", state: "MO", zoning: "NONE", buildingCodes: "None", mobileRV: "Allowed", offGrid: "Allowed", taxRate: "0.52%", assessorPhone: "417-778-7231", taxSale: "Annual — call collector", rating: 5, tornado: "Moderate-High", elevation: "800-1,400ft" },
  { county: "Iron", state: "MO", zoning: "NONE", buildingCodes: "Minimal", mobileRV: "Allowed", offGrid: "Allowed", taxRate: "0.65%", assessorPhone: "573-546-5700 x150", taxSale: "Annual", rating: 5, tornado: "Low", elevation: "900-1,300ft" },
  { county: "Wayne", state: "MO", zoning: "NONE", buildingCodes: "Minimal", mobileRV: "Allowed", offGrid: "Allowed", taxRate: "0.58%", assessorPhone: "573-224-3011", taxSale: "waynecountycollector.com/taxsale.php", rating: 5, tornado: "Low", elevation: "500-1,000ft" },
  { county: "Adair", state: "MO", zoning: "No county zoning", buildingCodes: "Kirksville codes", mobileRV: "Check", offGrid: "Allowed", taxRate: "0.80%", assessorPhone: "660-665-4423", taxSale: "TBD", rating: 2, tornado: "Lower", elevation: "700-900ft" },
];
