import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { mockAssets } from "@/lib/mock-data";
import { Package, Plus, X, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AssetCategory = "Vehicle" | "IT Equipment" | "Equipment" | "Furniture" | "Other";
type Condition = "Excellent" | "Good" | "Fair" | "Poor" | "For Disposal";

interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  acquisitionDate: string;
  acquisitionCost: number;
  condition: Condition;
  location: string;
  accountableOfficer: string;
  serialNumber?: string;
  warranty?: string;
}

const conditionColors: Record<Condition, string> = {
  "Excellent": "bg-emerald-100 text-emerald-700",
  "Good": "bg-blue-100 text-blue-700",
  "Fair": "bg-amber-100 text-amber-700",
  "Poor": "bg-red-100 text-red-700",
  "For Disposal": "bg-gray-100 text-gray-700",
};

export default function OfficialAssetsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>(mockAssets as Asset[]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Asset | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"all" | AssetCategory>("all");

  const filtered = assets.filter(a => {
    const m = a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase());
    const f = categoryFilter === "all" || a.category === categoryFilter;
    return m && f;
  });

  const [form, setForm] = useState({
    name: "", category: "Equipment" as AssetCategory, description: "",
    acquisitionDate: "", acquisitionCost: "", condition: "Good" as Condition,
    location: "", accountableOfficer: "", serialNumber: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsset: Asset = {
      id: `AST-00${assets.length + 5}`,
      name: form.name,
      category: form.category,
      description: form.description,
      acquisitionDate: form.acquisitionDate,
      acquisitionCost: parseFloat(form.acquisitionCost) || 0,
      condition: form.condition,
      location: form.location,
      accountableOfficer: form.accountableOfficer,
      serialNumber: form.serialNumber || undefined,
    };
    setAssets(prev => [newAsset, ...prev]);
    setShowForm(false);
    toast({ title: "Asset Registered", description: `"${form.name}" has been added to the inventory.` });
    setForm({ name: "", category: "Equipment", description: "", acquisitionDate: "", acquisitionCost: "", condition: "Good", location: "", accountableOfficer: "", serialNumber: "" });
  };

  const totalValue = assets.reduce((sum, a) => sum + a.acquisitionCost, 0);

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Asset Inventory"
        description={`${assets.length} assets · Total: ₱${totalValue.toLocaleString()}`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setShowForm(true)} data-testid="button-add-asset">
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["Vehicle", "IT Equipment", "Equipment", "Furniture"] as AssetCategory[]).map(cat => {
            const count = assets.filter(a => a.category === cat).length;
            return (
              <Card
                key={cat}
                className={`p-3 cursor-pointer transition-all ${categoryFilter === cat ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}
                onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
              >
                <p className="text-xs text-muted-foreground">{cat}</p>
                <p className="text-2xl font-bold text-foreground">{count}</p>
              </Card>
            );
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search assets..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 shadow-2xl animate-fadeUp">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-bold text-foreground">{selected.name}</h2>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Asset ID", value: selected.id },
                  { label: "Category", value: selected.category },
                  { label: "Description", value: selected.description },
                  { label: "Acquisition Date", value: new Date(selected.acquisitionDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) },
                  { label: "Acquisition Cost", value: `₱${selected.acquisitionCost.toLocaleString()}` },
                  { label: "Location", value: selected.location },
                  { label: "Accountable Officer", value: selected.accountableOfficer },
                  ...(selected.serialNumber ? [{ label: "Serial Number", value: selected.serialNumber }] : []),
                  ...(selected.warranty ? [{ label: "Warranty Until", value: new Date(selected.warranty).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-xs text-muted-foreground w-36 shrink-0 mt-0.5">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${conditionColors[selected.condition]}`}>{selected.condition}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">Register New Asset</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label>Asset Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1" required data-testid="input-name" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as AssetCategory }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Vehicle", "IT Equipment", "Equipment", "Furniture", "Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Condition</Label>
                    <select value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value as Condition }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Excellent", "Good", "Fair", "Poor", "For Disposal"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" required /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Acquisition Date</Label><Input type="date" value={form.acquisitionDate} onChange={e => setForm(p => ({ ...p, acquisitionDate: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>Cost (₱)</Label><Input type="number" value={form.acquisitionCost} onChange={e => setForm(p => ({ ...p, acquisitionCost: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="mt-1" required /></div>
                <div><Label>Accountable Officer</Label><Input value={form.accountableOfficer} onChange={e => setForm(p => ({ ...p, accountableOfficer: e.target.value }))} className="mt-1" required /></div>
                <div><Label>Serial Number (Optional)</Label><Input value={form.serialNumber} onChange={e => setForm(p => ({ ...p, serialNumber: e.target.value }))} className="mt-1" /></div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-asset">Register Asset</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Assets List */}
        <div className="space-y-2">
          {filtered.map(asset => (
            <Card
              key={asset.id}
              className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelected(asset)}
              data-testid={`asset-row-${asset.id}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{asset.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span>{asset.category}</span>
                    <span>{asset.location}</span>
                    <span>₱{asset.acquisitionCost.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${conditionColors[asset.condition]}`}>{asset.condition}</span>
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
