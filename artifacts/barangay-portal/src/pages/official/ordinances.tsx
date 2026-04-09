import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { mockOrdinances } from "@/lib/mock-data";
import { BookOpen, Plus, X, Search, Eye, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function OfficialOrdinancesPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [ordinances, setOrdinances] = useState<Ordinance[]>(mockOrdinances as Ordinance[]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ordinance | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | OrdinanceType>("all");
  const [aiLoading, setAiLoading] = useState(false);

  const filtered = ordinances.filter(o => {
    const m = o.title.toLowerCase().includes(search.toLowerCase())
      || o.number.toLowerCase().includes(search.toLowerCase())
      || o.summary.toLowerCase().includes(search.toLowerCase());
    const f = typeFilter === "all" || o.type === typeFilter;
    return m && f;
  });

  const [form, setForm] = useState({
    number: "", title: "", type: "Ordinance" as OrdinanceType,
    dateEnacted: "", author: "", summary: "", fullText: "",
  });

  const handleAiDraft = async () => {
    if (!form.title.trim()) {
      toast({ title: "Add a title first", variant: "destructive" });
      return;
    }
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setAiLoading(false);
    const draft = `WHEREAS, it is the duty of the Barangay Council to promote the general welfare of its constituents;

WHEREAS, there is a need to address ${form.title.toLowerCase()};

NOW THEREFORE, BE IT ORDAINED/RESOLVED, as it is hereby ordained/resolved by the Sangguniang Barangay of Santiago, as follows:

Section 1. Title. This ${form.type} shall be known as "${form.title}."

Section 2. Declaration of Policy. The Barangay Santiago hereby declares its policy to uphold the rights and welfare of all residents in accordance with this ${form.type}.

Section 3. Scope and Coverage. This ${form.type} shall apply to all residents of Barangay Santiago, San Antonio, Zambales.

Section 4. Implementing Rules. The Barangay Captain, in coordination with the Barangay Council, shall issue the necessary rules and regulations to implement this ${form.type}.

Section 5. Penalties. Violations of this ${form.type} shall be subject to penalties as prescribed by applicable laws and regulations.

Section 6. Separability Clause. If any provision of this ${form.type} is declared invalid or unconstitutional, the other provisions not affected thereby shall remain valid.

Section 7. Effectivity. This ${form.type} shall take effect upon approval.`;
    setForm(p => ({ ...p, fullText: draft, summary: `This ${form.type} addresses ${form.title.toLowerCase()} within Barangay Santiago.` }));
    toast({ title: "Draft Generated", description: "AI has drafted the ordinance text." });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrd: Ordinance = {
      id: `ord-${Date.now()}`,
      number: form.number,
      title: form.title.toUpperCase(),
      type: form.type,
      dateEnacted: form.dateEnacted,
      author: form.author,
      status: "Active",
      summary: form.summary,
      fullText: form.fullText,
    };
    setOrdinances(prev => [newOrd, ...prev]);
    setShowForm(false);
    toast({ title: "Ordinance Added", description: `${form.number} has been recorded.` });
    setForm({ number: "", title: "", type: "Ordinance", dateEnacted: "", author: "", summary: "", fullText: "" });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Ordinances & Resolutions"
        description={`${ordinances.filter(o => o.status === "Active").length} active`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setShowForm(true)} data-testid="button-add-ordinance">
            <Plus className="w-4 h-4" /> Add Ordinance
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search ordinances..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
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

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="border-primary/30 text-primary">{selected.type}</Badge>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{selected.status}</span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">{selected.number}</p>
                  <h2 className="text-base font-bold text-foreground leading-tight">{selected.title}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted shrink-0"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5 pb-4 border-b border-border">
                <span>Enacted: {new Date(selected.dateEnacted).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</span>
                <span>Author: {selected.author}</span>
              </div>
              <p className="text-sm text-muted-foreground italic mb-4">{selected.summary}</p>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">Full Text</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono text-xs">{selected.fullText}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">Add Ordinance/Resolution</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Document Number</Label>
                    <Input value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="BO-2026-XXX" className="mt-1" required data-testid="input-number" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as OrdinanceType }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option>Ordinance</option><option>Resolution</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Title of the ordinance..." className="mt-1" required data-testid="input-title" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Date Enacted</Label><Input type="date" value={form.dateEnacted} onChange={e => setForm(p => ({ ...p, dateEnacted: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>Author / Sponsor</Label><Input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div><Label>Summary</Label><Input value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} placeholder="Brief description" className="mt-1" required /></div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Full Text</Label>
                    <Button type="button" size="sm" variant="outline" onClick={handleAiDraft} disabled={aiLoading} className="h-7 text-xs gap-1 border-purple-300 text-purple-700 hover:bg-purple-50" data-testid="button-ai-draft">
                      <Sparkles className="w-3 h-3" /> {aiLoading ? "Drafting..." : "AI Draft"}
                    </Button>
                  </div>
                  <Textarea value={form.fullText} onChange={e => setForm(p => ({ ...p, fullText: e.target.value }))} className="min-h-[200px] font-mono text-xs" placeholder="Full text of the ordinance or resolution..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-ordinance">Add</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        <div className="space-y-2">
          {filtered.map(ord => (
            <Card
              key={ord.id}
              className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelected(ord)}
              data-testid={`ordinance-row-${ord.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">{ord.number}</span>
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary">{ord.type}</Badge>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{ord.status}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground line-clamp-2">{ord.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ord.author} · {new Date(ord.dateEnacted).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <Eye className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
