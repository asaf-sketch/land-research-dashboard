import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Globe, Database, Zap, ShieldCheck, ExternalLink,
  BarChart3, History, Settings2, Search,
} from "lucide-react";
import { loadSearchEngines, saveSearchEngines, type SearchEngine } from "@/data/searchEngines";
import { getCacheStats, loadResearchLog, type ResearchLogEntry } from "@/data/propertyCache";

function categoryBadge(cat: string) {
  switch (cat) {
    case "primary": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "secondary": return "bg-blue-50 text-blue-700 border-blue-200";
    case "auction": return "bg-purple-50 text-purple-700 border-purple-200";
    default: return "bg-gray-50 text-gray-700";
  }
}

export default function SearchEngineSettings() {
  const [engines, setEngines] = useState<SearchEngine[]>([]);
  const [cacheStats, setCacheStats] = useState(getCacheStats());
  const [researchLog, setResearchLog] = useState<ResearchLogEntry[]>([]);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => {
    setEngines(loadSearchEngines());
    setCacheStats(getCacheStats());
    setResearchLog(loadResearchLog());
  }, []);

  function toggleEngine(id: string) {
    const updated = engines.map(e =>
      e.id === id ? { ...e, enabled: !e.enabled } : e
    );
    setEngines(updated);
    saveSearchEngines(updated);
  }

  function setPriority(id: string, priority: number) {
    const updated = engines.map(e =>
      e.id === id ? { ...e, priority } : e
    );
    setEngines(updated);
    saveSearchEngines(updated);
  }

  const enabledCount = engines.filter(e => e.enabled).length;
  const primaryCount = engines.filter(e => e.enabled && e.category === "primary").length;
  const secondaryCount = engines.filter(e => e.enabled && e.category === "secondary").length;
  const auctionCount = engines.filter(e => e.enabled && e.category === "auction").length;

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border">
          <CardContent className="p-3 flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-lg font-bold leading-none">{enabledCount}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Active Search Engines</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-3 flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-lg font-bold leading-none">{cacheStats.totalProperties}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Properties in Cache</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-3 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-lg font-bold leading-none">{cacheStats.verifiedUrls}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Verified URLs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-3 flex items-center gap-3">
            <History className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-lg font-bold leading-none">{researchLog.length}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Research Runs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Engine Categories */}
      <div className="flex items-center gap-2 text-xs">
        <Badge variant="outline" className={categoryBadge("primary")}>{primaryCount} Primary</Badge>
        <Badge variant="outline" className={categoryBadge("secondary")}>{secondaryCount} Secondary</Badge>
        <Badge variant="outline" className={categoryBadge("auction")}>{auctionCount} Auction</Badge>
        <span className="text-gray-400 ml-auto">{engines.length} total engines configured</span>
      </div>

      {/* Engine List */}
      <div className="space-y-2">
        {["primary", "secondary", "auction"].map(cat => (
          <div key={cat}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 mt-3 flex items-center gap-2">
              {cat === "primary" && <Zap className="w-3.5 h-3.5" />}
              {cat === "secondary" && <Search className="w-3.5 h-3.5" />}
              {cat === "auction" && <BarChart3 className="w-3.5 h-3.5" />}
              {cat} Sites
            </h3>
            {engines.filter(e => e.category === cat).sort((a, b) => a.priority - b.priority).map(engine => (
              <Card key={engine.id} className={`border mb-2 ${!engine.enabled ? "opacity-50" : ""}`}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Switch
                        checked={engine.enabled}
                        onCheckedChange={() => toggleEngine(engine.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{engine.name}</span>
                          <Badge variant="outline" className={`text-[10px] ${categoryBadge(engine.category)}`}>
                            P{engine.priority}
                          </Badge>
                          {cacheStats.byEngine[engine.id] && (
                            <Badge variant="outline" className="text-[10px] bg-slate-50">
                              {cacheStats.byEngine[engine.id]} cached
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{engine.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/* Priority buttons */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4].map(p => (
                          <button
                            key={p}
                            className={`w-5 h-5 rounded text-[10px] font-bold border ${engine.priority === p
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}`}
                            onClick={() => setPriority(engine.id, p)}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <a href={engine.baseUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  {engine.enabled && (
                    <div className="mt-2 text-[10px] text-gray-400 bg-slate-50 rounded p-2 border">
                      <strong>Research tip:</strong> {engine.researchNotes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>

      <Separator />

      {/* Research Log */}
      <div>
        <Button variant="outline" size="sm" className="text-xs gap-1.5 mb-3" onClick={() => setShowLog(!showLog)}>
          <History className="w-3.5 h-3.5" />
          {showLog ? "Hide" : "Show"} Research Log ({researchLog.length})
        </Button>

        {showLog && researchLog.length > 0 && (
          <div className="space-y-2">
            {researchLog.slice(0, 20).map(entry => (
              <Card key={entry.id} className="border">
                <CardContent className="p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{entry.clientName}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] ${entry.status === "completed" ? "bg-emerald-50 text-emerald-700" : entry.status === "in_progress" ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-700"}`}>
                        {entry.status}
                      </Badge>
                      <span className="text-gray-400">{new Date(entry.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {entry.criteria.states.join(", ")} | {entry.criteria.counties.length > 0 ? entry.criteria.counties.join(", ") : "All counties"} | ${entry.criteria.budgetCashMin.toLocaleString()}–${entry.criteria.budgetCashMax.toLocaleString()}
                  </div>
                  <div className="flex gap-3 mt-1 text-gray-400">
                    <span>Found: {entry.propertiesFound}</span>
                    <span>From cache: {entry.propertiesFromCache}</span>
                    <span>New: {entry.newPropertiesAdded}</span>
                    <span>Engines: {entry.enginesSearched.length}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {showLog && researchLog.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">No research runs yet. Create a new market research to start.</div>
        )}
      </div>

      {/* Info box */}
      <Card className="border border-blue-200 bg-blue-50">
        <CardContent className="p-3 text-xs text-blue-700">
          <div className="flex gap-2">
            <Settings2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong>How Search Works:</strong> When you create a new market research, the system generates search URLs for each enabled engine based on your client's criteria.
              The researcher visits each URL, finds matching properties with <strong>direct listing links</strong>, and adds them to the database.
              Properties are cached so future searches can skip already-found listings. Each property must have a verified URL pointing to the exact listing page.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
