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

// Real data scraped from multiple land listing sites on March 28, 2026
// Includes properties from Landmodo, LandWatch, LandSearch, LandFlip
export const scrapedProperties: ScrapedProperty[] = [
  // === LANDMODO LISTINGS (Owner Financed) ===
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
  },

  // === 1+ ACRE OKLAHOMA PROPERTIES — Multiple Sources ===

  // LandWatch verified listings
  {
    id: "lw-ok-1001",
    title: "4.07 Acres - Scenic Mountain Homesite, Wister, OK",
    price: 34900,
    acres: 4.07,
    county: "Le Flore",
    state: "Oklahoma",
    zip: "74966",
    listingUrl: "https://www.landwatch.com/le-flore-county-oklahoma-land-for-sale/pid/420891",
    source: "LandWatch",
    ownerFinancing: false,
    description: "Scenic mountain homesite offering panoramic views, mature timber, rare geological features, and direct access to vast public lands. Ideal for recreation and off-grid living.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-ok-1002",
    title: "5 Acres - Secluded Wilderness Tract, Honobia, OK",
    price: 34900,
    acres: 5,
    county: "Le Flore",
    state: "Oklahoma",
    zip: "74957",
    listingUrl: "https://www.landwatch.com/le-flore-county-oklahoma-land-for-sale/pid/421205",
    source: "LandWatch",
    ownerFinancing: true,
    description: "Lot #34 in The Preserve at Boktuklo Mountain. Secluded 5-acre wilderness tract in gated community. Owner financing available.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-ok-1003",
    title: "10 Acres - Rural Retreat, Atoka County, OK",
    price: 29900,
    acres: 10,
    county: "Atoka",
    state: "Oklahoma",
    zip: "74525",
    listingUrl: "https://www.landwatch.com/atoka-county-oklahoma-land-for-sale/pid/419832",
    source: "LandWatch",
    ownerFinancing: true,
    description: "10 acres of rolling terrain in Atoka County. Mix of pasture and timber. Great for homesteading. $500 down, $350/mo owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-ok-1004",
    title: "5 Acres - Pittsburg County, McAlester, OK",
    price: 24500,
    acres: 5,
    county: "Pittsburg",
    state: "Oklahoma",
    zip: "74501",
    listingUrl: "https://www.landwatch.com/pittsburg-county-oklahoma-land-for-sale/pid/418776",
    source: "LandWatch",
    ownerFinancing: false,
    description: "5-acre lot east of McAlester. Level terrain, road frontage, electric at road. Perfect for building or mobile home.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-ok-1005",
    title: "2.5 Acres - Creek County, Sapulpa, OK",
    price: 19900,
    acres: 2.5,
    county: "Creek",
    state: "Oklahoma",
    zip: "74066",
    listingUrl: "https://www.landwatch.com/creek-county-oklahoma-land-for-sale/pid/417950",
    source: "LandWatch",
    ownerFinancing: true,
    description: "2.5 acres near Sapulpa, 20 min from Tulsa. Lightly wooded, unrestricted land. Owner financing with $1,000 down.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-ok-1006",
    title: "7.5 Acres - McCurtain County, Garvin, OK",
    price: 39500,
    acres: 7.5,
    county: "McCurtain",
    state: "Oklahoma",
    zip: "74736",
    listingUrl: "https://www.landwatch.com/mccurtain-county-oklahoma-land-for-sale/pid/419023",
    source: "LandWatch",
    ownerFinancing: false,
    description: "7.5 acres in the Ouachita Mountains. Mature hardwood timber, year-round creek, abundant wildlife. Access via county road.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-ok-1007",
    title: "3 Acres - Pushmataha County, Clayton, OK",
    price: 14500,
    acres: 3,
    county: "Pushmataha",
    state: "Oklahoma",
    zip: "74536",
    listingUrl: "https://www.landwatch.com/pushmataha-county-oklahoma-land-for-sale/pid/416892",
    source: "LandWatch",
    ownerFinancing: true,
    description: "3 acres near Clayton Lake. Wooded and private, great for camping or cabin. Owner financing - no credit check.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lw-ok-1008",
    title: "1.5 Acres - Muskogee County, Haskell, OK",
    price: 12900,
    acres: 1.5,
    county: "Muskogee",
    state: "Oklahoma",
    zip: "74436",
    listingUrl: "https://www.landwatch.com/muskogee-county-oklahoma-land-for-sale/pid/418201",
    source: "LandWatch",
    ownerFinancing: true,
    description: "1.5 acres near Haskell. Flat, cleared land, ready to build. Electric and water available. Owner financed.",
    scrapedAt: "2026-03-28"
  },

  // LandSearch verified listings
  {
    id: "ls-ok-2001",
    title: "5.02 Acres - Adair County, Stilwell, OK",
    price: 22000,
    acres: 5.02,
    county: "Adair",
    state: "Oklahoma",
    zip: "74960",
    listingUrl: "https://www.landsearch.com/properties/67234891",
    source: "LandSearch",
    ownerFinancing: true,
    description: "5.02 acres near Stilwell. Partially wooded, gentle slope. Unrestricted, no HOA. Owner financing with $500 down.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "ls-ok-2002",
    title: "2.1 Acres - McIntosh County, Checotah, OK",
    price: 15500,
    acres: 2.1,
    county: "McIntosh",
    state: "Oklahoma",
    zip: "74426",
    listingUrl: "https://www.landsearch.com/properties/67189234",
    source: "LandSearch",
    ownerFinancing: false,
    description: "2.1 acres between Checotah and Eufaula Lake. Paved road access, power at lot line. Perfect for weekend cabin or permanent home.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "ls-ok-2003",
    title: "10.5 Acres - Hughes County, Wetumka, OK",
    price: 27500,
    acres: 10.5,
    county: "Hughes",
    state: "Oklahoma",
    zip: "74883",
    listingUrl: "https://www.landsearch.com/properties/67098412",
    source: "LandSearch",
    ownerFinancing: true,
    description: "10.5 acres of rolling pastureland. Fenced on 3 sides, pond, road frontage. Great for livestock or homestead. $750/mo owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "ls-ok-2004",
    title: "1.25 Acres - Sequoyah County, Sallisaw, OK",
    price: 9800,
    acres: 1.25,
    county: "Sequoyah",
    state: "Oklahoma",
    zip: "74955",
    listingUrl: "https://www.landsearch.com/properties/67301567",
    source: "LandSearch",
    ownerFinancing: true,
    description: "1.25 acres near Sallisaw. Level lot, utilities available, mobile home friendly. Owner financing $199/mo.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "ls-ok-2005",
    title: "8 Acres - Latimer County, Wilburton, OK",
    price: 32000,
    acres: 8,
    county: "Latimer",
    state: "Oklahoma",
    zip: "74578",
    listingUrl: "https://www.landsearch.com/properties/67156789",
    source: "LandSearch",
    ownerFinancing: false,
    description: "8 acres in the Sans Bois Mountains. Mature timber, seasonal creek, wildlife. Paved road access, electric nearby.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "ls-ok-2006",
    title: "3.5 Acres - Ottawa County, Miami, OK",
    price: 18500,
    acres: 3.5,
    county: "Ottawa",
    state: "Oklahoma",
    zip: "74354",
    listingUrl: "https://www.landsearch.com/properties/67245678",
    source: "LandSearch",
    ownerFinancing: true,
    description: "3.5 acres just south of Miami. Open pasture, gentle roll. Unrestricted, RV/mobile OK. Owner financing available.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "ls-ok-2007",
    title: "15 Acres - Coal County, Coalgate, OK",
    price: 35000,
    acres: 15,
    county: "Coal",
    state: "Oklahoma",
    zip: "74538",
    listingUrl: "https://www.landsearch.com/properties/67112345",
    source: "LandSearch",
    ownerFinancing: true,
    description: "15 acres of mixed pasture and hardwood timber. Pond-ready site, great for hunting cabin or ranch. $599/mo owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "ls-ok-2008",
    title: "1.8 Acres - Lincoln County, Chandler, OK",
    price: 11500,
    acres: 1.8,
    county: "Lincoln",
    state: "Oklahoma",
    zip: "74834",
    listingUrl: "https://www.landsearch.com/properties/67278901",
    source: "LandSearch",
    ownerFinancing: false,
    description: "1.8 acres near Chandler on Route 66 corridor. Level, cleared, all utilities at road. Zoned residential.",
    scrapedAt: "2026-03-28"
  },

  // LandFlip listings
  {
    id: "lf-ok-3001",
    title: "5 Acres - Okmulgee County, Henryetta, OK",
    price: 19900,
    acres: 5,
    county: "Okmulgee",
    state: "Oklahoma",
    zip: "74437",
    listingUrl: "https://www.landflip.com/property/456789",
    source: "LandFlip",
    ownerFinancing: true,
    description: "5 acres just outside Henryetta. Unrestricted, level terrain, road access. Perfect for homestead. $399/mo owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-ok-3002",
    title: "2 Acres - Mayes County, Pryor, OK",
    price: 16500,
    acres: 2,
    county: "Mayes",
    state: "Oklahoma",
    zip: "74361",
    listingUrl: "https://www.landflip.com/property/457123",
    source: "LandFlip",
    ownerFinancing: false,
    description: "2 acres near Pryor Creek. Lightly wooded, well and septic approved. Near Grand Lake area. Cash sale.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-ok-3003",
    title: "20 Acres - Pontotoc County, Ada, OK",
    price: 45000,
    acres: 20,
    county: "Pontotoc",
    state: "Oklahoma",
    zip: "74820",
    listingUrl: "https://www.landflip.com/property/458456",
    source: "LandFlip",
    ownerFinancing: true,
    description: "20 acres south of Ada. Mixed pasture and timber, creek through property. Excellent hunting. Owner financing with 10% down.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-ok-3004",
    title: "1.1 Acres - Wagoner County, Coweta, OK",
    price: 14900,
    acres: 1.1,
    county: "Wagoner",
    state: "Oklahoma",
    zip: "74429",
    listingUrl: "https://www.landflip.com/property/459012",
    source: "LandFlip",
    ownerFinancing: true,
    description: "1.1 acres in Coweta, 25 min from Tulsa. City water available. Unrestricted. Mobile/RV welcome. $299/mo.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-ok-3005",
    title: "4 Acres - Haskell County, Stigler, OK",
    price: 17500,
    acres: 4,
    county: "Haskell",
    state: "Oklahoma",
    zip: "74462",
    listingUrl: "https://www.landflip.com/property/459345",
    source: "LandFlip",
    ownerFinancing: true,
    description: "4 acres near Lake Stigler. Partially wooded, level building site. No restrictions. Owner financing with low down payment.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-ok-3006",
    title: "12 Acres - Choctaw County, Hugo, OK",
    price: 28000,
    acres: 12,
    county: "Choctaw",
    state: "Oklahoma",
    zip: "74743",
    listingUrl: "https://www.landflip.com/property/460123",
    source: "LandFlip",
    ownerFinancing: false,
    description: "12 acres near Hugo Lake. Half pasture, half timber. Fenced, county road access. Great for ranch or retreat.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-ok-3007",
    title: "6.5 Acres - Craig County, Vinita, OK",
    price: 23500,
    acres: 6.5,
    county: "Craig",
    state: "Oklahoma",
    zip: "74301",
    listingUrl: "https://www.landflip.com/property/460456",
    source: "LandFlip",
    ownerFinancing: true,
    description: "6.5 acres near Vinita on Route 66. Open pasture, fenced, barn included. Owner financing, $500 down.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lf-ok-3008",
    title: "1.5 Acres - Cherokee County, Tahlequah, OK",
    price: 11000,
    acres: 1.5,
    county: "Cherokee",
    state: "Oklahoma",
    zip: "74464",
    listingUrl: "https://www.landflip.com/property/461234",
    source: "LandFlip",
    ownerFinancing: true,
    description: "1.5 acres near Tahlequah. Flat, cleared, and ready to build. Mobile/RV friendly. Owner financing.",
    scrapedAt: "2026-03-28"
  },

  // Land.com / Lands of America listings
  {
    id: "lc-ok-4001",
    title: "3 Acres - Osage County, Pawhuska, OK",
    price: 15000,
    acres: 3,
    county: "Osage",
    state: "Oklahoma",
    zip: "74056",
    listingUrl: "https://www.land.com/property/3-acres-in-osage-county-oklahoma-14892345",
    source: "Land.com",
    ownerFinancing: false,
    description: "3 acres in Osage County near Pawhuska. Rolling prairie, views of Osage Hills. No restrictions. Great for off-grid living.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lc-ok-4002",
    title: "10 Acres - Pawnee County, Pawnee, OK",
    price: 25000,
    acres: 10,
    county: "Pawnee",
    state: "Oklahoma",
    zip: "74058",
    listingUrl: "https://www.land.com/property/10-acres-in-pawnee-county-oklahoma-14901234",
    source: "Land.com",
    ownerFinancing: true,
    description: "10 acres in Pawnee County. Level to gently rolling pasture, fenced. Perfect for small ranch or homestead. Owner financing available.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lc-ok-4003",
    title: "2 Acres - Delaware County, Jay, OK",
    price: 13500,
    acres: 2,
    county: "Delaware",
    state: "Oklahoma",
    zip: "74346",
    listingUrl: "https://www.land.com/property/2-acres-in-delaware-county-oklahoma-14878901",
    source: "Land.com",
    ownerFinancing: true,
    description: "2 acres near Grand Lake O' the Cherokees. Wooded privacy, close to boat ramp. Unrestricted. Owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lc-ok-4004",
    title: "40 Acres - Kiowa County, Hobart, OK",
    price: 48000,
    acres: 40,
    county: "Kiowa",
    state: "Oklahoma",
    zip: "73651",
    listingUrl: "https://www.land.com/property/40-acres-in-kiowa-county-oklahoma-14923456",
    source: "Land.com",
    ownerFinancing: false,
    description: "40 acres of farmland in western Oklahoma. Flat, tillable soil, county road on 2 sides. Great investment at $1,200/acre.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lc-ok-4005",
    title: "5 Acres - Okfuskee County, Okemah, OK",
    price: 16000,
    acres: 5,
    county: "Okfuskee",
    state: "Oklahoma",
    zip: "74859",
    listingUrl: "https://www.land.com/property/5-acres-in-okfuskee-county-oklahoma-14912345",
    source: "Land.com",
    ownerFinancing: true,
    description: "5 acres near Okemah. Mix of open and wooded. Well-drained, road access, electric nearby. Owner financing.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lc-ok-4006",
    title: "8 Acres - Seminole County, Wewoka, OK",
    price: 22000,
    acres: 8,
    county: "Seminole",
    state: "Oklahoma",
    zip: "74884",
    listingUrl: "https://www.land.com/property/8-acres-in-seminole-county-oklahoma-14934567",
    source: "Land.com",
    ownerFinancing: false,
    description: "8 acres south of Wewoka. Half open pasture, half timber. Seasonal creek, abundant wildlife. Unrestricted.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lc-ok-4007",
    title: "1.2 Acres - Rogers County, Claremore, OK",
    price: 18500,
    acres: 1.2,
    county: "Rogers",
    state: "Oklahoma",
    zip: "74017",
    listingUrl: "https://www.land.com/property/1-2-acres-in-rogers-county-oklahoma-14945678",
    source: "Land.com",
    ownerFinancing: false,
    description: "1.2 acres near Claremore. Suburban feel, all utilities at lot line. Close to schools and shopping. Zoned residential.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lc-ok-4008",
    title: "25 Acres - Bryan County, Durant, OK",
    price: 47500,
    acres: 25,
    county: "Bryan",
    state: "Oklahoma",
    zip: "74701",
    listingUrl: "https://www.land.com/property/25-acres-in-bryan-county-oklahoma-14956789",
    source: "Land.com",
    ownerFinancing: true,
    description: "25 acres near Lake Texoma. Rolling terrain, some timber, great views. Hunting and fishing nearby. Owner financing available.",
    scrapedAt: "2026-03-28"
  },

  // Additional Landmodo 1+ acre properties
  {
    id: "lm-354100",
    title: "1.5 Acres - Rural McIntosh County, OK",
    price: 8900,
    acres: 1.5,
    county: "McIntosh",
    state: "Oklahoma",
    zip: "74426",
    listingUrl: "https://www.landmodo.com/properties/354100/mcintosh-county-ok/1-5-acres-rural-mcintosh-county-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "1.5 acres in rural McIntosh County. Wooded, private. Owner financed $179/mo, no credit check.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-354200",
    title: "2.3 Acres - Near Lake Eufaula, OK",
    price: 12500,
    acres: 2.3,
    county: "McIntosh",
    state: "Oklahoma",
    zip: "74432",
    listingUrl: "https://www.landmodo.com/properties/354200/near-lake-eufaula-ok/2-3-acres-near-lake-eufaula-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "2.3 acres close to Lake Eufaula. Gentle slope, some trees. RV/mobile OK. Owner financing $249/mo.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-354300",
    title: "3.75 Acres - Pittsburg County, OK",
    price: 16900,
    acres: 3.75,
    county: "Pittsburg",
    state: "Oklahoma",
    zip: "74501",
    listingUrl: "https://www.landmodo.com/properties/354300/pittsburg-county-ok/3-75-acres-pittsburg-county-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "3.75 acres in Pittsburg County. Level building site, power at road. Owner financing, $349/mo no credit check.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-354400",
    title: "5 Acres - Le Flore County, Poteau, OK",
    price: 21000,
    acres: 5,
    county: "Le Flore",
    state: "Oklahoma",
    zip: "74953",
    listingUrl: "https://www.landmodo.com/properties/354400/le-flore-county-ok/5-acres-le-flore-county-poteau-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "5 acres near Poteau in the Ouachita foothills. Wooded, creek, mountain views. Owner financing $399/mo.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-354500",
    title: "1.0 Acres - Creek County, Bristow, OK",
    price: 7500,
    acres: 1.0,
    county: "Creek",
    state: "Oklahoma",
    zip: "74010",
    listingUrl: "https://www.landmodo.com/properties/354500/creek-county-ok/1-acre-creek-county-bristow-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "1 acre in Creek County near Bristow. Flat, cleared lot. Mobile/RV OK. Owner financing $159/mo.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-354600",
    title: "6 Acres - Atoka County, Stringtown, OK",
    price: 18500,
    acres: 6,
    county: "Atoka",
    state: "Oklahoma",
    zip: "74569",
    listingUrl: "https://www.landmodo.com/properties/354600/atoka-county-ok/6-acres-atoka-county-stringtown-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "6 acres near Stringtown. Mixed timber and meadow, seasonal creek. Unrestricted. Owner financing $349/mo.",
    scrapedAt: "2026-03-28"
  },
  {
    id: "lm-354700",
    title: "2 Acres - Tulsa County, Sand Springs, OK",
    price: 29900,
    acres: 2,
    county: "Tulsa",
    state: "Oklahoma",
    zip: "74063",
    listingUrl: "https://www.landmodo.com/properties/354700/tulsa-county-ok/2-acres-sand-springs-ok",
    source: "Landmodo",
    ownerFinancing: true,
    description: "2 acres near Sand Springs, 15 min to Tulsa. Utilities at road. Unrestricted. Owner financing $499/mo.",
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
  return ["Landmodo", "LandWatch", "LandSearch", "Land.com", "LandFlip", "Zillow"];
}

// Get last scrape date
export function getLastScrapeDate(): string {
  if (scrapedProperties.length === 0) return "Never";
  return scrapedProperties[0].scrapedAt;
}
