import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { MiniCalendar } from "@/components/portal/mini-calendar";
import { mockProjects } from "@/lib/mock-data";
import {
  FolderKanban, Plus, X, Users, MapPin, CheckCircle2, Clock,
  DollarSign, CalendarDays, List, Pencil, Trash2, Printer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ProjectStatus = "planning" | "ongoing" | "completed";

interface ProgramActivity {
  time: string;
  activity: string;
  personAssigned: string;
}

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
  purpose?: string;
  targetParticipants?: string;
  activities?: ProgramActivity[];
  materialsNeeded?: string;
  expectedOutcome?: string;
}

const statusStyles: Record<ProjectStatus, string> = {
  planning: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const emptyForm = {
  title: "", description: "", category: "Health & Nutrition", startDate: "", endDate: "",
  location: "", budget: "", leadBy: "", beneficiaries: "", fundSource: "",
  purpose: "", targetParticipants: "", materialsNeeded: "", expectedOutcome: "",
};

function ProgramDocument({ proj, onClose }: { proj: Project; onClose: () => void }) {
  const activities: ProgramActivity[] = proj.activities?.length
    ? proj.activities
    : [
        { time: "___", activity: "Opening Program", personAssigned: "___" },
        { time: "___", activity: "Activity 1", personAssigned: "___" },
        { time: "___", activity: "Activity 2", personAssigned: "___" },
        { time: "___", activity: "Closing Program", personAssigned: "___" },
      ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl shadow-2xl my-4 bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden">
          <h2 className="font-bold text-foreground">Programme Document</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()} className="gap-1.5">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-8 sm:p-12 bg-white" id="print-area">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">BARANGAY PROGRAMME</h1>
            <div className="border-b-2 border-gray-800 mt-3 mb-6" />
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex gap-4">
              <span className="font-semibold text-sm w-36 shrink-0">Program Title:</span>
              <span className="text-sm border-b border-gray-400 flex-1 pb-0.5">{proj.title}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold text-sm w-36 shrink-0">Date:</span>
              <span className="text-sm border-b border-gray-400 flex-1 pb-0.5">{proj.startDate ? new Date(proj.startDate).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) : "___________________________"}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold text-sm w-36 shrink-0">Venue:</span>
              <span className="text-sm border-b border-gray-400 flex-1 pb-0.5">{proj.location || "___________________________"}</span>
            </div>
          </div>

          <hr className="border-gray-300 my-6" />

          <section className="mb-6">
            <h2 className="font-bold text-base mb-2">1. Purpose</h2>
            <p className="text-sm text-gray-700 min-h-[60px] border border-gray-200 rounded p-2">
              {proj.purpose || proj.description || "(Why this program is conducted)"}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-base mb-2">2. Target Participants</h2>
            <p className="text-sm text-gray-700 min-h-[40px] border border-gray-200 rounded p-2">
              {proj.targetParticipants || "(e.g., Youth, Residents, Senior Citizens)"}
            </p>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-base mb-3">3. Program Flow / Activities</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left w-20">Time</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Activity</th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-40">Person Assigned</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-3 py-2">{a.time}</td>
                    <td className="border border-gray-300 px-3 py-2">{a.activity}</td>
                    <td className="border border-gray-300 px-3 py-2">{a.personAssigned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-base mb-2">4. Materials Needed</h2>
            <div className="text-sm text-gray-700 min-h-[40px] border border-gray-200 rounded p-2">
              {proj.materialsNeeded
                ? proj.materialsNeeded.split("\n").map((m, i) => <p key={i}>• {m}</p>)
                : <><p>•</p><p>•</p></>}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-base mb-2">5. Budget (Optional)</h2>
            <p className="text-sm text-gray-700">₱ {proj.budget > 0 ? proj.budget.toLocaleString() : "___________________________"}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold text-base mb-2">6. Expected Outcome</h2>
            <p className="text-sm text-gray-700 min-h-[60px] border border-gray-200 rounded p-2">
              {proj.expectedOutcome || "(What you want to achieve)"}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-sm font-semibold mb-6">Prepared by:</p>
              <div className="border-b border-gray-500" />
              <p className="text-xs text-gray-500 mt-1">{proj.leadBy || "Signature over printed name"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-6">Approved by:</p>
              <div className="border-b border-gray-500" />
              <p className="text-xs text-gray-500 mt-1">HON. ROLANDO C. BORJA / Punong Barangay</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function OfficialProjectsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(mockProjects as Project[]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ProjectStatus>("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [printProj, setPrintProj] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter);

  const markedDates = projects.flatMap(p => [p.startDate, p.endDate]).filter(Boolean);
  const getDateCount = (date: string) => projects.filter(p => p.startDate === date || p.endDate === date).length;
  const calendarProjects = selectedDate
    ? projects.filter(p => {
        const start = new Date(p.startDate);
        const end = new Date(p.endDate);
        const sel = new Date(selectedDate);
        return sel >= start && sel <= end;
      })
    : [];

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (proj: Project) => {
    setForm({
      title: proj.title,
      description: proj.description,
      category: proj.category,
      startDate: proj.startDate,
      endDate: proj.endDate,
      location: proj.location,
      budget: String(proj.budget),
      leadBy: proj.leadBy,
      beneficiaries: String(proj.beneficiaries),
      fundSource: proj.fundSource,
      purpose: proj.purpose || "",
      targetParticipants: proj.targetParticipants || "",
      materialsNeeded: proj.materialsNeeded || "",
      expectedOutcome: proj.expectedOutcome || "",
    });
    setEditingId(proj.id);
    setShowForm(true);
    setSelected(null);
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setSelected(null);
    toast({ title: "Project Deleted", description: "The project has been removed." });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProjects(prev => prev.map(p => p.id === editingId ? {
        ...p,
        title: form.title,
        description: form.description,
        category: form.category,
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location,
        budget: parseFloat(form.budget) || 0,
        leadBy: form.leadBy,
        beneficiaries: parseInt(form.beneficiaries) || 0,
        fundSource: form.fundSource,
        purpose: form.purpose,
        targetParticipants: form.targetParticipants,
        materialsNeeded: form.materialsNeeded,
        expectedOutcome: form.expectedOutcome,
      } : p));
      toast({ title: "Project Updated", description: `"${form.title}" has been updated.` });
    } else {
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
        purpose: form.purpose,
        targetParticipants: form.targetParticipants,
        materialsNeeded: form.materialsNeeded,
        expectedOutcome: form.expectedOutcome,
      };
      setProjects(prev => [newProj, ...prev]);
      toast({ title: "Project Added", description: `"${form.title}" has been recorded.` });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="flex-1 flex flex-col">
      {printProj && <ProgramDocument proj={printProj} onClose={() => setPrintProj(null)} />}

      <PortalHeader
        title="Projects & Programs"
        description={`${projects.filter(p => p.status === "ongoing").length} ongoing`}
        onMenuClick={toggle}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} className="gap-1.5">
              <List className="w-4 h-4" /><span className="hidden sm:inline">List</span>
            </Button>
            <Button size="sm" variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")} className="gap-1.5">
              <CalendarDays className="w-4 h-4" /><span className="hidden sm:inline">Calendar</span>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={openCreate}>
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Project</span>
            </Button>
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Calendar View */}
        {view === "calendar" && (
          <div className="grid lg:grid-cols-[300px_1fr] gap-4">
            <MiniCalendar
              markedDates={markedDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              getDateCount={getDateCount}
            />
            <div className="space-y-3">
              {selectedDate ? (
                <>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedDate).toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    {" — "}<span className="text-muted-foreground">{calendarProjects.length} project(s) active</span>
                  </p>
                  {calendarProjects.length === 0 ? (
                    <Card className="p-8 text-center">
                      <FolderKanban className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No projects active on this date</p>
                    </Card>
                  ) : (
                    calendarProjects.map(proj => (
                      <Card key={proj.id} className="p-4 border-border/50 hover:border-primary/30 cursor-pointer transition-all" onClick={() => setSelected(proj)}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-xs text-primary border border-primary/20 px-1.5 py-0.5 rounded-full">{proj.category}</span>
                            <p className="text-sm font-semibold text-foreground mt-1">{proj.title}</p>
                            <p className="text-xs text-muted-foreground">{proj.location} · {proj.leadBy}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${statusStyles[proj.status]}`}>{proj.status}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a date to see projects active on that day</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <>
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

            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map(proj => (
                <Card
                  key={proj.id}
                  className="p-5 border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelected(proj)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs border border-primary/20 text-primary px-1.5 py-0.5 rounded-full">{proj.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[proj.status]}`}>{proj.status}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{proj.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{proj.description}</p>
                  <div className="pt-3 border-t border-border/50 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>₱{proj.budget.toLocaleString()}</span>
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
          </>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs border border-primary/20 text-primary px-1.5 py-0.5 rounded-full mb-1 inline-block">{selected.category}</span>
                  <h2 className="text-xl font-bold text-foreground">{selected.title}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <Button size="sm" variant="outline" className="gap-1.5 h-8" onClick={() => setPrintProj(selected)}>
                    <Printer className="w-3.5 h-3.5" /><span className="text-xs">Programme</span>
                  </Button>
                  <button onClick={() => openEdit(selected)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusStyles[selected.status]}`}>{selected.status}</span>
                <div className="flex gap-1">
                  {(["planning", "ongoing", "completed"] as ProjectStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setProjects(prev => prev.map(p => p.id === selected.id ? { ...p, status: s } : p))}
                      className={`text-xs px-2 py-0.5 rounded-full border transition ${selected.status === s ? "opacity-50 cursor-default" : "hover:bg-muted"}`}
                    >
                      → {s}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{selected.description}</p>

              {selected.purpose && (
                <div className="mb-4 p-3 bg-muted/40 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Purpose</p>
                  <p className="text-sm text-foreground">{selected.purpose}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Location", value: selected.location, icon: <MapPin className="w-4 h-4 text-primary" /> },
                  { label: "Lead By", value: selected.leadBy, icon: <Users className="w-4 h-4 text-primary" /> },
                  { label: "Budget", value: `₱${selected.budget.toLocaleString()}`, icon: <DollarSign className="w-4 h-4 text-primary" /> },
                  { label: "Beneficiaries", value: `${selected.beneficiaries} residents`, icon: <Users className="w-4 h-4 text-primary" /> },
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
                  <div className="space-y-2 mb-4">
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

              <div className="p-3 bg-muted/50 rounded-lg">
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

        {/* Add/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">{editingId ? "Edit Project" : "Add New Project"}</h2>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div><Label>Project/Program Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="mt-1" required /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Health & Nutrition", "Infrastructure", "Livelihood", "Sports & Recreation", "Education", "Environment", "Others"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><Label>Venue / Location</Label><Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div><Label>Purpose</Label><Textarea value={form.purpose} onChange={e => setForm(p => ({ ...p, purpose: e.target.value }))} className="mt-1 min-h-[60px]" placeholder="Why this program is conducted..." /></div>
                <div><Label>Target Participants</Label><Input value={form.targetParticipants} onChange={e => setForm(p => ({ ...p, targetParticipants: e.target.value }))} className="mt-1" placeholder="e.g., Youth, Residents, Senior Citizens" /></div>
                <div><Label>Materials Needed</Label><Textarea value={form.materialsNeeded} onChange={e => setForm(p => ({ ...p, materialsNeeded: e.target.value }))} className="mt-1 min-h-[60px]" placeholder="One item per line..." /></div>
                <div><Label>Expected Outcome</Label><Textarea value={form.expectedOutcome} onChange={e => setForm(p => ({ ...p, expectedOutcome: e.target.value }))} className="mt-1 min-h-[60px]" placeholder="What you want to achieve..." /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Budget (₱)</Label><Input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>Beneficiaries</Label><Input type="number" value={form.beneficiaries} onChange={e => setForm(p => ({ ...p, beneficiaries: e.target.value }))} className="mt-1" /></div>
                </div>
                <div><Label>Lead By</Label><Input value={form.leadBy} onChange={e => setForm(p => ({ ...p, leadBy: e.target.value }))} className="mt-1" required /></div>
                <div><Label>Fund Source</Label><Input value={form.fundSource} onChange={e => setForm(p => ({ ...p, fundSource: e.target.value }))} placeholder="e.g., Barangay Development Fund" className="mt-1" /></div>
                <div><Label>Brief Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="mt-1" required /></div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">{editingId ? "Save Changes" : "Add Project"}</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
