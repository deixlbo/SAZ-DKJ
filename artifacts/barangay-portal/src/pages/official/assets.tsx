import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { mockAssets } from "@/lib/mock-data";
import { Package, Plus, X, Search, Eye, Pencil, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AssetCategory = "Vehicle" | "IT Equipment" | "Equipment" | "Furniture" | "Other";
type AssetStatus = "Active" | "In Repair" | "Retired" | "Lost" | "For Disposal";

interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  quantity: number;
  status: AssetStatus;
  location: string;
  accountableOfficer: string;
  acquisitionDate: string;
  acquisitionCost: number;
  serialNumber?: string;
  warranty?: string;
}

const statusColors: Record<AssetStatus, string> = {
  "Active": "bg-emerald-100 text-emerald-700",
  "In Repair": "bg-amber-100 text-amber-700",
  "Retired": "bg-gray-100 text-gray-700",
  "Lost": "bg-red-100 text-red-700",
  "For Disposal": "bg-slate-100 text-slate-700",
};

const emptyForm = {
  name: "",
  category: "Equipment" as AssetCategory,
  description: "",
  quantity: "1",
  status: "Active" as AssetStatus,
  location: "",
  accountableOfficer: "",
  acquisitionDate: "",
  acquisitionCost: "",
  serialNumber: "",
};

// Enrich mock data with quantity and status fields
const enrichMockAssets = (assets: any[]): Asset[] => assets.map((a, i) => ({
  ...a,
  quantity: a.quantity ?? [2, 1, 1, 5, 3, 4][i % 6] ?? 1,
  status: a.status ?? (["Active", "Active", "In Repair", "Active", "Retired", "For Disposal"][i % 6] as AssetStatus),
}));

export default function OfficialAssetsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>(enrichMockAssets(mockAssets as any[]));
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Asset | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"all" | AssetCategory>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AssetStatus>("all");
  const [form, setForm] = useState(emptyForm);

  const filtered = assets.filter(a => {
    const m = a.name.toLowerCase().includes(search.toLowerCase())
      || a.id.toLowerCase().includes(search.toLowerCase())
      || a.location.toLowerCase().includes(search.toLowerCase())
      || a.category.toLowerCase().includes(search.toLowerCase());
    const fc = categoryFilter === "all" || a.category === categoryFilter;
    const fs = statusFilter === "all" || a.status === statusFilter;
    return m && fc && fs;
  });

  const totalValue = assets.reduce((sum, a) => sum + a.acquisitionCost, 0);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (asset: Asset) => {
    setForm({
      name: asset.name,
      category: asset.category,
      description: asset.description,
      quantity: String(asset.quantity),
      status: asset.status,
      location: asset.location,
      accountableOfficer: asset.accountableOfficer,
      acquisitionDate: asset.acquisitionDate,
      acquisitionCost: String(asset.acquisitionCost),
      serialNumber: asset.serialNumber || "",
    });
    setEditingId(asset.id);
    setSelected(null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    setSelected(null);
    toast({ title: "Asset Removed", description: "The asset has been deleted from inventory." });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAssets(prev => prev.map(a => a.id === editingId ? {
        ...a,
        name: form.name,
        category: form.category,
        description: form.description,
        quantity: parseInt(form.quantity) || 1,
        status: form.status,
        location: form.location,
        accountableOfficer: form.accountableOfficer,
        acquisitionDate: form.acquisitionDate,
        acquisitionCost: parseFloat(form.acquisitionCost) || 0,
        serialNumber: form.serialNumber || undefined,
      } : a));
      toast({ title: "Asset Updated", description: `"${form.name}" has been updated.` });
    } else {
      const newAsset: Asset = {
        id: `AST-00${assets.length + 5}`,
        name: form.name,
        category: form.category,
        description: form.description,
        quantity: parseInt(form.quantity) || 1,
        status: form.status,
        location: form.location,
        accountableOfficer: form.accountableOfficer,
        acquisitionDate: form.acquisitionDate,
        acquisitionCost: parseFloat(form.acquisitionCost) || 0,
        serialNumber: form.serialNumber || undefined,
      };
      setAssets(prev => [newAsset, ...prev]);
      toast({ title: "Asset Registered", description: `"${form.name}" added to inventory.` });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Asset Inventory"
        description={`${assets.length} assets · Total: ₱${totalValue.toLocaleString()}`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Asset
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["Vehicle", "IT Equipment", "Equipment", "Furniture"] as AssetCategory[]).map(cat => {
            const count = assets.filter(a => a.category === cat).length;
            const total = assets.filter(a => a.category === cat).reduce((s, a) => s + a.quantity, 0);
            return (
              <Card
                key={cat}
                className={`p-3 cursor-pointer transition-all ${categoryFilter === cat ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"}`}
                onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
              >
                <p className="text-xs text-muted-foreground">{cat}</p>
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground">{total} units</p>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search assets by name, location..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "Active", "In Repair", "Retired", "Lost", "For Disposal"] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-xs px-2.5 py-1.5 rounded-full border font-medium transition-all ${statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {s === "all" ? "All Status" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-6 shadow-2xl animate-fadeUp max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-bold text-foreground">{selected.name}</h2>
                  <span className="text-xs font-mono text-muted-foreground">{selected.id}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button onClick={() => openEdit(selected)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>{selected.status}</span>
                <span className="text-xs border border-primary/20 text-primary px-1.5 py-0.5 rounded-full">{selected.category}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Quantity", value: String(selected.quantity) + " unit(s)" },
                  { label: "Location", value: selected.location },
                  { label: "Accountable Officer", value: selected.accountableOfficer },
                  { label: "Acquisition Date", value: new Date(selected.acquisitionDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) },
                  { label: "Acquisition Cost", value: `₱${selected.acquisitionCost.toLocaleString()}` },
                  ...(selected.serialNumber ? [{ label: "Serial Number", value: selected.serialNumber }] : []),
                  ...(selected.warranty ? [{ label: "Warranty Until", value: new Date(selected.warranty).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) }] : []),
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.description && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground">{selected.description}</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">{editingId ? "Edit Asset" : "Register New Asset"}</h2>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Asset Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1" required /></div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as AssetCategory }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Vehicle", "IT Equipment", "Equipment", "Furniture", "Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as AssetStatus }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Active", "In Repair", "Retired", "Lost", "For Disposal"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" min="1" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} className="mt-1" required />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g., Barangay Hall" className="mt-1" required />
                  </div>
                </div>

                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" required /></div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Acquisition Date</Label><Input type="date" value={form.acquisitionDate} onChange={e => setForm(p => ({ ...p, acquisitionDate: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>Cost (₱)</Label><Input type="number" value={form.acquisitionCost} onChange={e => setForm(p => ({ ...p, acquisitionCost: e.target.value }))} className="mt-1" required /></div>
                </div>

                <div><Label>Accountable Officer</Label><Input value={form.accountableOfficer} onChange={e => setForm(p => ({ ...p, accountableOfficer: e.target.value }))} className="mt-1" required /></div>
                <div><Label>Serial Number (Optional)</Label><Input value={form.serialNumber} onChange={e => setForm(p => ({ ...p, serialNumber: e.target.value }))} className="mt-1" /></div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">{editingId ? "Save Changes" : "Register Asset"}</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Assets List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No assets found</p>
            </div>
          ) : (
            filtered.map(asset => (
              <Card
                key={asset.id}
                className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => setSelected(asset)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{asset.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                      <span>{asset.category}</span>
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{asset.location}</span>
                      <span className="font-medium text-foreground">{asset.quantity} unit{asset.quantity !== 1 ? "s" : ""}</span>
                      <span>₱{asset.acquisitionCost.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[asset.status]}`}>{asset.status}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(asset); }}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <Eye className="w-4 h-4 text-muted-foreground mt-1" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
