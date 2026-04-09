import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { mockBusinesses } from "@/lib/mock-data";
import { Building2, Plus, X, Search, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BusinessStatus = "active" | "expired" | "pending";

interface Business {
  id: string;
  businessName: string;
  ownerName: string;
  type: string;
  address: string;
  permitNumber: string;
  status: BusinessStatus;
}

const statusStyles: Record<BusinessStatus, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  expired: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
};

const statusIcons: Record<BusinessStatus, React.ReactNode> = {
  active: <CheckCircle2 className="w-3.5 h-3.5" />,
  expired: <AlertCircle className="w-3.5 h-3.5" />,
  pending: <Clock className="w-3.5 h-3.5" />,
};

export default function OfficialBusinessesPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses as Business[]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BusinessStatus>("all");
  const [selected, setSelected] = useState<Business | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = businesses.filter(b => {
    const m = b.businessName.toLowerCase().includes(search.toLowerCase()) || b.ownerName.toLowerCase().includes(search.toLowerCase());
    const f = statusFilter === "all" || b.status === statusFilter;
    return m && f;
  });

  const [form, setForm] = useState({
    businessName: "", ownerName: "", type: "", address: "", permitNumber: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      businessName: form.businessName,
      ownerName: form.ownerName,
      type: form.type,
      address: form.address,
      permitNumber: form.permitNumber,
      status: "pending",
    };
    setBusinesses(prev => [newBiz, ...prev]);
    setShowForm(false);
    toast({ title: "Business Registered", description: `"${form.businessName}" has been added.` });
    setForm({ businessName: "", ownerName: "", type: "", address: "", permitNumber: "" });
  };

  const updateStatus = (id: string, status: BusinessStatus) => {
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setSelected(prev => prev ? { ...prev, status } : null);
    toast({ title: "Status Updated", description: `Business status updated to: ${status}` });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Business Registry"
        description={`${businesses.filter(b => b.status === "active").length} active permits`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setShowForm(true)} data-testid="button-add-business">
            <Plus className="w-4 h-4" /> Register Business
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search businesses..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "pending", "expired"] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${statusFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 shadow-2xl animate-fadeUp">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-bold text-foreground">{selected.businessName}</h2>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 mb-5">
                {[
                  { label: "Business ID", value: selected.id },
                  { label: "Owner", value: selected.ownerName },
                  { label: "Business Type", value: selected.type },
                  { label: "Address", value: selected.address },
                  { label: "Permit Number", value: selected.permitNumber || "Not yet issued" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-xs text-muted-foreground w-28 shrink-0 mt-0.5">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[selected.status]}`}>
                    {statusIcons[selected.status]} {selected.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-border">
                {(["active", "pending", "expired"] as BusinessStatus[]).filter(s => s !== selected.status).map(s => (
                  <Button key={s} size="sm" variant="outline" onClick={() => updateStatus(selected.id, s)} className="text-xs capitalize flex-1">
                    Mark as {s}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 shadow-2xl animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">Register Business</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label>Business Name</Label><Input value={form.businessName} onChange={e => setForm(p => ({ ...p, businessName: e.target.value }))} className="mt-1" required data-testid="input-business-name" /></div>
                <div><Label>Owner Name</Label><Input value={form.ownerName} onChange={e => setForm(p => ({ ...p, ownerName: e.target.value }))} className="mt-1" required data-testid="input-owner-name" /></div>
                <div>
                  <Label>Business Type</Label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                    {["Retail (Sari-Sari Store)", "Food & Beverage", "Services", "Construction", "Manufacturing", "Transportation", "Others"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Purok X, Santiago" className="mt-1" required /></div>
                <div><Label>Permit Number (Optional)</Label><Input value={form.permitNumber} onChange={e => setForm(p => ({ ...p, permitNumber: e.target.value }))} placeholder="BP-2026-XXX" className="mt-1" /></div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-business">Register</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        <p className="text-sm text-muted-foreground">{filtered.length} business{filtered.length !== 1 ? "es" : ""}</p>
        <div className="space-y-2">
          {filtered.map(b => (
            <Card
              key={b.id}
              className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelected(b)}
              data-testid={`business-row-${b.id}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{b.businessName}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span>{b.ownerName}</span>
                    <span>{b.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[b.status]}`}>
                    {statusIcons[b.status]} {b.status}
                  </span>
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
