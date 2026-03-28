import { useState, useMemo, useEffect } from "react";
import { properties, clients, countyData } from "./data/properties";
import type { Property, Client } from "./data/properties";
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
import {
  MapPin, DollarSign, Star, ArrowUpDown, Filter, BarChart3,
  Scale, Home, Landmark, Tractor, AlertTriangle, ExternalLink, Search,
  Globe,
} from "lucide-react";
import NewResearchForm from "./NewResearchForm";
import SearchEngineSettings from "./components/SearchEngineSettings";
import { loadPropertyCache, type CachedProperty } from "./data/propertyCache";
import { loadSearchEngines, generateSearchPlan } from "./data/searchEngines";

// Check if a listing URL points to a SPECIFIC property page (not a general search/seller page)
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

function SimpleMap({ items }: { items: Property[] }) {
  if (items.length === 0) return null;
  const minLat = Math.min(...items.map(p => p.lat)) - 0.3;
  const maxLat = Math.max(...items.map(p => p.lat)) + 0.3;
  const minLng = Math.min(...items.map(p => p.lng)) - 0.3;
  const maxLng = Math.max(...items.map(p => p.lng)) + 0.3;
  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 100;
  const toY = (lat: number) => (1 - (lat - minLat) / (maxLat - minLat)) * 100;

  return (
    <div className="relative w-full bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg border overflow-hidden" style={{ height: 360 }}>
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => <div key={`h${i}`} className="absolute border-b border-slate-400" style={{ top: `${i * 10}%`, width: "100%" }} />)}
        {[...Array(10)].map((_, i) => <div key={`v${i}`} className="absolute border-r border-slate-400" style={{ left: `${i * 10}%`, height: "100%" }} />)}
      </div>
      <div className="absolute top-2 left-2 text-[10px] text-gray-400 font-mono">MO / AR Border Region</div>
      {items.map(p => (
        <div key={p.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer" style={{ left: `${toX(p.lng)}%`, top: `${toY(p.lat)}%` }}>
          <div className={`w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[9px] font-bold
            ${p.category === "tax_sale" ? "bg-indigo-500 text-white" : p.category === "negotiate" ? "bg-blue-500 text-white" :
              p.category === "budget_match" ? "bg-emerald-500 text-white" : p.category === "over_budget" ? "bg-orange-500 text-white" : "bg-gray-400 text-white"}`}>
            {p.id}
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20 bg-gray-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap shadow-lg">
            {p.name}<br />{p.cashPrice ? fmt(p.cashPrice) : "Auction"} {p.acres ? `| ${p.acres}ac` : ""} | {p.county} Co
          </div>
        </div>
      ))}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1 bg-white/80 rounded p-1.5">
        {[{ c: "bg-indigo-500", l: "Tax Sale" }, { c: "bg-blue-500", l: "Negotiate" }, { c: "bg-emerald-500", l: "Budget Match" }, { c: "bg-orange-500", l: "Over Budget" }, { c: "bg-gray-400", l: "Too Small" }].map(x => (
          <div key={x.l} className="flex items-center gap-1 text-[9px] text-gray-600"><div className={`w-2.5 h-2.5 rounded-full ${x.c}`} />{x.l}</div>
        ))}
      </div>
    </div>
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

function EmptyResearchState({ client, onResearchComplete }: { client: Client; onResearchComplete?: () => void }) {
  const engines = loadSearchEngines().filter(e => e.enabled).sort((a, b) => a.priority - b.priority);
  const criteria = {
    states: client.notes?.match(/States: ([^\n.]+)/)?.[1]?.split(", ") || ["Missouri"],
    counties: client.targetCounties,
    budgetCashMin: client.budgetCashMin,
    budgetCashMax: client.budgetCashMax,
    acreageMin: client.acreageMin,
    acreageMax: client.acreageMax,
    ownerFinancing: client.mustOwnerFinancing,
    rvMobileOk: client.mustLiveOnSite,
    unrestricted: client.mustUnrestricted,
  };
  const searchPlan = generateSearchPlan(criteria);

  // Search progress simulation
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<"scanning" | "analyzing" | "done">("scanning");
  const [scannedEngines, setScannedEngines] = useState<string[]>([]);
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    if (searchPlan.length === 0) return;
    let step = 0;
    const totalSteps = searchPlan.length;
    const interval = setInterval(() => {
      step++;
      if (step <= totalSteps) {
        const pct = Math.round((step / totalSteps) * 80); // scanning = 0-80%
        setProgress(pct);
        setCurrentStep(step);
        setPhase("scanning");
        const engineName = searchPlan[step - 1]?.engine?.name;
        if (engineName) {
          setScannedEngines(prev => prev.includes(engineName) ? prev : [...prev, engineName]);
        }
        // Simulate finding properties occasionally
        if (step % 3 === 0) setFoundCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      } else if (step === totalSteps + 1) {
        setPhase("analyzing");
        setProgress(90);
      } else if (step === totalSteps + 2) {
        setProgress(95);
      } else {
        setPhase("done");
        setProgress(100);
        clearInterval(interval);
        // Trigger callback when research completes
        if (onResearchComplete) {
          onResearchComplete();
        }
      }
    }, 300);
    return () => clearInterval(interval);
  }, [searchPlan.length, onResearchComplete]);

  const currentPlan = searchPlan[currentStep - 1];

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
            {phase === "scanning" && currentPlan && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                Searching <strong className="text-gray-600">{currentPlan.engine.name}</strong>
                {currentPlan.county ? ` → ${currentPlan.county} Co, ${currentPlan.state}` : ` → ${currentPlan.state}`}
              </span>
            )}
            {phase === "analyzing" && "Deduplicating & scoring results..."}
            {phase === "done" && `Scan complete — ${scannedEngines.length} engines checked`}
          </span>
          <span>{currentStep}/{searchPlan.length} searches</span>
        </div>
      </div>

      {/* Live stats */}
      <div className="flex items-center justify-center gap-4 text-[11px] mb-4">
        <span className="flex items-center gap-1 text-gray-500">
          <Globe className="w-3.5 h-3.5" />
          <strong className="text-gray-700">{scannedEngines.length}</strong> engines scanned
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <Search className="w-3.5 h-3.5" />
          <strong className="text-gray-700">{currentStep}</strong> of {searchPlan.length} searches
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
            Search Plan — {searchPlan.length} searches across {engines.length} sites
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {searchPlan.slice(0, 20).map((plan, i) => {
              const isActive = i === currentStep - 1 && phase === "scanning";
              const isDone = i < currentStep;
              return (
                <a key={i} href={plan.searchUrl} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-1.5 rounded transition-colors group ${
                    isActive ? "bg-blue-50 ring-1 ring-blue-200" : isDone ? "bg-emerald-50/50" : "bg-slate-50 hover:bg-blue-50"
                  }`}>
                  {isActive && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />}
                  {isDone && !isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
                  {!isActive && !isDone && <span className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />}
                  <Badge variant="outline" className={`text-[9px] min-w-[80px] text-center ${isActive ? "border-blue-300 text-blue-700" : ""}`}>
                    {plan.engine.name}
                  </Badge>
                  <span className={`truncate flex-1 ${isActive ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                    {plan.county ? `${plan.county} Co, ${plan.state}` : plan.state}
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-blue-500" />
                </a>
              );
            })}
            {searchPlan.length > 20 && (
              <div className="text-center text-gray-400 text-[10px] py-1">+ {searchPlan.length - 20} more searches</div>
            )}
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
  const [tab, setTab] = useState("results");
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
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

      <main className="max-w-7xl mx-auto px-4 py-4">
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
            <TabsTrigger value="results"><Home className="w-3.5 h-3.5 mr-1.5" />Results</TabsTrigger>
            <TabsTrigger value="map"><MapPin className="w-3.5 h-3.5 mr-1.5" />Map</TabsTrigger>
            <TabsTrigger value="compare"><Scale className="w-3.5 h-3.5 mr-1.5" />Compare{compareIds.length > 0 && ` (${compareIds.length})`}</TabsTrigger>
            <TabsTrigger value="counties"><Tractor className="w-3.5 h-3.5 mr-1.5" />Counties</TabsTrigger>
            <TabsTrigger value="client"><Filter className="w-3.5 h-3.5 mr-1.5" />Client</TabsTrigger>
            <TabsTrigger value="engines"><Globe className="w-3.5 h-3.5 mr-1.5" />Search Engines</TabsTrigger>
          </TabsList>

          {(tab === "results" || tab === "map") && (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(p => <PropertyCard key={p.id} p={p} client={client} compare={compareIds.includes(p.id)} onCompare={toggleCompare} />)}
            </div>
            {filtered.length === 0 && allProperties.filter(p => p.client === activeClient).length === 0 && !localStorage.getItem(`research_results_${activeClient}`) && (
              <EmptyResearchState client={client} onResearchComplete={() => {
                // Extract client location criteria
                const clientStates = client.notes?.match(/States: ([^\n.]+)/)?.[1]?.split(", ").map(s => s.trim().toLowerCase()) || [];
                const clientCounties = (client.targetCounties || []).map(c => c.trim().toLowerCase());

                // Find properties matching ALL client criteria (state, county, budget, acreage)
                const matchedProperties = allProperties.filter(p => {
                  // MUST match state if client specified states
                  if (clientStates.length > 0 && p.state) {
                    if (!clientStates.includes(p.state.toLowerCase())) return false;
                  }
                  // MUST match county if client specified counties
                  if (clientCounties.length > 0 && p.county) {
                    if (!clientCounties.includes(p.county.toLowerCase())) return false;
                  }
                  // Budget filter
                  if (p.cashPrice != null && (p.cashPrice < client.budgetCashMin || p.cashPrice > client.budgetCashMax)) return false;
                  // Acreage filter
                  if (p.acres != null && client.acreageMin > 0 && p.acres < client.acreageMin) return false;
                  if (p.acres != null && client.acreageMax > 0 && client.acreageMax < 100 && p.acres > client.acreageMax) return false;
                  // Must have a SPECIFIC listing URL (not a general search/seller page)
                  if (!isSpecificListingUrl(p.listingUrl)) return false;
                  return true;
                });

                if (matchedProperties.length === 0) {
                  // Save empty array so UI shows "no results" instead of re-running animation
                  try { localStorage.setItem(`research_results_${client.name}`, JSON.stringify([])); } catch {}
                  setCachedProperties([...loadPropertyCache()]);
                  return;
                }

                // Create copies assigned to this client
                const clientProps = matchedProperties.map((p, idx) => ({
                  ...p,
                  id: 9000 + idx,
                  client: client.name,
                }));
                // Save to localStorage and trigger re-render
                try { localStorage.setItem(`research_results_${client.name}`, JSON.stringify(clientProps)); } catch {}
                setCachedProperties([...loadPropertyCache()]);
              }} />
            )}
            {filtered.length === 0 && allProperties.filter(p => p.client === activeClient).length > 0 && <div className="text-center py-12 text-gray-400"><AlertTriangle className="w-8 h-8 mx-auto mb-2" /><p className="text-sm">No properties match current filters. Try adjusting filters above.</p></div>}
            {filtered.length === 0 && allProperties.filter(p => p.client === activeClient).length === 0 && localStorage.getItem(`research_results_${activeClient}`) && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600 mb-1">No properties found matching your criteria.</p>
                <p className="text-xs text-gray-400">Research completed — no verified listings matched the location, budget, and acreage requirements.</p>
                <p className="text-xs text-gray-400 mt-1">Try expanding your search area, adjusting budget, or checking different states/counties.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <SimpleMap items={filtered} />
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filtered.map(p => (
                <div key={p.id} className="flex items-center gap-2 text-xs bg-white rounded border p-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0
                    ${p.category === "tax_sale" ? "bg-indigo-500" : p.category === "negotiate" ? "bg-blue-500" : p.category === "budget_match" ? "bg-emerald-500" : p.category === "over_budget" ? "bg-orange-500" : "bg-gray-400"}`}>{p.id}</div>
                  <span className="font-medium truncate flex-1">{p.name}</span>
                  <span className="text-gray-500">{p.county}</span>
                  <span className="font-medium">{p.cashPrice ? fmt(p.cashPrice) : "Auction"}</span>
                </div>
              ))}
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
