import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { mockOrdinances } from "@/lib/mock-data";
import { BookOpen, Search, X } from "lucide-react";

type OrdinanceType = "Ordinance" | "Resolution";
type OrdinanceStatus = "Active" | "Repealed" | "Superseded";

interface Ordinance {
  id: string;
  number: string;
  title: string;
  type: OrdinanceType;
  dateEnacted: string;
  author: string;
  status: OrdinanceStatus;
  summary: string;
  fullText: string;
}

function OrdinanceDocument({ ord, onClose }: { ord: Ordinance; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl shadow-2xl my-4 bg-white">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">{ord.type}</Badge>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ord.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>{ord.status}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* White clean document */}
        <div className="p-8 sm:p-12 bg-white" id="print-area">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-700">Republic of the Philippines</p>
            <p className="text-sm text-gray-600">Province of Zambales · Municipality of San Antonio</p>
            <p className="text-base font-bold text-gray-900 mt-1">BARANGAY SANTIAGO SAZ</p>
            <div className="border-b-2 border-gray-800 mt-4 mb-6" />
            <p className="text-xs font-mono text-gray-500 mb-1">{ord.number}</p>
            <h1 className="text-lg font-bold text-gray-900 uppercase leading-tight">{ord.title}</h1>
            <p className="text-xs text-gray-500 mt-2">
              Enacted: {new Date(ord.dateEnacted).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })} · Author: {ord.author}
            </p>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-gray-600 italic mb-6">{ord.summary}</p>
            <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">{ord.fullText}</pre>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ResidentOrdinancesPage() {
  const { toggle } = useSidebarToggle();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ordinance | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | OrdinanceType>("all");

  const filtered = (mockOrdinances as Ordinance[]).filter(o => {
    const m = o.title.toLowerCase().includes(search.toLowerCase())
      || o.number.toLowerCase().includes(search.toLowerCase())
      || o.summary.toLowerCase().includes(search.toLowerCase());
    const f = typeFilter === "all" || o.type === typeFilter;
    return m && f;
  });

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Ordinances & Resolutions"
        description="Official barangay laws and resolutions"
        onMenuClick={toggle}
      />

      {selected && (
        <OrdinanceDocument ord={selected} onClose={() => setSelected(null)} />
      )}

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search ordinances..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(["all", "Ordinance", "Resolution"] as const).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${typeFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "record" : "records"} — Click any item to read and print the full document
        </p>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No ordinances found</p>
            </div>
          ) : (
            filtered.map(ord => (
              <Card
                key={ord.id}
                className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => setSelected(ord)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-muted-foreground">{ord.number}</span>
                      <Badge variant="outline" className="text-xs border-primary/20 text-primary">{ord.type}</Badge>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${ord.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>{ord.status}</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground line-clamp-2">{ord.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ord.author} · {new Date(ord.dateEnacted).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{ord.summary}</p>
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
