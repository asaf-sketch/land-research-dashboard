import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ClipboardCopy, Check, ArrowLeft, Search, AlertCircle, Globe, ExternalLink } from "lucide-react";
import { supabase } from "./lib/supabase";
import { loadSearchEngines, generateSearchPlan, type SearchPlan } from "./data/searchEngines";
import { addResearchLogEntry } from "./data/propertyCache";

const US_STATES = ["Missouri", "Arkansas", "Oklahoma", "Texas", "Kansas", "Tennessee", "Kentucky", "Illinois"];

const MISSOURI_COUNTIES = [
  "Adair", "Andrew", "Atchison", "Audrain", "Barry", "Barton", "Bates", "Benton",
  "Bollinger", "Boone", "Buchanan", "Butler", "Caldwell", "Callaway", "Camden",
  "Cape Girardeau", "Carroll", "Carter", "Cass", "Cedar", "Chariton", "Christian",
  "Clark", "Clay", "Clinton", "Cole", "Cooper", "Crawford", "Dade", "Dallas",
  "Daviess", "DeKalb", "Dent", "Douglas", "Dunklin", "Franklin", "Gasconade",
  "Gentry", "Greene", "Grundy", "Harrison", "Henry", "Hickory", "Holt", "Howard",
  "Howell", "Iron", "Jackson", "Jasper", "Jefferson", "Johnson", "Knox", "Laclede",
  "Lafayette", "Lawrence", "Lewis", "Lincoln", "Linn", "Livingston", "Macon",
  "Madison", "Maries", "Marion", "McDonald", "Mercer", "Miller", "Mississippi",
  "Moniteau", "Monroe", "Montgomery", "Morgan", "New Madrid", "Newton", "Nodaway",
  "Oregon", "Osage", "Ozark", "Pemiscot", "Perry", "Pettis", "Phelps", "Pike",
  "Platte", "Polk", "Pulaski", "Putnam", "Ralls", "Randolph", "Ray", "Reynolds",
  "Ripley", "Saline", "Schuyler", "Scotland", "Scott", "Shannon", "Shelby",
  "St. Charles", "St. Clair", "St. Francois", "St. Louis", "Ste. Genevieve",
  "Stoddard", "Stone", "Sullivan", "Taney", "Texas", "Vernon", "Warren",
  "Washington", "Wayne", "Webster", "Worth", "Wright"
];

const ARKANSAS_COUNTIES = [
  "Baxter", "Benton", "Boone", "Carroll", "Clay", "Cleburne", "Crawford",
  "Faulkner", "Franklin", "Fulton", "Greene", "Independence", "Izard",
  "Jackson", "Johnson", "Lawrence", "Logan", "Madison", "Marion", "Newton",
  "Pope", "Randolph", "Searcy", "Sebastian", "Sharp", "Stone", "Van Buren",
  "Washington", "White"
];

const LAND_USES = [
  { id: "rv_mobile", label: "RV / Mobile Home" },
  { id: "camping", label: "Camping" },
  { id: "greenhouse", label: "Greenhouse / Nursery / Agriculture" },
  { id: "permanent_build", label: "Permanent Construction" },
  { id: "offgrid", label: "Off-grid Living" },
  { id: "animals", label: "Animals" },
];

const ROAD_OPTIONS = ["Paved", "Gravel OK", "Any"];

interface FormData {
  clientName: string;
  clientDescription: string;
  budgetCashMin: number;
  budgetCashMax: number;
  downPaymentMin: number;
  downPaymentMax: number;
  monthlyMin: number;
  monthlyMax: number;
  states: string[];
  counties: string[];
  noHOA: boolean;
  landUses: string[];
  minAcres: string;
  maxAcres: string;
  roadRequirement: string;
  powerNearby: string;
  ownerFinancing: boolean;
  immediateResidence: boolean;
  notes: string;
}

const defaultForm: FormData = {
  clientName: "",
  clientDescription: "",
  budgetCashMin: 0,
  budgetCashMax: 20000,
  downPaymentMin: 0,
  downPaymentMax: 2000,
  monthlyMin: 0,
  monthlyMax: 500,
  states: [],
  counties: [],
  noHOA: true,
  landUses: [],
  minAcres: "",
  maxAcres: "",
  roadRequirement: "",
  powerNearby: "any",
  ownerFinancing: true,
  immediateResidence: false,
  notes: "",
};

function fmt(n: number) {
  return "$" + n.toLocaleString();
}

interface NewResearchFormProps {
  onSave?: (client: {
    name: string;
    purpose: string;
    targetStates: string[];
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
  }) => void;
}

export default function NewResearchForm({ onSave }: NewResearchFormProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormData>({ ...defaultForm });
  const [step, setStep] = useState<"form" | "summary">("form");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [countyInput, setCountyInput] = useState("");
  const [showCountySuggestions, setShowCountySuggestions] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [searchPlan, setSearchPlan] = useState<SearchPlan[]>([]);
  const [budgetHistory, setBudgetHistory] = useState<Record<string, number[]>>({});
  const [showBudgetDropdown, setShowBudgetDropdown] = useState<string | null>(null);

  // Load budget history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('budget_history');
      if (stored) {
        setBudgetHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load budget history:', e);
    }
  }, []);

  // Save budget value to history in localStorage
  function saveBudgetToHistory(fieldName: string, value: number) {
    setBudgetHistory(prev => {
      const updated = { ...prev };
      if (!updated[fieldName]) {
        updated[fieldName] = [];
      }
      // Add if not already in history
      if (!updated[fieldName].includes(value)) {
        updated[fieldName] = [value, ...updated[fieldName]].slice(0, 5); // Keep last 5
      }
      localStorage.setItem('budget_history', JSON.stringify(updated));
      return updated;
    });
  }

  function toggleState(state: string) {
    setForm(f => ({
      ...f,
      states: f.states.includes(state) ? f.states.filter(s => s !== state) : [...f.states, state],
      counties: [] // Reset counties when states change
    }));
  }

  function getCountyList() {
    // Get counties for all selected states
    let counties: string[] = [];
    form.states.forEach(state => {
      if (state === "Missouri") counties.push(...MISSOURI_COUNTIES);
      if (state === "Arkansas") counties.push(...ARKANSAS_COUNTIES);
    });
    // Remove duplicates and sort
    return Array.from(new Set(counties)).sort();
  }

  function filteredCounties() {
    const list = getCountyList();
    if (!countyInput) return list.slice(0, 15);
    return list.filter(c => c.toLowerCase().includes(countyInput.toLowerCase())).slice(0, 10);
  }

  function addCounty(county: string) {
    if (!form.counties.includes(county)) {
      setForm(f => ({ ...f, counties: [...f.counties, county] }));
    }
    setCountyInput("");
    setShowCountySuggestions(false);
  }

  function removeCounty(county: string) {
    setForm(f => ({ ...f, counties: f.counties.filter(c => c !== county) }));
  }

  function toggleLandUse(id: string) {
    setForm(f => ({
      ...f,
      landUses: f.landUses.includes(id) ? f.landUses.filter(u => u !== id) : [...f.landUses, id],
    }));
  }

  function handleSubmit() {
    setStep("summary");
  }

  function buildSummaryText(): string {
    const landUseLabels = form.landUses.map(id => LAND_USES.find(u => u.id === id)?.label || id);
    const lines: string[] = [
      `=== NEW MARKET RESEARCH REQUEST ===`,
      `Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      ``,
      `CLIENT: ${form.clientName || "—"}`,
      ``,
      `--- BUDGET ---`,
      `Cash Price: ${fmt(form.budgetCashMin)} – ${fmt(form.budgetCashMax)}`,
      `Down Payment: ${fmt(form.downPaymentMin)} – ${fmt(form.downPaymentMax)}`,
      `Monthly Payment: ${fmt(form.monthlyMin)} – ${fmt(form.monthlyMax)}`,
      ``,
      `--- LOCATION ---`,
      `States: ${form.states.length > 0 ? form.states.join(", ") : "—"}`,
      `Counties: ${form.counties.length > 0 ? form.counties.join(", ") : "—"}`,
      ``,
      `--- REQUIREMENTS ---`,
      `HOA: ${form.noHOA ? "No HOA Required" : "Allowed"}`,
      `Land Uses: ${landUseLabels.length > 0 ? landUseLabels.join(", ") : "—"}`,
      `Acreage: ${form.minAcres || "—"} – ${form.maxAcres || "—"} acres`,
      `Road Access: ${form.roadRequirement || "—"}`,
      `Power Nearby: ${form.powerNearby === "yes" ? "Required" : form.powerNearby === "no" ? "Not required" : "Doesn't matter"}`,
      `Owner Financing: ${form.ownerFinancing ? "Required" : "Not required"}`,
      `Immediate Residence: ${form.immediateResidence ? "Yes" : "No"}`,
    ];
    if (form.notes.trim()) {
      lines.push(``, `--- NOTES ---`, form.notes.trim());
    }
    lines.push(``, `================================`);
    return lines.join("\n");
  }

  async function handleSave() {
    // Save budget values to history before saving
    saveBudgetToHistory('budgetCashMin', form.budgetCashMin);
    saveBudgetToHistory('budgetCashMax', form.budgetCashMax);
    saveBudgetToHistory('downPaymentMin', form.downPaymentMin);
    saveBudgetToHistory('downPaymentMax', form.downPaymentMax);
    saveBudgetToHistory('monthlyMin', form.monthlyMin);
    saveBudgetToHistory('monthlyMax', form.monthlyMax);

    setSaving(true);
    setSaveError("");
    try {
      if (supabase) {
        // Save to Supabase if configured
        const { data, error } = await supabase.from('research_runs').insert({
          client_name: form.clientName,
          budget_cash_min: form.budgetCashMin,
          budget_cash_max: form.budgetCashMax,
          budget_down_min: form.downPaymentMin,
          budget_down_max: form.downPaymentMax,
          budget_monthly_min: form.monthlyMin,
          budget_monthly_max: form.monthlyMax,
          states: form.states,
          counties: form.counties,
          hoa_allowed: !form.noHOA,
          land_uses: form.landUses,
          min_acres: form.minAcres ? parseFloat(form.minAcres) : null,
          max_acres: form.maxAcres ? parseFloat(form.maxAcres) : null,
          road_requirement: form.roadRequirement,
          power_nearby: form.powerNearby,
          owner_financing: form.ownerFinancing,
          immediate_residence: form.immediateResidence,
          notes: form.notes,
          status: 'pending',
        }).select().single();

        if (error) throw error;
        setSavedId(data?.id || null);
      } else {
        // Save locally when Supabase isn't configured
        const localId = `local-${Date.now()}`;
        const researchData = {
          id: localId,
          created_at: new Date().toISOString(),
          client_name: form.clientName,
          budget_cash_min: form.budgetCashMin,
          budget_cash_max: form.budgetCashMax,
          budget_down_min: form.downPaymentMin,
          budget_down_max: form.downPaymentMax,
          budget_monthly_min: form.monthlyMin,
          budget_monthly_max: form.monthlyMax,
          states: form.states,
          counties: form.counties,
          hoa_allowed: !form.noHOA,
          land_uses: form.landUses,
          min_acres: form.minAcres ? parseFloat(form.minAcres) : null,
          max_acres: form.maxAcres ? parseFloat(form.maxAcres) : null,
          road_requirement: form.roadRequirement,
          power_nearby: form.powerNearby,
          owner_financing: form.ownerFinancing,
          immediate_residence: form.immediateResidence,
          notes: form.notes,
          status: 'pending',
        };
        // Store in localStorage
        try {
          const existing = JSON.parse(localStorage.getItem('research_runs') || '[]');
          existing.push(researchData);
          localStorage.setItem('research_runs', JSON.stringify(existing));
        } catch {
          // localStorage not available, still show success
        }
        // Also copy to clipboard automatically
        try {
          await navigator.clipboard.writeText(buildSummaryText());
        } catch {
          // clipboard not available, that's ok
        }
        setSavedId(localId);

        // Generate search plan
        const criteria = {
          states: form.states.length > 0 ? form.states : ["Missouri"],
          counties: form.counties,
          budgetCashMin: form.budgetCashMin,
          budgetCashMax: form.budgetCashMax,
          acreageMin: form.minAcres ? parseFloat(form.minAcres) : 0,
          acreageMax: form.maxAcres ? parseFloat(form.maxAcres) : 100,
          ownerFinancing: form.ownerFinancing,
          rvMobileOk: form.landUses.includes("rv_mobile"),
          unrestricted: true,
        };
        const plan = generateSearchPlan(criteria);
        setSearchPlan(plan);

        // Log the research run
        const engines = loadSearchEngines().filter(e => e.enabled);
        addResearchLogEntry({
          id: localId,
          clientName: form.clientName || "Unnamed",
          timestamp: new Date().toISOString(),
          criteria: {
            states: form.states,
            counties: form.counties,
            budgetCashMin: form.budgetCashMin,
            budgetCashMax: form.budgetCashMax,
            acreageMin: form.minAcres ? parseFloat(form.minAcres) : 0,
            acreageMax: form.maxAcres ? parseFloat(form.maxAcres) : 100,
            ownerFinancing: form.ownerFinancing,
          },
          enginesSearched: engines.map(e => e.id),
          propertiesFound: 0,
          propertiesFromCache: 0,
          newPropertiesAdded: 0,
          status: "pending",
          notes: "",
        });

        // Create client entry and notify parent
        if (onSave) {
          const landUseLabels = form.landUses.map(id => LAND_USES.find(u => u.id === id)?.label || id);
          onSave({
            name: form.clientName || `Research ${new Date().toLocaleDateString()}`,
            purpose: landUseLabels.length > 0 ? landUseLabels.join(", ") : "General land research",
            targetStates: form.states,
            targetCounties: form.counties,
            budgetCashMin: form.budgetCashMin,
            budgetCashMax: form.budgetCashMax,
            budgetDown: `${fmt(form.downPaymentMin)} – ${fmt(form.downPaymentMax)}`,
            budgetMonthly: `${fmt(form.monthlyMin)} – ${fmt(form.monthlyMax)}`,
            acreageMin: form.minAcres ? parseFloat(form.minAcres) : 0,
            acreageMax: form.maxAcres ? parseFloat(form.maxAcres) : 100,
            mustUnrestricted: true,
            mustNoHOA: form.noHOA,
            mustOwnerFinancing: form.ownerFinancing,
            mustRoadAccess: form.roadRequirement || "Any",
            mustLiveOnSite: form.immediateResidence,
            notes: [
              form.states.length > 0 ? `States: ${form.states.join(", ")}` : "",
              form.powerNearby === "yes" ? "Power required" : "",
              form.notes,
            ].filter(Boolean).join(". "),
          });
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveError("Could not save. Please try copying to clipboard instead.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildSummaryText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select a textarea
      const el = document.createElement("textarea");
      el.value = buildSummaryText();
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleReset() {
    setForm({ ...defaultForm });
    setStep("form");
    setCopied(false);
    setSaveError("");
    setSavedId(null);
    setSearchPlan([]);
  }

  function handleClose(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset on close
      setTimeout(() => {
        setStep("form");
        setCopied(false);
      }, 300);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-1.5 h-8 text-sm px-3">
          <Plus className="w-4 h-4" />
          New Research
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            {step === "summary" && (
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setStep("form")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {step === "form" ? "New Market Research" : "Research Summary"}
          </DialogTitle>
        </DialogHeader>

        {step === "form" ? (
          <div className="space-y-5">
            {/* Client Name */}
            <div>
              <Label className="text-sm font-medium">Client Name</Label>
              <Input
                placeholder="e.g. Sarah, Michael..."
                value={form.clientName}
                onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Client Description */}
            <div>
              <Label className="text-sm font-medium">Client Description</Label>
              <Textarea
                placeholder="Describe what the client is looking for in free text... e.g., 'Looking for 10+ acres, RV parking, no HOA, under $3500/acre in Oklahoma or Missouri'"
                value={form.clientDescription}
                onChange={e => setForm(f => ({ ...f, clientDescription: e.target.value }))}
                className="mt-1 min-h-[80px]"
              />
            </div>

            <Separator />

            {/* Budget Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Budget</h3>
              <div className="space-y-4">
                {/* Cash Budget */}
                <div>
                  <Label className="text-xs text-gray-500">Cash Price Range</Label>
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={form.budgetCashMin}
                        onChange={e => setForm(f => ({ ...f, budgetCashMin: Math.max(0, Number(e.target.value) || 0) }))}
                        onBlur={e => saveBudgetToHistory('budgetCashMin', Number(e.target.value) || 0)}
                        onFocus={() => setShowBudgetDropdown('budgetCashMin')}
                        placeholder="Min"
                        className="w-full h-8 pl-5 pr-2 text-xs border rounded-md font-mono"
                      />
                      {showBudgetDropdown === 'budgetCashMin' && budgetHistory.budgetCashMin?.length > 0 && (
                        <div className="absolute top-9 left-0 bg-white border rounded-md shadow-lg z-10 w-full">
                          {budgetHistory.budgetCashMin.map((val, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setForm(f => ({ ...f, budgetCashMin: val }));
                                setShowBudgetDropdown(null);
                              }}
                              className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100 border-b last:border-b-0"
                            >
                              {fmt(val)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="flex items-center text-gray-400">–</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={form.budgetCashMax}
                        onChange={e => setForm(f => ({ ...f, budgetCashMax: Math.max(0, Number(e.target.value) || 0) }))}
                        onBlur={e => saveBudgetToHistory('budgetCashMax', Number(e.target.value) || 0)}
                        onFocus={() => setShowBudgetDropdown('budgetCashMax')}
                        placeholder="Max"
                        className="w-full h-8 pl-5 pr-2 text-xs border rounded-md font-mono"
                      />
                      {showBudgetDropdown === 'budgetCashMax' && budgetHistory.budgetCashMax?.length > 0 && (
                        <div className="absolute top-9 left-0 bg-white border rounded-md shadow-lg z-10 w-full">
                          {budgetHistory.budgetCashMax.map((val, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setForm(f => ({ ...f, budgetCashMax: val }));
                                setShowBudgetDropdown(null);
                              }}
                              className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100 border-b last:border-b-0"
                            >
                              {fmt(val)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Down Payment Range</Label>
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={form.downPaymentMin}
                        onChange={e => setForm(f => ({ ...f, downPaymentMin: Math.max(0, Number(e.target.value) || 0) }))}
                        onBlur={e => saveBudgetToHistory('downPaymentMin', Number(e.target.value) || 0)}
                        onFocus={() => setShowBudgetDropdown('downPaymentMin')}
                        placeholder="Min"
                        className="w-full h-8 pl-5 pr-2 text-xs border rounded-md font-mono"
                      />
                      {showBudgetDropdown === 'downPaymentMin' && budgetHistory.downPaymentMin?.length > 0 && (
                        <div className="absolute top-9 left-0 bg-white border rounded-md shadow-lg z-10 w-full">
                          {budgetHistory.downPaymentMin.map((val, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setForm(f => ({ ...f, downPaymentMin: val }));
                                setShowBudgetDropdown(null);
                              }}
                              className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100 border-b last:border-b-0"
                            >
                              {fmt(val)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="flex items-center text-gray-400">–</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={form.downPaymentMax}
                        onChange={e => setForm(f => ({ ...f, downPaymentMax: Math.max(0, Number(e.target.value) || 0) }))}
                        onBlur={e => saveBudgetToHistory('downPaymentMax', Number(e.target.value) || 0)}
                        onFocus={() => setShowBudgetDropdown('downPaymentMax')}
                        placeholder="Max"
                        className="w-full h-8 pl-5 pr-2 text-xs border rounded-md font-mono"
                      />
                      {showBudgetDropdown === 'downPaymentMax' && budgetHistory.downPaymentMax?.length > 0 && (
                        <div className="absolute top-9 left-0 bg-white border rounded-md shadow-lg z-10 w-full">
                          {budgetHistory.downPaymentMax.map((val, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setForm(f => ({ ...f, downPaymentMax: val }));
                                setShowBudgetDropdown(null);
                              }}
                              className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100 border-b last:border-b-0"
                            >
                              {fmt(val)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Monthly Payment Range</Label>
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                      <input
                        type="number"
                        min={0}
                        step={25}
                        value={form.monthlyMin}
                        onChange={e => setForm(f => ({ ...f, monthlyMin: Math.max(0, Number(e.target.value) || 0) }))}
                        onBlur={e => saveBudgetToHistory('monthlyMin', Number(e.target.value) || 0)}
                        onFocus={() => setShowBudgetDropdown('monthlyMin')}
                        placeholder="Min"
                        className="w-full h-8 pl-5 pr-2 text-xs border rounded-md font-mono"
                      />
                      {showBudgetDropdown === 'monthlyMin' && budgetHistory.monthlyMin?.length > 0 && (
                        <div className="absolute top-9 left-0 bg-white border rounded-md shadow-lg z-10 w-full">
                          {budgetHistory.monthlyMin.map((val, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setForm(f => ({ ...f, monthlyMin: val }));
                                setShowBudgetDropdown(null);
                              }}
                              className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100 border-b last:border-b-0"
                            >
                              {fmt(val)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="flex items-center text-gray-400">–</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                      <input
                        type="number"
                        min={0}
                        step={25}
                        value={form.monthlyMax}
                        onChange={e => setForm(f => ({ ...f, monthlyMax: Math.max(0, Number(e.target.value) || 0) }))}
                        onBlur={e => saveBudgetToHistory('monthlyMax', Number(e.target.value) || 0)}
                        onFocus={() => setShowBudgetDropdown('monthlyMax')}
                        placeholder="Max"
                        className="w-full h-8 pl-5 pr-2 text-xs border rounded-md font-mono"
                      />
                      {showBudgetDropdown === 'monthlyMax' && budgetHistory.monthlyMax?.length > 0 && (
                        <div className="absolute top-9 left-0 bg-white border rounded-md shadow-lg z-10 w-full">
                          {budgetHistory.monthlyMax.map((val, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setForm(f => ({ ...f, monthlyMax: val }));
                                setShowBudgetDropdown(null);
                              }}
                              className="w-full text-left px-3 py-1 text-xs hover:bg-gray-100 border-b last:border-b-0"
                            >
                              {fmt(val)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Location</h3>
              <div className="space-y-3">
                {/* Multi-select states */}
                <div>
                  <Label className="text-xs text-gray-500 block mb-2">Preferred States</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {US_STATES.map(state => (
                      <label key={state} className="flex items-center gap-2 cursor-pointer p-2 rounded border hover:bg-slate-50 transition-colors">
                        <Checkbox
                          checked={form.states.includes(state)}
                          onCheckedChange={() => toggleState(state)}
                        />
                        <span className="text-sm">{state}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Counties - show if states selected */}
                {form.states.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-500">Preferred Counties</Label>
                    <div className="relative mt-1">
                      <Input
                        placeholder="Type to search counties..."
                        value={countyInput}
                        onChange={e => { setCountyInput(e.target.value); setShowCountySuggestions(true); }}
                        onFocus={() => setShowCountySuggestions(true)}
                        onBlur={() => setTimeout(() => setShowCountySuggestions(false), 200)}
                      />
                      {showCountySuggestions && (
                        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {filteredCounties().map(c => (
                            <button
                              key={c}
                              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 ${form.counties.includes(c) ? "text-gray-400" : ""}`}
                              onMouseDown={e => { e.preventDefault(); addCounty(c); }}
                            >
                              {c} County {form.counties.includes(c) ? "✓" : ""}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {form.counties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.counties.map(c => (
                          <Badge key={c} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors" onClick={() => removeCounty(c)}>
                            {c} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Requirements Section */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Requirements</h3>
              <div className="space-y-4">
                {/* HOA */}
                <div className="flex items-center gap-2 p-2 rounded border">
                  <Checkbox checked={form.noHOA} onCheckedChange={(v: boolean) => setForm(f => ({ ...f, noHOA: !!v }))} />
                  <Label className="text-sm cursor-pointer">No HOA Required</Label>
                </div>

                {/* Land Uses */}
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Land Uses</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {LAND_USES.map(use => (
                      <label key={use.id} className="flex items-center gap-2 cursor-pointer p-2 rounded border hover:bg-slate-50 transition-colors">
                        <Checkbox
                          checked={form.landUses.includes(use.id)}
                          onCheckedChange={() => toggleLandUse(use.id)}
                        />
                        <span className="text-sm">{use.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Acreage Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500">Minimum Acres</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 1"
                      value={form.minAcres}
                      onChange={e => setForm(f => ({ ...f, minAcres: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Maximum Acres</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 40"
                      value={form.maxAcres}
                      onChange={e => setForm(f => ({ ...f, maxAcres: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Road Requirement */}
                <div>
                  <Label className="text-xs text-gray-500">Road Access</Label>
                  <Select value={form.roadRequirement} onValueChange={v => setForm(f => ({ ...f, roadRequirement: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {ROAD_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Power Nearby */}
                <div>
                  <Label className="text-xs text-gray-500">Power Nearby</Label>
                  <Select value={form.powerNearby} onValueChange={v => setForm(f => ({ ...f, powerNearby: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes — Required</SelectItem>
                      <SelectItem value="no">Not Required</SelectItem>
                      <SelectItem value="any">Doesn't Matter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Toggles row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-2 rounded border">
                    <Label className="text-sm">Owner Financing Required</Label>
                    <Switch checked={form.ownerFinancing} onCheckedChange={v => setForm(f => ({ ...f, ownerFinancing: v }))} />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded border">
                    <Label className="text-sm">Immediate Residence</Label>
                    <Switch checked={form.immediateResidence} onCheckedChange={v => setForm(f => ({ ...f, immediateResidence: v }))} />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div>
              <Label className="text-xs text-gray-500">Additional Notes</Label>
              <Textarea
                placeholder="Any other details, preferences, or special requirements..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="mt-1 min-h-[80px]"
              />
            </div>

            {/* Submit */}
            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2" onClick={handleSubmit}>
              <Search className="w-4 h-4" />
              Generate Research Brief
            </Button>
          </div>
        ) : (
          /* SUMMARY VIEW */
          <div className="space-y-4">
            <Card className="border-2 border-slate-200 bg-slate-50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Client */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Client</span>
                    <span className="font-semibold">{form.clientName || "—"}</span>
                  </div>
                  <Separator />

                  {/* Budget */}
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-1.5">Budget</span>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white rounded p-2 border">
                        <span className="text-xs text-gray-400 block">Cash Price</span>
                        <span className="font-medium">{fmt(form.budgetCashMin)} – {fmt(form.budgetCashMax)}</span>
                      </div>
                      <div className="bg-white rounded p-2 border">
                        <span className="text-xs text-gray-400 block">Down Payment</span>
                        <span className="font-medium">{fmt(form.downPaymentMin)} – {fmt(form.downPaymentMax)}</span>
                      </div>
                      <div className="bg-white rounded p-2 border col-span-2">
                        <span className="text-xs text-gray-400 block">Monthly Payment</span>
                        <span className="font-medium">{fmt(form.monthlyMin)} – {fmt(form.monthlyMax)}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Location */}
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-1.5">Location</span>
                    <div className="text-sm">
                      <div className="mb-1.5">
                        <span className="text-gray-500">States:</span> {form.states.length > 0 ? form.states.map(s => (
                          <Badge key={s} variant="outline" className="ml-1 bg-slate-50 text-slate-700 border-slate-200">{s}</Badge>
                        )) : <strong>—</strong>}
                      </div>
                      <div><span className="text-gray-500">Counties:</span></div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {form.counties.length > 0 ? form.counties.map(c => (
                          <Badge key={c} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{c}</Badge>
                        )) : <span className="text-gray-400 text-sm">No specific counties</span>}
                      </div>
                    </div>
                  </div>
                  <Separator />

                  {/* Requirements */}
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-1.5">Requirements</span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                      <div><span className="text-gray-500">HOA:</span> <strong>{form.noHOA ? "No HOA" : "Allowed"}</strong></div>
                      <div><span className="text-gray-500">Acres:</span> <strong>{form.minAcres || "—"} – {form.maxAcres || "—"}</strong></div>
                      <div><span className="text-gray-500">Road:</span> <strong>{form.roadRequirement || "—"}</strong></div>
                      <div><span className="text-gray-500">Power:</span> <strong>{form.powerNearby === "yes" ? "Required" : form.powerNearby === "no" ? "Not required" : "Any"}</strong></div>
                      <div><span className="text-gray-500">Owner Finance:</span> <strong>{form.ownerFinancing ? "Required" : "No"}</strong></div>
                      <div><span className="text-gray-500">Immediate:</span> <strong>{form.immediateResidence ? "Yes" : "No"}</strong></div>
                    </div>
                  </div>

                  {/* Land Uses */}
                  {form.landUses.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-1.5">Land Uses</span>
                        <div className="flex flex-wrap gap-1.5">
                          {form.landUses.map(id => {
                            const use = LAND_USES.find(u => u.id === id);
                            return <Badge key={id} className="bg-emerald-50 text-emerald-700 border-emerald-200">{use?.label}</Badge>;
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Notes */}
                  {form.notes.trim() && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium block mb-1.5">Notes</span>
                        <div className="bg-amber-50 border border-amber-200 rounded p-2 text-sm">{form.notes}</div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save error message */}
            {saveError && (
              <Card className="border border-red-200 bg-red-50">
                <CardContent className="p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-red-700">{saveError}</div>
                </CardContent>
              </Card>
            )}

            {/* Save success message */}
            {savedId && (
              <Card className="border border-emerald-200 bg-emerald-50">
                <CardContent className="p-3 flex gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-700">
                    {savedId.startsWith('local-')
                      ? "Research saved locally & copied to clipboard! Ready to start research."
                      : `Research saved to database (ID: ${savedId})`}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Plan */}
            {searchPlan.length > 0 && savedId && (
              <Card className="border border-blue-200 bg-blue-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">
                      Search Plan — {searchPlan.length} searches across {new Set(searchPlan.map(p => p.engine.id)).size} sites
                    </span>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {searchPlan.map((plan, i) => (
                      <a key={i} href={plan.searchUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 p-1.5 rounded bg-white/60 hover:bg-white transition-colors group text-xs">
                        <span className="font-medium text-blue-800 min-w-[80px]">{plan.engine.name}</span>
                        <span className="text-blue-600 truncate flex-1">{plan.county ? `${plan.county} Co, ${plan.state}` : plan.state}</span>
                        <ExternalLink className="w-3 h-3 text-blue-300 group-hover:text-blue-600" />
                      </a>
                    ))}
                  </div>
                  <p className="text-[10px] text-blue-500 mt-2">
                    Click each link to search. Each property found must have a direct listing URL.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <span className="animate-spin">⏳</span> : <Check className="w-4 h-4" />}
                {saving ? "Saving..." : "Save & Start Research"}
              </Button>
              <Button className="flex-1 gap-2" variant={copied ? "default" : "outline"} onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
            </div>

            <Button variant="outline" className="w-full" onClick={handleReset}>New Form</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
