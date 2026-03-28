import { useState, useMemo, useEffect, useRef } from "react";
import { properties, clients, countyData } from "./data/properties";
import type { Property, Client } from "./data/properties";
import { searchScrapedProperties, getSearchedSites, type ScrapedProperty } from "./data/scrapedProperties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin, DollarSign, Star, ArrowUpDown, Filter, BarChart3,
  Scale, Home, Landmark, Tractor, AlertTriangle, ExternalLink, Search,
  Globe, ArrowLeft, Copy as CopyIcon,
} from "lucide-react";
import NewResearchForm from "./NewResearchForm";
import SearchEngineSettings from "./components/SearchEngineSettings";
import { loadPropertyCache, type CachedProperty } from "./data/propertyCache";

// @ts-ignore
const L = window.L;

// Oklahoma county center coordinates for map pins
const COUNTY_COORDS: Record<string, [number, number]> = {
  "Osage": [36.63, -96.39], "Cleveland": [35.20, -97.33], "Delaware": [36.40, -94.80],
  "Pawnee": [36.34, -96.80], "Tulsa": [36.15, -95.99], "Cherokee": [35.90, -94.99],
  "Wagoner": [35.96, -95.52], "Le Flore": [34.88, -94.68], "Atoka": [34.38, -96.02],
  "Pittsburg": [34.92, -95.76], "Creek": [35.90, -96.37], "McCurtain": [34.23, -94.77],
  "Pushmataha": [34.42, -95.37], "Muskogee": [35.62, -95.37], "Adair": [35.88, -94.66],
  "McIntosh": [35.37, -95.67], "Hughes": [35.05, -96.25], "Sequoyah": [35.50, -94.75],
  "Latimer": [34.88, -95.25], "Ottawa": [36.84, -94.81], "Coal": [34.58, -96.30],
  "Lincoln": [35.70, -96.88], "Okmulgee": [35.63, -96.00], "Mayes": [36.30, -95.23],
  "Pontotoc": [34.73, -96.68], "Haskell": [35.22, -95.11], "Choctaw": [34.03, -95.55],
  "Craig": [36.76, -95.21], "Rogers": [36.37, -95.60], "Bryan": [33.96, -96.25],
  "Kiowa": [34.92, -98.98], "Okfuskee": [35.46, -96.32], "Seminole": [35.17, -96.67],
  // Missouri counties
  "Douglas": [36.93, -92.50], "Ozark": [36.65, -92.44], "St. Clair": [38.05, -93.77],
  "Taney": [36.65, -93.02], "Christian": [36.97, -93.19], "Shannon": [37.15, -91.40],
  "Macon": [39.83, -92.47], "Butler": [36.70, -90.40], "Johnson": [38.75, -93.80],
  "Madison": [37.48, -90.33], "Greer": [34.92, -99.58],
  // Tennessee counties
  "Benton": [35.95, -88.08], "Fentress": [36.38, -84.93], "Meigs": [35.51, -84.82],
  "Decatur": [35.59, -88.12], "Scott": [36.43, -84.52], "Hawkins": [36.47, -82.95],
  "Henderson": [35.65, -88.38], "Perry": [35.63, -87.87], "Wayne": [35.24, -87.80],
  "Hickman": [35.80, -87.47], "Lewis": [35.52, -87.50], "Lawrence": [35.22, -87.40],
  // Default
  "Unknown": [35.50, -97.50],
};

// API configuration - change this when backend is deployed
const API_BASE_URL = localStorage.getItem('api_url') || 'https://land-scraper-api.onrender.com';

// Check if a listing URL points to a SPECIFIC property page (not a general search/seller page)
// Note: Kept for potential future use with cached/local properties
// @ts-ignore
function isSpecificListingUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  const lower = url.toLowerCase();
  // Specific listing patterns: URLs with property IDs or specific addresses
  if (lower.includes('/properties/') && /\/properties\/\d+/.test(lower)) return true; // Landmodo, etc.
  if (lower.includes('/listing/')) return true;
  if (lower.includes('/property/')) return true;
  if (lower.includes('/lot/')) return true;
  if (lower.includes('/land-for-sale/') && /\d{3,}/.test(lower)) return true; // LandWatch with ID
  // Tax sale pages are valid specific sources
  if (lower.includes('taxsale')) return true;
  // Generic patterns that are NOT specific listings:
  if (lower.match(/^https?:\/\/[^/]+\/?$/) ) return false; // Just a domain
  if (lower.endsWith('/properties/') || lower.endsWith('/properties')) return false;
  if (lower.endsWith('/land-for-sale') || lower.includes('/land-for-sale/') && !(/\d{3,}/.test(lower))) return false;
  if (lower.includes('/collections/')) return false;
  return false; // Default: not specific enough
}

function convertScrapedToProperty(scrapedList: ScrapedProperty[], client: Client): Property[] {
  return scrapedList.map((p, idx) => ({
    id: 9000 + idx,
    name: p.title,
    county: p.county,
    state: p.state.substring(0, 2).toUpperCase(),
    location: `${p.zip}`,
    acres: p.acres || null,
    cashPrice: p.price,
    monthlyNum: Math.round(p.price / 60),
    pricePerAcre: p.acres ? Math.round(p.price / p.acres) : null,
    downPayment: "Contact seller",
    monthlyPayment: `$${Math.round(p.price / 60)}/mo`,
    category: (p.price <= client.budgetCashMax ? (p.price <= client.budgetCashMax * 0.8 ? "budget_match" : "negotiate") : "over_budget") as Property["category"],
    wholesaleScore: p.price <= client.budgetCashMax * 0.7 ? 90 : p.price <= client.budgetCashMax ? 75 : 50,
    seller: p.source,
    sellerType: "TBD" as const,
    roadAccess: "Check with seller",
    powerNearby: "Check with seller",
    unrestricted: true,
    ownerFinancing: p.ownerFinancing,
    rvMobileOk: p.ownerFinancing ? "YES" : "Check with seller",
    listingUrl: p.listingUrl,
    apn: "",
    notes: p.description,
    client: client.name,
    lat: 0,
    lng: 0,
    researchDate: new Date().toISOString().split('T')[0],
    soilQuality: "Check with seller",
    elevation: "Check with seller",
  } as Property));
}

function scoreColor(score: number) {
  if (score >= 90) return "bg-emerald-600 text-white";
  if (score >= 70) return "bg-emerald-500 text-white";
  if (score >= 50) return "bg-amber-500 text-white";
  return "bg-red-500 text-white";
}

function catStyle(cat: string) {
  switch (cat) {
    case "budget_match": return { bg: "bg-emerald-50 border-emerald-300", badge: "bg-emerald-100 text-emerald-800 border-emerald-300", label: "Budget Match" };
    case "negotiate": return { bg: "bg-blue-50 border-blue-300", badge: "bg-blue-100 text-blue-800 border-blue-300", label: "Negotiate Down" };
    case "tax_sale": return { bg: "bg-indigo-50 border-indigo-300", badge: "bg-indigo-100 text-indigo-800 border-indigo-300", label: "Tax Sale" };
    case "over_budget": return { bg: "bg-orange-50 border-orange-300", badge: "bg-orange-100 text-orange-800 border-orange-300", label: "Over Budget" };
    case "too_small": return { bg: "bg-gray-50 border-gray-300", badge: "bg-gray-100 text-gray-700 border-gray-300", label: "Too Small" };
    default: return { bg: "bg-white border-gray-200", badge: "bg-gray-100 text-gray-800", label: cat };
  }
}

function fmt(n: number | null) {
  if (n == null) return "—";
  return "$" + n.toLocaleString();
}

function wholesaleScore(p: Property, c: Client): number {
  let s = 0;
  if (c.targetCounties.map(x => x.toLowerCase()).includes(p.county.toLowerCase())) s += 20; else s += 5;
  if (p.cashPrice != null && p.cashPrice <= c.budgetCashMax) s += 20;
  else if (p.cashPrice != null && p.cashPrice <= c.budgetCashMax * 2) s += 10;
  if (p.acres != null && p.acres >= c.acreageMin && p.acres <= c.acreageMax) s += 15;
  else if (p.acres != null && p.acres >= c.acreageMin) s += 8;
  if (p.unrestricted && c.mustUnrestricted) s += 10;
  if (p.ownerFinancing && c.mustOwnerFinancing) s += 10;
  else if (p.ownerFinancing) s += 5;
  if (p.sellerType === "LLC") s += 10;
  if (p.sellerType === "Government") s += 10;
  if (p.roadAccess.toLowerCase().includes("maintained") || p.roadAccess.toLowerCase().includes("paved")) s += 8;
  if (p.rvMobileOk.toUpperCase().startsWith("YES")) s += 7;
  return Math.min(100, s);
}

// @ts-ignore - kept for potential future card view
function PropertyCard({ p, client, compare, onCompare }: { p: Property; client: Client; compare: boolean; onCompare: (id: number) => void }) {
  const style = catStyle(p.category);
  const score = wholesaleScore(p, client);
  const [open, setOpen] = useState(false);

  return (
    <Card className={`${style.bg} border transition-all hover:shadow-md ${compare ? "ring-2 ring-blue-500" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight truncate">{p.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />{p.county} Co, {p.state}
            </p>
          </div>
          <div className={`${scoreColor(score)} rounded px-2 py-1 text-xs font-bold min-w-[40px] text-center`}>{score}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div><span className="text-gray-500 block">Price</span><span className="font-medium">{p.cashPrice ? fmt(p.cashPrice) : "Auction"}</span></div>
          <div><span className="text-gray-500 block">Acres</span><span className="font-medium">{p.acres ?? "Varies"}</span></div>
          <div><span className="text-gray-500 block">Monthly</span><span className="font-medium">{p.monthlyPayment || "—"}</span></div>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className={`text-[10px] ${style.badge}`}>{style.label}</Badge>
          {p.unrestricted && <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-300">Unrestricted</Badge>}
          {p.ownerFinancing && <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-300">Owner Finance</Badge>}
          <Badge variant="outline" className="text-[10px]">{p.sellerType}</Badge>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">{p.notes}</p>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm" className="text-xs flex-1">Details</Button></DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="text-lg">{p.name}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-gray-500">Cash Price:</span> <strong>{p.cashPrice ? fmt(p.cashPrice) : "Auction"}</strong></div>
                  <div><span className="text-gray-500">Acres:</span> <strong>{p.acres ?? "Varies"}</strong></div>
                  <div><span className="text-gray-500">$/Acre:</span> <strong>{p.pricePerAcre ? fmt(p.pricePerAcre) : "—"}</strong></div>
                  <div><span className="text-gray-500">Down:</span> <strong>{p.downPayment}</strong></div>
                  <div><span className="text-gray-500">Monthly:</span> <strong>{p.monthlyPayment}</strong></div>
                  <div><span className="text-gray-500">County:</span> <strong>{p.county}, {p.state}</strong></div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-gray-500">Seller:</span> <strong>{p.seller}</strong></div>
                  <div><span className="text-gray-500">Type:</span> <strong>{p.sellerType}</strong></div>
                  <div><span className="text-gray-500">Road:</span> <strong>{p.roadAccess}</strong></div>
                  <div><span className="text-gray-500">Power:</span> <strong>{p.powerNearby}</strong></div>
                  <div><span className="text-gray-500">RV/Mobile:</span> <strong>{p.rvMobileOk}</strong></div>
                  <div><span className="text-gray-500">Unrestricted:</span> <strong>{p.unrestricted ? "YES" : "NO"}</strong></div>
                </div>
                <Separator />
                <div><span className="text-gray-500">APN:</span> {p.apn}</div>
                <div><span className="text-gray-500">Elevation:</span> {p.elevation}</div>
                <div><span className="text-gray-500">Soil:</span> {p.soilQuality}</div>
                <div className="bg-amber-50 p-2 rounded text-xs border border-amber-200">{p.notes}</div>
                {p.listingUrl && <a href={p.listingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3" />Open Listing</a>}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant={compare ? "default" : "outline"} size="sm" className="text-xs" onClick={() => onCompare(p.id)}><Scale className="w-3 h-3" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getCoords(p: Property): [number, number] {
  // Use property lat/lng if available, otherwise use county center + random offset
  if (p.lat && p.lng && p.lat !== 0 && p.lng !== 0) return [p.lat, p.lng];
  const base = COUNTY_COORDS[p.county] || COUNTY_COORDS["Unknown"];
  // Add small deterministic offset based on property id so pins don't overlap
  const offset = ((p.id * 137) % 100) / 1000;
  const offset2 = ((p.id * 251) % 100) / 1000;
  return [base[0] + offset - 0.05, base[1] + offset2 - 0.05];
}

function catColor(cat: string): string {
  switch (cat) {
    case "budget_match": return "#059669";
    case "negotiate": return "#2563eb";
    case "tax_sale": return "#6366f1";
    case "over_budget": return "#f97316";
    default: return "#6b7280";
  }
}

function LeafletMap({ items, highlightId, onSelect }: { items: Property[]; highlightId: number | null; onSelect: (id: number) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current || !L) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }
    const center: [number, number] = items.length > 0
      ? [items.reduce((s, p) => s + getCoords(p)[0], 0) / items.length,
         items.reduce((s, p) => s + getCoords(p)[1], 0) / items.length]
      : [35.5, -97.5];
    const map = L.map(mapRef.current, { scrollWheelZoom: true }).setView(center, 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);
    mapInstanceRef.current = map;

    // Add markers
    markersRef.current = items.map(p => {
      const coords = getCoords(p);
      const color = catColor(p.category);
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:9px;font-weight:bold;cursor:pointer;${p.id === highlightId ? 'transform:scale(1.4);z-index:999;' : ''}">${p.acres || '?'}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker(coords, { icon }).addTo(map);
      marker.bindPopup(`
        <div style="min-width:180px;font-family:system-ui;font-size:12px">
          <strong style="font-size:13px">${p.name}</strong><br/>
          <span style="color:#059669;font-weight:bold">${p.cashPrice ? '$' + p.cashPrice.toLocaleString() : 'Auction'}</span>
          ${p.acres ? ` · ${p.acres} ac` : ''}
          ${p.pricePerAcre ? ` · $${p.pricePerAcre.toLocaleString()}/ac` : ''}<br/>
          <span style="color:#666">${p.county} Co, ${p.state}</span><br/>
          ${p.listingUrl ? `<a href="${p.listingUrl}" target="_blank" style="color:#2563eb;text-decoration:underline">View Listing →</a>` : ''}
        </div>
      `);
      marker.on('click', () => onSelect(p.id));
      return marker;
    });

    if (items.length > 0) {
      const bounds = L.latLngBounds(items.map(p => getCoords(p)));
      map.fitBounds(bounds.pad(0.15));
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [items, highlightId]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: 400 }} />;
}

// Table row for a single property
function PropertyTableRow({ p, client, isHighlighted, onHover, onSelect }: {
  p: Property; client: Client; isHighlighted: boolean; onHover: (id: number | null) => void; onSelect?: (id: number) => void;
}) {
  const style = catStyle(p.category);
  const score = wholesaleScore(p, client);
  return (
    <TableRow
      className={`cursor-pointer transition-colors text-xs ${isHighlighted ? 'bg-blue-50 ring-1 ring-blue-300' : 'hover:bg-slate-50'}`}
      onMouseEnter={() => onHover(p.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect?.(p.id)}
    >
      <TableCell className="py-2 px-2">
        <div className={`${scoreColor(score)} rounded px-1.5 py-0.5 text-[10px] font-bold text-center w-8`}>{score}</div>
      </TableCell>
      <TableCell className="py-2 px-2 max-w-[200px]">
        <div className="font-medium text-xs leading-tight truncate" title={p.name}>{p.name}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{p.county} Co, {p.state}</div>
      </TableCell>
      <TableCell className="py-2 px-2 font-medium tabular-nums">{p.cashPrice ? fmt(p.cashPrice) : "—"}</TableCell>
      <TableCell className="py-2 px-2 tabular-nums">{p.acres ?? "—"}</TableCell>
      <TableCell className="py-2 px-2 tabular-nums text-gray-500">{p.pricePerAcre ? fmt(p.pricePerAcre) : "—"}</TableCell>
      <TableCell className="py-2 px-2">
        <Badge variant="outline" className={`text-[9px] ${style.badge}`}>{style.label}</Badge>
      </TableCell>
      <TableCell className="py-2 px-2">
        <div className="flex gap-1">
          {p.ownerFinancing && <Badge variant="outline" className="text-[9px] bg-purple-50 text-purple-700 border-purple-300">Finance</Badge>}
          {p.unrestricted && <Badge variant="outline" className="text-[9px] bg-green-50 text-green-700 border-green-300">Unrest.</Badge>}
        </div>
      </TableCell>
      <TableCell className="py-2 px-2 text-[10px] text-gray-500">{p.seller}</TableCell>
      <TableCell className="py-2 px-2">
        {p.listingUrl ? (
          <a href={p.listingUrl} target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            title={p.listingUrl}
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : <span className="text-gray-300">—</span>}
      </TableCell>
    </TableRow>
  );
}

function CompareView({ items, client }: { items: Property[]; client: Client }) {
  if (items.length < 2) return (
    <div className="text-center py-12 text-gray-400"><Scale className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">Select 2+ properties to compare (click the scale button on cards)</p></div>
  );
  const fields: { label: string; fn: (p: Property) => string }[] = [
    { label: "Cash Price", fn: p => p.cashPrice ? fmt(p.cashPrice) : "Auction" },
    { label: "Acres", fn: p => p.acres?.toString() ?? "Varies" },
    { label: "$/Acre", fn: p => p.pricePerAcre ? fmt(p.pricePerAcre) : "—" },
    { label: "Down Payment", fn: p => p.downPayment },
    { label: "Monthly", fn: p => p.monthlyPayment },
    { label: "County", fn: p => `${p.county}, ${p.state}` },
    { label: "Seller", fn: p => p.seller },
    { label: "Seller Type", fn: p => p.sellerType },
    { label: "Road Access", fn: p => p.roadAccess },
    { label: "Power Nearby", fn: p => p.powerNearby },
    { label: "Unrestricted", fn: p => p.unrestricted ? "YES" : "NO" },
    { label: "Owner Financing", fn: p => p.ownerFinancing ? "YES" : "NO" },
    { label: "RV/Mobile OK", fn: p => p.rvMobileOk },
    { label: "Wholesale Score", fn: p => wholesaleScore(p, client).toString() },
    { label: "Elevation", fn: p => p.elevation },
    { label: "Soil", fn: p => p.soilQuality },
  ];
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader><TableRow><TableHead className="font-bold w-36">Field</TableHead>{items.map(p => <TableHead key={p.id} className="font-bold text-center min-w-[160px]">{p.name}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{fields.map(f => <TableRow key={f.label}><TableCell className="font-medium text-xs text-gray-600">{f.label}</TableCell>{items.map(p => <TableCell key={p.id} className="text-center text-xs">{f.fn(p)}</TableCell>)}</TableRow>)}</TableBody>
      </Table>
    </div>
  );
}

function EmptyResearchState({
  client,
  onResearchComplete
}: {
  client: Client;
  onResearchComplete: (results: Property[]) => void;
}) {
  const realSites = getSearchedSites();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<"scanning" | "analyzing" | "done">("scanning");
  const [scannedEngines, setScannedEngines] = useState<string[]>([]);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    // Extract search criteria from client
    const clientStates = client.notes?.match(/States: ([^\n.]+)/)?.[1]?.split(", ").map(s => s.trim()) || [];
    const clientCounties = (client.targetCounties || []).map(c => c.trim());

    // Build query string for streaming API
    const params = new URLSearchParams();
    if (clientStates.length > 0) {
      clientStates.forEach(s => params.append('states', s));
    }
    if (clientCounties.length > 0) {
      clientCounties.forEach(c => params.append('counties', c));
    }
    params.append('maxPrice', String(client.budgetCashMax));
    if (client.acreageMin > 0) params.append('minAcres', String(client.acreageMin));
    if (client.acreageMax > 0 && client.acreageMax < 100) {
      params.append('maxAcres', String(client.acreageMax));
    }
    if (client.mustOwnerFinancing) params.append('ownerFinancing', 'true');

    const apiUrl = `${API_BASE_URL}/api/search/stream?${params.toString()}`;
    const apiResults: ScrapedProperty[] = [];
    let siteCount = 0;

    // Set up a timeout after 30 seconds
    const timeoutId = setTimeout(() => {
      eventSource?.close();
      setPhase("done");
      setProgress(100);
      // Fall back to scraped properties if timeout
      const fallbackResults = searchScrapedProperties({
        states: clientStates.length > 0 ? clientStates : undefined,
        counties: clientCounties.length > 0 ? clientCounties : undefined,
        maxPrice: client.budgetCashMax,
        minAcres: client.acreageMin > 0 ? client.acreageMin : undefined,
        maxAcres: client.acreageMax > 0 && client.acreageMax < 100 ? client.acreageMax : undefined,
        ownerFinancing: client.mustOwnerFinancing || undefined,
      });
      const convertedResults = convertScrapedToProperty(fallbackResults, client);
      onResearchComplete(convertedResults);
    }, 30000);

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(apiUrl);

      eventSource.addEventListener('start', (e) => {
        const data = JSON.parse(e.data);
        console.log('API search started', data);
      });

      eventSource.addEventListener('progress', (e) => {
        const data = JSON.parse(e.data);
        setProgress(Math.round(data.progress || 0));
      });

      eventSource.addEventListener('site_done', (e) => {
        const data = JSON.parse(e.data);
        siteCount++;
        setCurrentStep(siteCount);
        setScannedEngines(prev =>
          prev.includes(data.siteName) ? prev : [...prev, data.siteName]
        );
        if (data.resultsFound) {
          setFoundCount(prev => prev + (data.resultsFound || 0));
        }
      });

      eventSource.addEventListener('site_error', (e) => {
        const data = JSON.parse(e.data);
        console.warn(`Site error: ${data.siteName}`, data.error);
        siteCount++;
        setCurrentStep(siteCount);
        // Still mark as processed even if error
        setScannedEngines(prev =>
          prev.includes(data.siteName) ? prev : [...prev, data.siteName]
        );
      });

      eventSource.addEventListener('done', (e) => {
        const data = JSON.parse(e.data);
        clearTimeout(timeoutId);
        setPhase("analyzing");
        setProgress(90);

        // Filter API results by acre requirements BEFORE converting
        let rawResults: ScrapedProperty[] = data.results || apiResults;
        if (client.acreageMin > 0) {
          rawResults = rawResults.filter((p: ScrapedProperty) => p.acres != null && p.acres >= client.acreageMin);
        }
        if (client.acreageMax > 0 && client.acreageMax < 100) {
          rawResults = rawResults.filter((p: ScrapedProperty) => p.acres == null || p.acres <= client.acreageMax);
        }

        // ALWAYS merge API results with static fallback data for maximum coverage
        const fallbackResults = searchScrapedProperties({
          states: clientStates.length > 0 ? clientStates : undefined,
          counties: clientCounties.length > 0 ? clientCounties : undefined,
          maxPrice: client.budgetCashMax,
          minAcres: client.acreageMin > 0 ? client.acreageMin : undefined,
          maxAcres: client.acreageMax > 0 && client.acreageMax < 100 ? client.acreageMax : undefined,
          ownerFinancing: client.mustOwnerFinancing || undefined,
        });

        // Merge and deduplicate by title similarity
        const allScraped = [...rawResults];
        const existingTitles = new Set(rawResults.map((p: ScrapedProperty) => p.title.toLowerCase().substring(0, 30)));
        for (const fb of fallbackResults) {
          if (!existingTitles.has(fb.title.toLowerCase().substring(0, 30))) {
            allScraped.push(fb);
            existingTitles.add(fb.title.toLowerCase().substring(0, 30));
          }
        }

        const convertedResults = convertScrapedToProperty(allScraped, client);
        setPhase("done");
        setProgress(100);
        onResearchComplete(convertedResults);
      });

      eventSource.onerror = (err) => {
        console.error('EventSource error:', err);
        clearTimeout(timeoutId);
        setPhase("analyzing");
        eventSource?.close();

        // Fall back to scraped properties
        setTimeout(() => {
          const fallbackResults = searchScrapedProperties({
            states: clientStates.length > 0 ? clientStates : undefined,
            counties: clientCounties.length > 0 ? clientCounties : undefined,
            maxPrice: client.budgetCashMax,
            minAcres: client.acreageMin > 0 ? client.acreageMin : undefined,
            maxAcres: client.acreageMax > 0 && client.acreageMax < 100 ? client.acreageMax : undefined,
            ownerFinancing: client.mustOwnerFinancing || undefined,
          });
          const convertedResults = convertScrapedToProperty(fallbackResults, client);
          setPhase("done");
          setProgress(100);
          onResearchComplete(convertedResults);
        }, 500);
      };
    } catch (err) {
      console.error('Error starting API call:', err);
      clearTimeout(timeoutId);

      // Fall back to scraped properties
      const fallbackResults = searchScrapedProperties({
        states: clientStates.length > 0 ? clientStates : undefined,
        counties: clientCounties.length > 0 ? clientCounties : undefined,
        maxPrice: client.budgetCashMax,
        minAcres: client.acreageMin > 0 ? client.acreageMin : undefined,
        maxAcres: client.acreageMax > 0 && client.acreageMax < 100 ? client.acreageMax : undefined,
        ownerFinancing: client.mustOwnerFinancing || undefined,
      });
      const convertedResults = convertScrapedToProperty(fallbackResults, client);
      setPhase("done");
      setProgress(100);
      onResearchComplete(convertedResults);
    }

    return () => {
      clearTimeout(timeoutId);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [client, onResearchComplete]);

  const currentSite = realSites[currentStep - 1];

  return (
    <div className="text-center py-8 text-gray-400">
      {phase !== "done" ? (
        <div className="relative w-8 h-8 mx-auto mb-3">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <Search className="absolute inset-0 w-4 h-4 m-auto text-blue-500" />
        </div>
      ) : (
        <Search className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
      )}

      <p className="text-base font-medium text-slate-700 mb-1">
        {phase === "scanning" && `Scanning sites for ${client.name}...`}
        {phase === "analyzing" && `Analyzing results for ${client.name}...`}
        {phase === "done" && `Research complete for ${client.name}`}
      </p>

      {/* Progress bar */}
      <div className="max-w-md mx-auto mb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                phase === "done" ? "bg-emerald-500" : "bg-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={`text-sm font-bold tabular-nums min-w-[42px] text-right ${
            phase === "done" ? "text-emerald-600" : "text-blue-600"
          }`}>{progress}%</span>
        </div>

        {/* Status line */}
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>
            {phase === "scanning" && currentSite && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Searching <strong className="text-gray-600">{currentSite}</strong>
              </span>
            )}
            {phase === "analyzing" && "Deduplicating & scoring results..."}
            {phase === "done" && `Scan complete — ${scannedEngines.length} sites checked`}
          </span>
          <span>{currentStep}/{realSites.length} sites</span>
        </div>
      </div>

      {/* Live stats */}
      <div className="flex items-center justify-center gap-4 text-[11px] mb-4">
        <span className="flex items-center gap-1 text-gray-500">
          <Globe className="w-3.5 h-3.5" />
          <strong className="text-gray-700">{scannedEngines.length}</strong> sites scanned
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <Search className="w-3.5 h-3.5" />
          <strong className="text-gray-700">{currentStep}</strong> of {realSites.length} sites
        </span>
        {foundCount > 0 && (
          <span className="flex items-center gap-1 text-emerald-600">
            <MapPin className="w-3.5 h-3.5" />
            <strong>{foundCount}</strong> leads found
          </span>
        )}
      </div>

      <div className="text-xs text-left max-w-lg mx-auto bg-white rounded-lg border p-4 space-y-3">
        <div className="space-y-1.5">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Client Criteria</div>
          <div><span className="text-gray-500">Budget:</span> <strong>{fmt(client.budgetCashMin)} – {fmt(client.budgetCashMax)}</strong></div>
          <div><span className="text-gray-500">Monthly:</span> <strong>{client.budgetMonthly}</strong></div>
          <div><span className="text-gray-500">Acreage:</span> <strong>{client.acreageMin}–{client.acreageMax} ac</strong></div>
          <div><span className="text-gray-500">Target Counties:</span> <strong>{client.targetCounties.length > 0 ? client.targetCounties.join(", ") : "Any"}</strong></div>
          <div><span className="text-gray-500">Purpose:</span> <strong>{client.purpose}</strong></div>
        </div>
        <Separator />
        <div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-2">
            Sites Being Searched — {realSites.length} property listing sites
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {realSites.map((site, i) => {
              const isActive = i === currentStep - 1 && phase === "scanning";
              const isDone = i < currentStep;
              return (
                <div key={i}
                  className={`flex items-center gap-2 p-1.5 rounded transition-colors ${
                    isActive ? "bg-blue-50 ring-1 ring-blue-200" : isDone ? "bg-emerald-50/50" : "bg-slate-50"
                  }`}>
                  {isActive && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />}
                  {isDone && !isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
                  {!isActive && !isDone && <span className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />}
                  <Badge variant="outline" className={`text-[9px] min-w-[80px] text-center ${isActive ? "border-blue-300 text-blue-700" : ""}`}>
                    {site}
                  </Badge>
                  <span className={`truncate flex-1 ${isActive ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                    {site === "Landmodo" && "Active real estate listings"}
                    {site === "LandWatch" && "Land listings and auctions"}
                    {site === "LandSearch" && "Raw land for sale"}
                    {site === "Land.com" && "Comprehensive land database"}
                    {site === "LandFlip" && "Wholesale land deals"}
                    {site === "Zillow" && "Land and real estate"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Property Detail View - Full page detail view for a selected property
function PropertyDetailView({
  property,
  client,
  onBack
}: {
  property: Property;
  client: Client;
  onBack: () => void;
}) {
  const score = wholesaleScore(property, client);
  const style = catStyle(property.category);

  // Due diligence checklist state
  const [ddChecks, setDdChecks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`dd_${property.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [contactStatus, setContactStatus] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`contact_${property.id}`);
      return saved || "Not contacted";
    } catch { return "Not contacted"; }
  });

  const [notes, setNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`notes_${property.id}`);
      return saved || "";
    } catch { return ""; }
  });

  const dueDiligenceItems = [
    "Title search completed",
    "Tax liens checked",
    "Zoning verified",
    "Access verified on-site",
    "Utilities confirmed",
    "Survey obtained",
    "Environmental check",
  ];

  const handleDdChange = (item: string, checked: boolean) => {
    const newChecks = { ...ddChecks, [item]: checked };
    setDdChecks(newChecks);
    try {
      localStorage.setItem(`dd_${property.id}`, JSON.stringify(newChecks));
    } catch {}
  };

  const handleContactStatusChange = (status: string) => {
    setContactStatus(status);
    try {
      localStorage.setItem(`contact_${property.id}`, status);
    } catch {}
  };

  const handleNotesChange = (text: string) => {
    setNotes(text);
    try {
      localStorage.setItem(`notes_${property.id}`, text);
    } catch {}
  };

  const handleCopyAPN = () => {
    if (property.apn) {
      navigator.clipboard.writeText(property.apn);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Back button */}
      <div className="bg-white border-b p-4">
        <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Results
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[1600px] mx-auto p-4">
          <div className="grid grid-cols-[60%,1fr] gap-4">
            {/* Left column (60%) */}
            <div className="space-y-4">
              {/* Property name */}
              <h1 className="text-3xl font-bold text-slate-900">{property.name}</h1>

              {/* Listing source badge */}
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100">
                  <Globe className="w-3 h-3 mr-1" />
                  {property.seller}
                </Badge>
                {property.listingUrl && (
                  <a href={property.listingUrl} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                    View Listing <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Property data grid */}
              <Card className="border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border-r pr-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Price</div>
                      <div className="text-2xl font-bold text-emerald-600">{property.cashPrice ? fmt(property.cashPrice) : "—"}</div>
                      <div className="text-xs text-gray-500 mt-1">Cash price</div>
                    </div>
                    <div className="border-r pr-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Acreage</div>
                      <div className="text-2xl font-bold text-slate-900">{property.acres ?? "—"}</div>
                      <div className="text-xs text-gray-500 mt-1">Acres</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">$/Acre</div>
                      <div className="text-2xl font-bold text-slate-900">{property.pricePerAcre ? fmt(property.pricePerAcre) : "—"}</div>
                      <div className="text-xs text-gray-500 mt-1">Price per acre</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Full property details grid */}
              <Card className="border">
                <CardHeader className="pb-3"><CardTitle className="text-sm">Property Details</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div><span className="text-gray-500">Down Payment:</span> <strong>{property.downPayment}</strong></div>
                    <div><span className="text-gray-500">Monthly Payment:</span> <strong>{property.monthlyPayment}</strong></div>
                    <div><span className="text-gray-500">County/State:</span> <strong>{property.county}, {property.state}</strong></div>
                    <div><span className="text-gray-500">APN:</span> <strong className="font-mono">{property.apn || "—"}</strong></div>
                    <div><span className="text-gray-500">Elevation:</span> <strong>{property.elevation}</strong></div>
                    <div><span className="text-gray-500">Soil Quality:</span> <strong>{property.soilQuality}</strong></div>
                    <div><span className="text-gray-500">Road Access:</span> <strong>{property.roadAccess}</strong></div>
                    <div><span className="text-gray-500">Power Nearby:</span> <strong>{property.powerNearby}</strong></div>
                    <div><span className="text-gray-500">Unrestricted:</span> <strong>{property.unrestricted ? "YES" : "NO"}</strong></div>
                    <div><span className="text-gray-500">Owner Financing:</span> <strong>{property.ownerFinancing ? "YES" : "NO"}</strong></div>
                    <div><span className="text-gray-500">RV/Mobile OK:</span> <strong>{property.rvMobileOk}</strong></div>
                  </div>
                </CardContent>
              </Card>

              {/* Owner/Seller section */}
              <Card className="border">
                <CardHeader className="pb-3"><CardTitle className="text-sm">Owner/Seller</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Seller Name:</span> <strong>{property.seller}</strong></div>
                  <div><span className="text-gray-500">Seller Type:</span> <strong>{property.sellerType}</strong></div>
                  {property.listingUrl && (
                    <a href={property.listingUrl} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                      Contact Seller <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Due Diligence Checklist */}
              <Card className="border">
                <CardHeader className="pb-3"><CardTitle className="text-sm">Due Diligence</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {dueDiligenceItems.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Checkbox
                        checked={ddChecks[item] || false}
                        onCheckedChange={(checked) => handleDdChange(item, checked as boolean)}
                      />
                      <label className="text-sm cursor-pointer">{item}</label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Owner Contact Status */}
              <Card className="border">
                <CardHeader className="pb-3"><CardTitle className="text-sm">Contact Status</CardTitle></CardHeader>
                <CardContent>
                  <Select value={contactStatus} onValueChange={handleContactStatusChange}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not contacted">Not contacted</SelectItem>
                      <SelectItem value="Contacted - waiting">Contacted - waiting</SelectItem>
                      <SelectItem value="In negotiation">In negotiation</SelectItem>
                      <SelectItem value="Offer made">Offer made</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="border">
                <CardHeader className="pb-3"><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Add notes about this property..."
                    className="min-h-[100px] text-sm"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right column (40%) */}
            <div className="space-y-4">
              {/* Map */}
              <Card className="border h-[500px] overflow-hidden">
                <LeafletMap
                  items={[property]}
                  highlightId={property.id}
                  onSelect={() => {}}
                />
              </Card>

              {/* Score and Category badges */}
              <Card className="border">
                <CardContent className="p-4 space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Wholesale Score</div>
                    <div className={`${scoreColor(score)} rounded-lg px-4 py-3 text-center font-bold text-xl`}>{score}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Category</div>
                    <Badge className={`w-full text-center justify-center py-2 ${style.badge}`}>{style.label}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick action buttons */}
              <Card className="border">
                <CardContent className="p-4 space-y-2">
                  {property.listingUrl && (
                    <Button
                      className="w-full"
                      onClick={() => window.open(property.listingUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" /> Open Listing
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleCopyAPN}
                    disabled={!property.apn}
                  >
                    <CopyIcon className="w-4 h-4 mr-2" /> Copy APN
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeClient, setActiveClient] = useState<string>("Marietta");
  const [filterCounty, setFilterCounty] = useState<string>("all");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterUnrestricted, setFilterUnrestricted] = useState(false);
  const [filterFinancing, setFilterFinancing] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<string>("score");
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [tab, setTab] = useState("results");
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [customClients, setCustomClients] = useState<Client[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('custom_clients') || '[]');
    } catch { return []; }
  });

  const [cachedProperties, setCachedProperties] = useState<CachedProperty[]>([]);

  // Load cached properties on mount
  useEffect(() => {
    setCachedProperties(loadPropertyCache());
  }, []);

  const allClients = [...clients, ...customClients];

  // Merge hardcoded + cached + research results, dedup by ID
  const allProperties = useMemo(() => {
    const merged: Property[] = [...properties];
    const existingIds = new Set(properties.map(p => p.id));
    for (const cp of cachedProperties) {
      if (!existingIds.has(cp.id)) {
        merged.push(cp);
        existingIds.add(cp.id);
      }
    }
    // Also load research results for active client from localStorage
    try {
      const researchResults = localStorage.getItem(`research_results_${activeClient}`);
      if (researchResults) {
        const parsed = JSON.parse(researchResults);
        for (const rp of parsed) {
          merged.push(rp);
        }
      }
    } catch {}

    return merged;
  }, [cachedProperties, activeClient]);

  function handleNewResearch(newClient: Client) {
    const updated = [...customClients, newClient];
    setCustomClients(updated);
    try { localStorage.setItem('custom_clients', JSON.stringify(updated)); } catch {}
    setActiveClient(newClient.name);
    setTab("results");
    // Don't save research results yet — let EmptyResearchState animate first
    // Results will be found and saved when animation completes (via onResearchComplete)
  }

  const client = allClients.find(c => c.name === activeClient) || allClients[0];

  const filtered = useMemo(() => {
    let items = allProperties.filter(p => p.client === activeClient);
    if (filterCounty !== "all") items = items.filter(p => p.county === filterCounty);
    if (filterCat !== "all") items = items.filter(p => p.category === filterCat);
    if (filterUnrestricted) items = items.filter(p => p.unrestricted);
    if (filterFinancing) items = items.filter(p => p.ownerFinancing);
    items = items.filter(p => p.cashPrice == null || p.cashPrice <= maxPrice);
    // Enforce client's acreage requirements — NEVER show properties below minimum acres
    if (client.acreageMin > 0) {
      items = items.filter(p => p.acres != null && p.acres >= client.acreageMin);
    }
    if (client.acreageMax > 0 && client.acreageMax < 100) {
      items = items.filter(p => p.acres == null || p.acres <= client.acreageMax);
    }
    items.sort((a, b) => {
      if (sortBy === "score") return wholesaleScore(b, client) - wholesaleScore(a, client);
      if (sortBy === "price") return (a.cashPrice ?? 0) - (b.cashPrice ?? 0);
      if (sortBy === "acres") return (b.acres ?? 0) - (a.acres ?? 0);
      return 0;
    });
    return items;
  }, [allProperties, activeClient, filterCounty, filterCat, filterUnrestricted, filterFinancing, maxPrice, sortBy, client]);

  const compareItems = allProperties.filter(p => compareIds.includes(p.id));
  const counties = [...new Set(allProperties.filter(p => p.client === activeClient).map(p => p.county))];

  // @ts-ignore - kept for compare feature
  function toggleCompare(id: number) {
    setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const stats = useMemo(() => {
    const items = allProperties.filter(p => p.client === activeClient);
    return {
      total: items.length,
      budgetMatch: items.filter(p => p.category === "budget_match").length,
      negotiate: items.filter(p => p.category === "negotiate").length,
      taxSale: items.filter(p => p.category === "tax_sale").length,
      avgScore: items.length > 0 ? Math.round(items.reduce((s, p) => s + wholesaleScore(p, client), 0) / items.length) : 0,
    };
  }, [activeClient, client]);

  // Show property detail view if one is selected
  if (selectedProperty !== null) {
    const selectedProp = allProperties.find(p => p.id === selectedProperty);
    if (selectedProp) {
      return <PropertyDetailView property={selectedProp} client={client} onBack={() => setSelectedProperty(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 rounded-lg p-1.5"><Landmark className="w-5 h-5 text-white" /></div>
            <div><h1 className="text-base font-bold text-slate-900 leading-none">AADreamland Market Research</h1><p className="text-[10px] text-slate-400 mt-0.5">Wholesale Market Intelligence</p></div>
          </div>
          <div className="flex items-center gap-2">
            <NewResearchForm onSave={handleNewResearch} />
            <Select value={activeClient} onValueChange={setActiveClient}>
              <SelectTrigger className="w-40 h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>{allClients.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          {[
            { label: "Total Leads", value: stats.total, icon: BarChart3, color: "text-slate-700" },
            { label: "Budget Match", value: stats.budgetMatch, icon: DollarSign, color: "text-emerald-600" },
            { label: "Negotiate", value: stats.negotiate, icon: ArrowUpDown, color: "text-blue-600" },
            { label: "Tax Sales", value: stats.taxSale, icon: Landmark, color: "text-indigo-600" },
            { label: "Avg Score", value: stats.avgScore, icon: Star, color: "text-amber-600" },
          ].map(s => (
            <Card key={s.label} className="border"><CardContent className="p-3 flex items-center gap-3"><s.icon className={`w-5 h-5 ${s.color}`} /><div><p className="text-lg font-bold leading-none">{s.value}</p><p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p></div></CardContent></Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="results"><Home className="w-3.5 h-3.5 mr-1.5" />Results & Map</TabsTrigger>
            <TabsTrigger value="map"><MapPin className="w-3.5 h-3.5 mr-1.5" />Full Map</TabsTrigger>
            <TabsTrigger value="compare"><Scale className="w-3.5 h-3.5 mr-1.5" />Compare{compareIds.length > 0 && ` (${compareIds.length})`}</TabsTrigger>
            <TabsTrigger value="counties"><Tractor className="w-3.5 h-3.5 mr-1.5" />Counties</TabsTrigger>
            <TabsTrigger value="client"><Filter className="w-3.5 h-3.5 mr-1.5" />Client</TabsTrigger>
            <TabsTrigger value="engines"><Globe className="w-3.5 h-3.5 mr-1.5" />Search Engines</TabsTrigger>
          </TabsList>

          {(tab === "results" || tab === "map" || tab === "compare") && (
            <Card className="mb-4 border"><CardContent className="p-3">
              <div className="flex flex-wrap items-end gap-3">
                <div><Label className="text-[10px] text-gray-500">County</Label><Select value={filterCounty} onValueChange={setFilterCounty}><SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Counties</SelectItem>{counties.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                <div><Label className="text-[10px] text-gray-500">Category</Label><Select value={filterCat} onValueChange={setFilterCat}><SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="budget_match">Budget Match</SelectItem><SelectItem value="negotiate">Negotiate</SelectItem><SelectItem value="tax_sale">Tax Sale</SelectItem><SelectItem value="over_budget">Over Budget</SelectItem><SelectItem value="too_small">Too Small</SelectItem></SelectContent></Select></div>
                <div><Label className="text-[10px] text-gray-500">Sort</Label><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="score">Score</SelectItem><SelectItem value="price">Price</SelectItem><SelectItem value="acres">Acres</SelectItem></SelectContent></Select></div>
                <div className="flex items-center gap-2"><Label className="text-[10px] text-gray-500">Max Price</Label><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span><input type="number" value={maxPrice} min={0} max={100000} step={1000} onChange={e => setMaxPrice(Number(e.target.value) || 0)} className="w-24 h-7 pl-5 pr-2 text-xs border rounded-md font-mono" /></div></div>
                <div className="flex items-center gap-2"><Switch checked={filterUnrestricted} onCheckedChange={setFilterUnrestricted} /><Label className="text-xs">Unrestricted</Label></div>
                <div className="flex items-center gap-2"><Switch checked={filterFinancing} onCheckedChange={setFilterFinancing} /><Label className="text-xs">Owner Fin.</Label></div>
                <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
              </div>
            </CardContent></Card>
          )}

          <TabsContent value="results">
            {filtered.length > 0 ? (
              <div className="flex gap-4" style={{ height: 'calc(100vh - 280px)', minHeight: 500 }}>
                {/* Left: Property Table */}
                <div className="flex-1 overflow-auto border rounded-lg bg-white">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="text-[10px] w-12 px-2">Score</TableHead>
                        <TableHead className="text-[10px] px-2">Property</TableHead>
                        <TableHead className="text-[10px] px-2">Price</TableHead>
                        <TableHead className="text-[10px] px-2">Acres</TableHead>
                        <TableHead className="text-[10px] px-2">$/Acre</TableHead>
                        <TableHead className="text-[10px] px-2">Status</TableHead>
                        <TableHead className="text-[10px] px-2">Tags</TableHead>
                        <TableHead className="text-[10px] px-2">Source</TableHead>
                        <TableHead className="text-[10px] px-2 w-10">Link</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(p => (
                        <PropertyTableRow key={p.id} p={p} client={client} isHighlighted={p.id === highlightId} onHover={setHighlightId} onSelect={setSelectedProperty} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Right: Map */}
                <div className="w-[45%] min-w-[350px] border rounded-lg overflow-hidden shrink-0">
                  <LeafletMap items={filtered} highlightId={highlightId} onSelect={(id) => setHighlightId(id)} />
                </div>
              </div>
            ) : (
              <>
                {allProperties.filter(p => p.client === activeClient).length === 0 && !localStorage.getItem(`research_results_${activeClient}`) && (
                  <EmptyResearchState
                    client={client}
                    onResearchComplete={(results) => {
                      try {
                        localStorage.setItem(`research_results_${client.name}`, JSON.stringify(results));
                      } catch { }
                      setCachedProperties([...loadPropertyCache()]);
                    }}
                  />
                )}
                {allProperties.filter(p => p.client === activeClient).length > 0 && <div className="text-center py-12 text-gray-400"><AlertTriangle className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No properties match current filters. Try adjusting filters above.</p></div>}
                {allProperties.filter(p => p.client === activeClient).length === 0 && localStorage.getItem(`research_results_${activeClient}`) && (
                  <div className="text-center py-12 text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600 mb-1">No properties found matching your criteria.</p>
                    <p className="text-xs text-gray-400 mt-1">Try expanding your search area, adjusting budget, or checking different states/counties.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="map">
            <div style={{ height: 'calc(100vh - 240px)', minHeight: 500 }}>
              <LeafletMap items={filtered} highlightId={highlightId} onSelect={(id) => setHighlightId(id)} />
            </div>
          </TabsContent>

          <TabsContent value="compare"><CompareView items={compareItems} client={client} /></TabsContent>

          <TabsContent value="counties">
            <div className="grid gap-3">
              {countyData.filter(c => allProperties.some(p => p.client === activeClient && p.county === c.county)).map(c => (
                <Card key={c.county} className="border"><CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">{c.county} County, {c.state}</h3>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < c.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />)}</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div><span className="text-gray-500">Zoning:</span> <strong>{c.zoning}</strong></div>
                    <div><span className="text-gray-500">Building:</span> <strong>{c.buildingCodes}</strong></div>
                    <div><span className="text-gray-500">Mobile/RV:</span> <strong>{c.mobileRV}</strong></div>
                    <div><span className="text-gray-500">Off-Grid:</span> <strong>{c.offGrid}</strong></div>
                    <div><span className="text-gray-500">Tax Rate:</span> <strong>{c.taxRate}</strong></div>
                    <div><span className="text-gray-500">Elevation:</span> <strong>{c.elevation}</strong></div>
                    <div><span className="text-gray-500">Tornado:</span> <strong>{c.tornado}</strong></div>
                    <div><span className="text-gray-500">Assessor:</span> <strong>{c.assessorPhone}</strong></div>
                  </div>
                  <div className="mt-2 text-xs bg-indigo-50 p-2 rounded"><strong>Tax Sale:</strong> {c.taxSale}</div>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="client">
            <Card className="border"><CardHeader className="pb-2"><CardTitle className="text-lg">Client Brief — {client.name}</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-gray-500">Purpose:</span> <strong>{client.purpose}</strong></div>
                  <div><span className="text-gray-500">Budget (Cash):</span> <strong>{fmt(client.budgetCashMin)} – {fmt(client.budgetCashMax)}</strong></div>
                  <div><span className="text-gray-500">Down Payment:</span> <strong>{client.budgetDown}</strong></div>
                  <div><span className="text-gray-500">Monthly:</span> <strong>{client.budgetMonthly}</strong></div>
                  <div><span className="text-gray-500">Acreage:</span> <strong>{client.acreageMin}-{client.acreageMax} acres</strong></div>
                  <div><span className="text-gray-500">Road Access:</span> <strong>{client.mustRoadAccess}</strong></div>
                </div>
                <Separator />
                <div><span className="text-gray-500">Target Counties:</span> {client.targetCounties.map(c => <Badge key={c} variant="outline" className="mr-1">{c}</Badge>)}</div>
                <div className="flex gap-4 flex-wrap">
                  {client.mustUnrestricted && <Badge className="bg-green-100 text-green-800">Must: Unrestricted</Badge>}
                  {client.mustNoHOA && <Badge className="bg-green-100 text-green-800">Must: No HOA</Badge>}
                  {client.mustOwnerFinancing && <Badge className="bg-purple-100 text-purple-800">Must: Owner Financing</Badge>}
                  {client.mustLiveOnSite && <Badge className="bg-amber-100 text-amber-800">Must: Live On-Site</Badge>}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs">{client.notes}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engines">
            <SearchEngineSettings />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center py-4 text-xs text-gray-400 border-t mt-8">AADreamland — Land Wholesale Market Research | Data: March 2026</footer>
    </div>
  );
}
