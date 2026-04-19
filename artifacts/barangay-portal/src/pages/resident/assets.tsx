import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { api } from "@/lib/api";
import { Package, MapPin, User, Eye, X } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  condition: string;
  assignedTo?: string;
  acquisitionDate?: string;
  value?: number;
}

export default function ResidentAssetsPage() {
  const { toggle } = useSidebarToggle();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selected, setSelected] = useState<Asset | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    api.assets.list().then(data => setAssets(data as Asset[])).catch(console.error);
  }, []);

  const categories = ["all", ...new Set(assets.map(a => a.category))];
  const filtered = filter === "all" ? assets : assets.filter(a => a.category === filter);

  const conditionStyles: Record<string, string> = {
    excellent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    good: "bg-blue-50 text-blue-700 border-blue-200",
    fair: "bg-amber-50 text-amber-700 border-amber-200",
    poor: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="Barangay Assets" description="Viewing only - managed by officials" onMenuClick={toggle} />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${filter === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}
            >
              {c === "all" ? "All Assets" : c}
            </button>
          ))}
        </div>

        {/* Detail view */}
        {selected ? (
          <Card className="p-6 border-primary/20 animate-fadeUp">
            <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4">← Back to list</button>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary">{selected.category}</Badge>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${conditionStyles[selected.condition.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"}`}>{selected.condition}</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">{selected.description}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Location", value: selected.location, icon: <MapPin className="w-4 h-4" /> },
                selected.assignedTo && { label: "Assigned To", value: selected.assignedTo, icon: <User className="w-4 h-4" /> },
                selected.acquisitionDate && { label: "Acquisition Date", value: new Date(selected.acquisitionDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }), icon: <Package className="w-4 h-4" /> },
                selected.value && { label: "Asset Value", value: `₱${selected.value.toLocaleString()}`, icon: <Package className="w-4 h-4" /> },
              ].filter(Boolean).map((item: any, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                  <span className="text-primary mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <>
            {filtered.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No assets in this category</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(asset => (
                  <Card
                    key={asset.id}
                    className="p-5 border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelected(asset)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary mb-2">{asset.category}</Badge>
                        <h3 className="font-semibold text-foreground text-sm">{asset.name}</h3>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${conditionStyles[asset.condition.toLowerCase()] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                        {asset.condition}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{asset.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{asset.location}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
