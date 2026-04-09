import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { mockProjects } from "@/lib/mock-data";
import { FolderKanban, Plus, X, Users, MapPin, CalendarDays, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProjectStatus = "planning" | "ongoing" | "completed";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  location: string;
  budget: number;
  actualCost: number;
  leadBy: string;
  beneficiaries: number;
  fundSource: string;
  milestones: Array<{ name: string; date: string; status: "completed" | "pending" }>;
}

const statusStyles: Record<ProjectStatus, string> = {
  planning: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function OfficialProjectsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(mockProjects as Project[]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter);

  const [form, setForm] = useState({
    title: "", description: "", category: "", startDate: "", endDate: "",
    location: "", budget: "", leadBy: "", beneficiaries: "", fundSource: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: Project = {
      id: `PRJ-00${projects.length + 5}`,
      title: form.title,
      description: form.description,
      category: form.category,
      status: "planning",
      startDate: form.startDate,
      endDate: form.endDate,
      location: form.location,
      budget: parseFloat(form.budget) || 0,
      actualCost: 0,
      leadBy: form.leadBy,
      beneficiaries: parseInt(form.beneficiaries) || 0,
      fundSource: form.fundSource,
      milestones: [],
    };
    setProjects(prev => [newProj, ...prev]);
    setShowForm(false);
    toast({ title: "Project Added", description: `"${form.title}" has been recorded.` });
    setForm({ title: "", description: "", category: "", startDate: "", endDate: "", location: "", budget: "", leadBy: "", beneficiaries: "", fundSource: "" });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Projects & Programs"
        description={`${projects.filter(p => p.status === "ongoing").length} ongoing`}
        onMenuClick={toggle}
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setShowForm(true)} data-testid="button-add-project">
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {(["all", "planning", "ongoing", "completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Detail modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline" className="mb-1 border-primary/30 text-primary">{selected.category}</Badge>
                  <h2 className="text-xl font-bold text-foreground">{selected.title}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted ml-3"><X className="w-5 h-5" /></button>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[selected.status]}`}>{selected.status}</span>
              <p className="text-muted-foreground text-sm leading-relaxed my-4">{selected.description}</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Location", value: selected.location, icon: <MapPin className="w-4 h-4 text-primary" /> },
                  { label: "Lead By", value: selected.leadBy, icon: <Users className="w-4 h-4 text-primary" /> },
                  { label: "Budget", value: `₱${selected.budget.toLocaleString()}`, icon: <DollarSign className="w-4 h-4 text-primary" /> },
                  { label: "Actual Cost", value: `₱${selected.actualCost.toLocaleString()}`, icon: <DollarSign className="w-4 h-4 text-primary" /> },
                  { label: "Beneficiaries", value: `${selected.beneficiaries} residents`, icon: <Users className="w-4 h-4 text-primary" /> },
                  { label: "Fund Source", value: selected.fundSource, icon: <DollarSign className="w-4 h-4 text-primary" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                    {item.icon}
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {selected.milestones.length > 0 && (
                <>
                  <h3 className="font-semibold text-foreground mb-3">Milestones</h3>
                  <div className="space-y-2">
                    {selected.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                        {m.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <Clock className="w-4 h-4 text-muted-foreground shrink-0" />}
                        <span className={`text-sm flex-1 ${m.status === "completed" ? "text-foreground" : "text-muted-foreground"}`}>{m.name}</span>
                        <span className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* Budget progress */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Budget Utilization</span>
                  <span className="font-semibold">{selected.budget > 0 ? Math.round((selected.actualCost / selected.budget) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, selected.budget > 0 ? (selected.actualCost / selected.budget) * 100 : 0)}%` }}
                  />
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
                <h2 className="font-bold text-foreground">Add New Project</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label>Project Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1" required data-testid="input-title" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Health & Nutrition", "Infrastructure", "Livelihood", "Sports & Recreation", "Education", "Environment", "Others"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Budget (₱)</Label><Input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>Beneficiaries</Label><Input type="number" value={form.beneficiaries} onChange={e => setForm(p => ({ ...p, beneficiaries: e.target.value }))} className="mt-1" /></div>
                </div>
                <div><Label>Lead By</Label><Input value={form.leadBy} onChange={e => setForm(p => ({ ...p, leadBy: e.target.value }))} className="mt-1" required /></div>
                <div><Label>Fund Source</Label><Input value={form.fundSource} onChange={e => setForm(p => ({ ...p, fundSource: e.target.value }))} placeholder="e.g., Barangay Development Fund" className="mt-1" /></div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" required /></div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-project">Add Project</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(proj => (
            <Card
              key={proj.id}
              className="p-5 border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelected(proj)}
              data-testid={`project-card-${proj.id}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <Badge variant="outline" className="text-xs border-primary/20 text-primary">{proj.category}</Badge>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[proj.status]}`}>{proj.status}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{proj.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{proj.description}</p>
              <div className="pt-3 border-t border-border/50 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Budget: ₱{proj.budget.toLocaleString()}</span>
                  <span>{proj.beneficiaries} beneficiaries</span>
                </div>
                {proj.budget > 0 && (
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (proj.actualCost / proj.budget) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
