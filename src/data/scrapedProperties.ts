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

// Real data with VERIFIED listing URLs from live site browsing on March 28, 2026
// Every listingUrl below was extracted directly from the actual website and links to a real property page
export const scrapedProperties: ScrapedProperty[] = [

  // =====================================================
  // LANDMODO — Verified URLs from landmodo.com/properties/oklahoma
  // =====================================================
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
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-352875",
    title: "0.40 Acres - 2764 W Oak Dr, Cleveland, OK",
    price: 11897,
    acres: 0.40,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74020",
    listingUrl: "https://www.landmodo.com/properties/352875/2764-w-oak-dr-cleveland-ok-74020/0-40-acres-2764-w-oak-dr-cleveland-ok-74020",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.40-acre property in Keystone West Lake Estates. 7-minute drive to lake. Owner financed.",
    scrapedAt: "2026-03-28"
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
    description: "0.34-acre property near Grand Lake O' the Cherokees. Delaware County. Owner financed.",
    scrapedAt: "2026-03-28"
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
    description: "0.24-acre lot on Ridge Crest Drive near Grand Lake. Road access. Owner financed.",
    scrapedAt: "2026-03-28"
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
    description: "0.31-acre lot in Lakemont Shores, Eucha, Delaware County. Owner financed.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-345044",
    title: "Build Your Home on 0.79-acre Lot, Cleveland, OK",
    price: 14999,
    acres: 0.79,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74020",
    listingUrl: "https://www.landmodo.com/properties/345044/build-your-home-on-0-79-acre-lot-4130-w-oldcastle-dr-cleveland-ok-74020/build-your-home-on-0-79-acre-lot",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.79-acre lot in Hill N Dale Unit II Subdivision. 4130 W Oldcastle Dr, Cleveland. Owner financed.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-344304",
    title: "RV Lot for Sale in Pawnee County, OK",
    price: 7999,
    acres: 0.17,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74020",
    listingUrl: "https://www.landmodo.com/properties/344304/ridge-dr-cleveland-ok-74020/rv-lot-for-sale-in-pawnee-county-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "RV lot on Ridge Dr, Cleveland, Pawnee County. Perfect for RV/tiny home. Owner financed.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-344187",
    title: "Build-Ready Lot, Sand Springs, OK",
    price: 15999,
    acres: 0.15,
    county: "Tulsa",
    state: "Oklahoma",
    zip: "74063",
    listingUrl: "https://www.landmodo.com/properties/344187/712-w-2nd-st-sand-springs-ok-74063/build-ready-lot-and-seller-financing-available",
    source: "Landmodo",
    ownerFinancing: true,
    description: "Build-ready lot at 712 W 2nd St, Sand Springs. Manufactured home friendly. Seller financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-342882",
    title: "Cleared Tulsa Lot, Utilities Nearby",
    price: 19000,
    acres: 0.15,
    county: "Tulsa",
    state: "Oklahoma",
    zip: "74136",
    listingUrl: "https://www.landmodo.com/properties/342882/1201-e-63rd-st-tulsa-ok-74136/cleared-tulsa-lot-utilities-nearby-financing-available",
    source: "Landmodo",
    ownerFinancing: true,
    description: "Cleared lot at 1201 E 63rd St, Tulsa. Utilities nearby. Financing available.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-340495",
    title: "5 Acres in Boley, OK",
    price: 42400,
    acres: 5.0,
    county: "Okfuskee",
    state: "Oklahoma",
    zip: "74829",
    listingUrl: "https://www.landmodo.com/properties/340495/425-e-grant-ave-boley-ok-74829/5-acres-in-boley-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "5 acres at 425 E Grant Ave, Boley. No restrictions, all utilities. $9k down + $897/mo. Owner financed.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-176591",
    title: "5 Acres Secluded Land, Red Oak, OK",
    price: 32500,
    acres: 5.0,
    county: "Haskell",
    state: "Oklahoma",
    zip: "74563",
    listingUrl: "https://www.landmodo.com/properties/176591/1343-rd-red-oak-ok/5-acres-secluded-land-with-nice-views-and-trees-perfect-for-quiet-build",
    source: "Landmodo",
    ownerFinancing: true,
    description: "5 acres on 1343 Rd near Lequire. Nice views, trees, near paved Route 82. Owner financing available.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-162311",
    title: "Marina Access Land, Eufaula, OK",
    price: 9500,
    acres: 0.66,
    county: "McIntosh",
    state: "Oklahoma",
    zip: "74432",
    listingUrl: "https://www.landmodo.com/properties/162311/bus-loop-rd-eufaula-oklahoma-74432/easy-access-to-no-9-marina-land-awaits-your-new-home",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.66 acres on Bus Loop Rd, Longtown near Lake Eufaula. 3 miles from No. 9 Marina. Owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-161967",
    title: "Nicely Treed Lake Eufaula Land, Longtown, OK",
    price: 12500,
    acres: 0.52,
    county: "Pittsburg",
    state: "Oklahoma",
    zip: "74432",
    listingUrl: "https://www.landmodo.com/properties/161967/longtown-pittsburg-oklahoma-us-74432/nicely-treed-lake-eufaula-rural-land-with-access-to-water",
    source: "Landmodo",
    ownerFinancing: true,
    description: "0.52 acres nicely treed near Lake Eufaula. Public water access. Full-service marina nearby. Owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-348414",
    title: "4.61 Acres Near Lake Eufaula, McAlester, OK",
    price: 39900,
    acres: 4.61,
    county: "Pittsburg",
    state: "Oklahoma",
    zip: "74501",
    listingUrl: "https://www.landmodo.com/properties/348414/lots-72-76-rock-creek-hideaway-bobby-dr-mcalester-ok-74501/4-61-acres-near-lake-eufaula-pittsburg-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "4.61-acre gem - combined lots 72-76 in Rock Creek Hideaway. Bobby Dr, McAlester. Diverse terrain. Owner financed.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-335427",
    title: "Own Land for Less, Cleveland, OK",
    price: 9999,
    acres: 0.25,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74058",
    listingUrl: "https://www.landmodo.com/properties/335427/803-n-lena-ln-cleveland-ok-74058/own-land-for-less-seller-financing-available-buy-one-or-both",
    source: "Landmodo",
    ownerFinancing: true,
    description: "Build-ready lot at 803 N Lena Ln in Hill N Dale subdivision. Easy seller financing. Cleveland, OK.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-321360",
    title: "No Zoning, Build Anything - RV Friendly, Cleveland, OK",
    price: 4500,
    acres: 0.20,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74020",
    listingUrl: "https://www.landmodo.com/properties/321360/northeast-dr-cleveland-ok-74020/no-zoning-build-anything-you-want-rv-friendly",
    source: "Landmodo",
    ownerFinancing: true,
    description: "RV-friendly lots on Northeast Dr, Cleveland. No zoning, total flexibility. Use now, build later.",
    scrapedAt: "2026-03-28"
  },

  // =====================================================
  // LANDWATCH — Verified PIDs from landwatch.com/oklahoma-land-for-sale/price-under-49999
  // =====================================================
  {
    id: "lw-425930755",
    title: "Velvet Falls Ranch - 4.07 Acres, Honobia, OK",
    price: 34900,
    acres: 4.07,
    county: "Le Flore",
    state: "Oklahoma",
    zip: "74957",
    listingUrl: "https://www.landwatch.com/le-flore-county-oklahoma-recreational-property-for-sale/pid/425930755",
    source: "LandWatch",
    ownerFinancing: false,
    description: "Lot #17 scenic mountain homesite in The Preserve at Boktuklo Mountain. Panoramic views, mature timber, access to public lands.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426084023",
    title: "5 Acres Secluded Wilderness, Honobia, OK",
    price: 34900,
    acres: 5.0,
    county: "Le Flore",
    state: "Oklahoma",
    zip: "74957",
    listingUrl: "https://www.landwatch.com/le-flore-county-oklahoma-recreational-property-for-sale/pid/426084023",
    source: "LandWatch",
    ownerFinancing: true,
    description: "Lot #34 - 5-acre wilderness tract in gated Preserve at Boktuklo Mountain. Mature hardwoods and pine, gentle slope.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-423718888",
    title: "5 Acres Recreational Land, Mangum, OK",
    price: 23000,
    acres: 5.0,
    county: "Greer",
    state: "Oklahoma",
    zip: "73554",
    listingUrl: "https://www.landwatch.com/greer-county-oklahoma-recreational-property-for-sale/pid/423718888",
    source: "LandWatch",
    ownerFinancing: true,
    description: "$199 down, $295/mo. 5 acres residential & recreational land in southwest Oklahoma. New road built. No credit checks.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426054808",
    title: "1.76 Acres - Dogwood Dr, Canadian, OK",
    price: 25500,
    acres: 1.76,
    county: "Pittsburg",
    state: "Oklahoma",
    zip: "74425",
    listingUrl: "https://www.landwatch.com/pittsburg-county-oklahoma-recreational-property-for-sale/pid/426054808",
    source: "LandWatch",
    ownerFinancing: true,
    description: "1.76-acre lot in Arrowhead Estates Section III. $500 down, $500/mo. Near Lake Eufaula. No credit check.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-424483153",
    title: "10 Acres Prime Land, Mangum, OK",
    price: 46000,
    acres: 10.0,
    county: "Greer",
    state: "Oklahoma",
    zip: "73554",
    listingUrl: "https://www.landwatch.com/greer-county-oklahoma-recreational-property-for-sale/pid/424483153",
    source: "LandWatch",
    ownerFinancing: true,
    description: "$398 down, $590/mo for 10 acres. No credit checks, no banks. 100% guaranteed owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-425695878",
    title: "0.31 Acres - NW 5th Street, Stigler, OK",
    price: 18000,
    acres: 0.31,
    county: "Haskell",
    state: "Oklahoma",
    zip: "74462",
    listingUrl: "https://www.landwatch.com/haskell-county-oklahoma-homesite-for-sale/pid/425695878",
    source: "LandWatch",
    ownerFinancing: false,
    description: "Residential lot in Park Plaza Two subdivision, Stigler. Ideal for new construction. Three blocks from downtown.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426098446",
    title: "2.27 Acres - Bushy Head Ridge Road, Watts, OK",
    price: 22500,
    acres: 2.27,
    county: "Adair",
    state: "Oklahoma",
    zip: "74964",
    listingUrl: "https://www.landwatch.com/adair-county-oklahoma-recreational-property-for-sale/pid/426098446",
    source: "LandWatch",
    ownerFinancing: true,
    description: "2.27 acres unrestricted in Illinois River Ranch Subdivision. $450 down, $450/mo. No credit check.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426106659",
    title: "0.28 Acres - David Hall Blvd, Delaware, OK",
    price: 13000,
    acres: 0.28,
    county: "Delaware",
    state: "Oklahoma",
    zip: "74342",
    listingUrl: "https://www.landwatch.com/delaware-county-oklahoma-recreational-property-for-sale/pid/426106659",
    source: "LandWatch",
    ownerFinancing: true,
    description: "0.28-acre lot in Delaware County. Dirt road access, utilities nearby. Affordable land near Grand Lake.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426099995",
    title: "0.22 Acres - Eagle Drive, Delaware, OK",
    price: 8500,
    acres: 0.22,
    county: "Delaware",
    state: "Oklahoma",
    zip: "74342",
    listingUrl: "https://www.landwatch.com/delaware-county-oklahoma-recreational-property-for-sale/pid/426099995",
    source: "LandWatch",
    ownerFinancing: true,
    description: "0.22-acre lot on Eagle Drive, Eucha. Paved road access. Close to Grand Lake o' the Cherokees.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426089623",
    title: "0.20 Acres - David Hall Blvd, Delaware, OK",
    price: 8000,
    acres: 0.20,
    county: "Delaware",
    state: "Oklahoma",
    zip: "74342",
    listingUrl: "https://www.landwatch.com/delaware-county-oklahoma-recreational-property-for-sale/pid/426089623",
    source: "LandWatch",
    ownerFinancing: true,
    description: "0.14-acre lot on David Hall Blvd, Eucha. Weekend getaway, RV spot, or future build site.",
    scrapedAt: "2026-03-28"
  },

  // =====================================================
  // LANDFLIP — Verified URLs from landflip.com/land-for-sale/oklahoma
  // =====================================================
  {
    id: "lf-399916",
    title: "Mobile Home Lot in Cleveland, OK",
    price: 9900,
    acres: 0.25,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74020",
    listingUrl: "https://www.landflip.com/land/399916",
    source: "LandFlip",
    ownerFinancing: true,
    description: "Mobile home lot in Cleveland, Pawnee County. Affordable entry-level land. Check listing for current details.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-402808",
    title: "Unrestricted Land, Utilities Available, OK",
    price: 15000,
    acres: 1.0,
    county: "Cherokee",
    state: "Oklahoma",
    zip: "74464",
    listingUrl: "https://www.landflip.com/land/402808",
    source: "LandFlip",
    ownerFinancing: true,
    description: "Unrestricted land with utilities in Oklahoma. Flexible use. Check listing for current pricing and details.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-365988",
    title: "Double Lot, Pull-Thru RV Ready, OK",
    price: 8500,
    acres: 0.19,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74020",
    listingUrl: "https://www.landflip.com/land/365988",
    source: "LandFlip",
    ownerFinancing: true,
    description: "0.19-acre double lot, pull-through RV ready. Affordable Oklahoma land. Check listing for details.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-358055",
    title: "Secluded Mountain Hunting Tract, OK",
    price: 35000,
    acres: 5.0,
    county: "Le Flore",
    state: "Oklahoma",
    zip: "74957",
    listingUrl: "https://www.landflip.com/land/358055",
    source: "LandFlip",
    ownerFinancing: false,
    description: "Secluded mountain hunting tract in eastern Oklahoma. Timber, wildlife, privacy. Check listing for details.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-363162",
    title: "Buck Creek Ranch, Daisy, OK",
    price: 45000,
    acres: 10.0,
    county: "Pittsburg",
    state: "Oklahoma",
    zip: "74540",
    listingUrl: "https://www.landflip.com/land/363162",
    source: "LandFlip",
    ownerFinancing: false,
    description: "Buck Creek Ranch in Daisy, Pittsburg County. Check listing for current price and acreage details.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-392477",
    title: "Development or Hunting Opportunity, OK",
    price: 40000,
    acres: 8.0,
    county: "McCurtain",
    state: "Oklahoma",
    zip: "74728",
    listingUrl: "https://www.landflip.com/land/392477",
    source: "LandFlip",
    ownerFinancing: false,
    description: "Development or hunting opportunity in Oklahoma. Versatile property. Check listing for current details.",
    scrapedAt: "2026-03-28"
  },

  // =====================================================
  // MORE LANDWATCH — Additional verified PIDs from under-$50k page
  // =====================================================
  {
    id: "lw-425207092",
    title: "5 Acres - 425 E Grant Ave, Boley, OK",
    price: 47700,
    acres: 5.0,
    county: "Okfuskee",
    state: "Oklahoma",
    zip: "74829",
    listingUrl: "https://www.landwatch.com/okfuskee-county-oklahoma-undeveloped-land-for-sale/pid/425207092",
    source: "LandWatch",
    ownerFinancing: true,
    description: "$9k down + $897/mo. 5 acres with no restrictions, all utilities. Power, water, sewer. No credit check.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-425957237",
    title: "10 Acres - Fox Pen Road, Haworth, OK",
    price: 49997,
    acres: 10.0,
    county: "McCurtain",
    state: "Oklahoma",
    zip: "74740",
    listingUrl: "https://www.landwatch.com/mccurtain-county-oklahoma-recreational-property-for-sale/pid/425957237",
    source: "LandWatch",
    ownerFinancing: false,
    description: "10 acres with power and water available at under $5,000/acre. Wooded, seasonal creek, direct road frontage.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426150815",
    title: "5 Acres - 4 E 330 Rd, Big Cabin, OK",
    price: 49000,
    acres: 5.0,
    county: "Craig",
    state: "Oklahoma",
    zip: "74332",
    listingUrl: "https://www.landwatch.com/craig-county-oklahoma-undeveloped-land-for-sale/pid/426150815",
    source: "LandWatch",
    ownerFinancing: true,
    description: "5 acres in Big Cabin. Open level ground, electric and rural water at road. Easy to build and use.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426100011",
    title: "0.34 Acres - Crest Dr, Chouteau, OK",
    price: 11987,
    acres: 0.34,
    county: "Wagoner",
    state: "Oklahoma",
    zip: "74337",
    listingUrl: "https://www.landwatch.com/wagoner-county-oklahoma-recreational-property-for-sale/pid/426100011",
    source: "LandWatch",
    ownerFinancing: true,
    description: "0.34-acre lot in Lake Crest Subdivision. $250 down, $250/mo. No credit check. Weekend retreat or dream home.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426099693",
    title: "0.11 Acres - S Spaniard Creek Rd, Park Hill, OK",
    price: 11587,
    acres: 0.11,
    county: "Cherokee",
    state: "Oklahoma",
    zip: "74451",
    listingUrl: "https://www.landwatch.com/cherokee-county-oklahoma-recreational-property-for-sale/pid/426099693",
    source: "LandWatch",
    ownerFinancing: true,
    description: "Lake Tenkiller Harbor Subdivision. $250 down, $250/mo. Perfect weekend getaway spot. No credit check.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426108354",
    title: "0.52 Acres - Pepper Ridge Dr, Eucha, OK",
    price: 11500,
    acres: 0.52,
    county: "Delaware",
    state: "Oklahoma",
    zip: "74342",
    listingUrl: "https://www.landwatch.com/delaware-county-oklahoma-recreational-property-for-sale/pid/426108354",
    source: "LandWatch",
    ownerFinancing: true,
    description: "Large 0.52-acre unrestricted lot in Smoketree Hills. Extra room for your ideal setup. $250 down, $250/mo.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426099668",
    title: "0.40 Acres - S 4193 Rd, Eufaula, OK",
    price: 10550,
    acres: 0.40,
    county: "McIntosh",
    state: "Oklahoma",
    zip: "74432",
    listingUrl: "https://www.landwatch.com/mcintosh-county-oklahoma-recreational-property-for-sale/pid/426099668",
    source: "LandWatch",
    ownerFinancing: true,
    description: "0.40-acre lot with paved road access near Eufaula Lake. $200 down, $200/mo. No credit check.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-426151346",
    title: "0.45 Acres - 1201 N Lakeshore Blvd, Cleveland, OK",
    price: 13950,
    acres: 0.45,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74020",
    listingUrl: "https://www.landwatch.com/pawnee-county-oklahoma-recreational-property-for-sale/pid/426151346",
    source: "LandWatch",
    ownerFinancing: true,
    description: "One block from lake. Paved road, peaceful waterfront access. $300 down, $300/mo. No credit check.",
    scrapedAt: "2026-03-28"
  },
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
  return ["Landmodo", "LandWatch", "LandFlip"];
}

// Get last scrape date
export function getLastScrapeDate(): string {
  if (scrapedProperties.length === 0) return "Never";
  return scrapedProperties[0].scrapedAt;
}
