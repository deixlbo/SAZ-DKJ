import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { MiniCalendar } from "@/components/portal/mini-calendar";
import { useAuth } from "@/lib/auth-context";
import { mockAnnouncements } from "@/lib/mock-data";
import {
  Megaphone, Plus, X, Trash2, AlertTriangle, CalendarDays, List,
  Pencil, Check, FolderKanban, Printer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Priority = "high" | "medium" | "low";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: Priority;
  date: string;
  author: string;
}

interface ProgrammeActivity {
  time: string;
  activity: string;
  personAssigned: string;
}

interface Programme {
  id: string;
  title: string;
  date: string;
  venue: string;
  purpose: string;
  targetParticipants: string;
  activities: ProgrammeActivity[];
  materialsNeeded: string;
  budget: string;
  expectedOutcome: string;
  preparedBy: string;
}

const priorityBadge: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const emptyForm = { title: "", content: "", category: "Event", priority: "medium" as Priority };

const emptyActivity: ProgrammeActivity = { time: "", activity: "", personAssigned: "" };

const emptyProgramme: Omit<Programme, "id"> = {
  title: "",
  date: "",
  venue: "",
  purpose: "",
  targetParticipants: "",
  activities: [
    { time: "", activity: "Opening Program / Prayer", personAssigned: "" },
    { time: "", activity: "Welcome Remarks", personAssigned: "" },
    { time: "", activity: "Main Activity", personAssigned: "" },
    { time: "", activity: "Closing Remarks", personAssigned: "" },
  ],
  materialsNeeded: "",
  budget: "",
  expectedOutcome: "",
  preparedBy: "",
};

function ProgrammePrint({ prog, onClose }: { prog: Programme; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl shadow-2xl my-4 bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b print:hidden">
          <h2 className="font-bold">Programme Document</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()} className="gap-1.5">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-8 sm:p-12 bg-white" id="print-area">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">BARANGAY PROGRAMME</h1>
            <div className="border-b-2 border-gray-800 mt-3 mb-6" />
          </div>

          <div className="space-y-2 mb-6 text-sm">
            <div className="flex gap-4">
              <span className="font-semibold w-36 shrink-0">Program Title:</span>
              <span className="border-b border-gray-400 flex-1 pb-0.5">{prog.title || "___________________________"}</span>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold w-36 shrink-0">Date:</span>
              <span className="border-b border-gray-400 flex-1 pb-0.5">
                {prog.date ? new Date(prog.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) : "___________________________"}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="font-semibold w-36 shrink-0">Venue:</span>
              <span className="border-b border-gray-400 flex-1 pb-0.5">{prog.venue || "___________________________"}</span>
            </div>
          </div>

          <hr className="border-gray-300 my-6" />

          <section className="mb-6">
            <h2 className="font-bold text-base mb-2">1. Purpose</h2>
            <p className="text-sm text-gray-700 min-h-[60px] border border-gray-200 rounded p-2">{prog.purpose || "(Why this program is conducted)"}</p>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-base mb-2">2. Target Participants</h2>
            <p className="text-sm text-gray-700 min-h-[40px] border border-gray-200 rounded p-2">{prog.targetParticipants || "(e.g., Youth, Residents, Senior Citizens)"}</p>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-base mb-3">3. Program Flow / Activities</h2>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left w-24">Time</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Activity</th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-44">Person Assigned</th>
                </tr>
              </thead>
              <tbody>
                {prog.activities.map((a, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-3 py-2">{a.time || "—"}</td>
                    <td className="border border-gray-300 px-3 py-2">{a.activity || "—"}</td>
                    <td className="border border-gray-300 px-3 py-2">{a.personAssigned || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-base mb-2">4. Materials Needed</h2>
            <div className="text-sm text-gray-700 min-h-[40px] border border-gray-200 rounded p-2">
              {prog.materialsNeeded
                ? prog.materialsNeeded.split("\n").map((m, i) => <p key={i}>• {m}</p>)
                : <><p>•</p><p>•</p></>}
            </div>
          </section>

          <section className="mb-6">
            <h2 className="font-bold text-base mb-2">5. Budget (Optional)</h2>
            <p className="text-sm text-gray-700">₱ {prog.budget || "___________________________"}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-bold text-base mb-2">6. Expected Outcome</h2>
            <p className="text-sm text-gray-700 min-h-[60px] border border-gray-200 rounded p-2">{prog.expectedOutcome || "(What you want to achieve)"}</p>
          </section>

          <div className="grid grid-cols-2 gap-8 mt-10">
            <div>
              <p className="text-sm font-semibold mb-6">Prepared by:</p>
              <div className="border-b border-gray-500" />
              <p className="text-xs text-gray-500 mt-1">{prog.preparedBy || "Signature over printed name"}</p>
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

export default function OfficialAnnouncementsPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements as Announcement[]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar" | "programme">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Programme state
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [showProgForm, setShowProgForm] = useState(false);
  const [progForm, setProgForm] = useState<Omit<Programme, "id">>({ ...emptyProgramme });
  const [printProg, setPrintProg] = useState<Programme | null>(null);
  const [editProgId, setEditProgId] = useState<string | null>(null);

  const markedDates = announcements.map(a => a.date);
  const getDateCount = (date: string) => announcements.filter(a => a.date === date).length;

  const displayed = selectedDate && view === "list"
    ? announcements.filter(a => a.date === selectedDate)
    : announcements;

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (ann: Announcement) => {
    setForm({ title: ann.title, content: ann.content, category: ann.category, priority: ann.priority });
    setEditingId(ann.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAnnouncements(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a));
      toast({ title: "Announcement Updated", description: "Changes saved successfully." });
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title: form.title,
        content: form.content,
        category: form.category,
        priority: form.priority,
        date: new Date().toISOString().split("T")[0],
        author: userData?.fullName ?? "Barangay Official",
      };
      setAnnouncements(prev => [newAnn, ...prev]);
      toast({ title: "Announcement Posted", description: "Your announcement has been published." });
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast({ title: "Deleted", description: "Announcement removed." });
  };

  // Programme helpers
  const updateActivity = (i: number, field: keyof ProgrammeActivity, value: string) => {
    setProgForm(p => {
      const acts = [...p.activities];
      acts[i] = { ...acts[i], [field]: value };
      return { ...p, activities: acts };
    });
  };

  const addActivity = () => {
    setProgForm(p => ({ ...p, activities: [...p.activities, { ...emptyActivity }] }));
  };

  const removeActivity = (i: number) => {
    setProgForm(p => ({ ...p, activities: p.activities.filter((_, idx) => idx !== i) }));
  };

  const handleProgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editProgId) {
      setProgrammes(prev => prev.map(pg => pg.id === editProgId ? { id: editProgId, ...progForm } : pg));
      toast({ title: "Programme Updated" });
    } else {
      const newProg: Programme = { id: `prog-${Date.now()}`, ...progForm };
      setProgrammes(prev => [newProg, ...prev]);
      toast({ title: "Programme Saved", description: "You can now print the document." });
    }
    setShowProgForm(false);
    setEditProgId(null);
    setProgForm({ ...emptyProgramme });
  };

  const openEditProg = (pg: Programme) => {
    setProgForm({
      title: pg.title, date: pg.date, venue: pg.venue, purpose: pg.purpose,
      targetParticipants: pg.targetParticipants, activities: pg.activities,
      materialsNeeded: pg.materialsNeeded, budget: pg.budget,
      expectedOutcome: pg.expectedOutcome, preparedBy: pg.preparedBy,
    });
    setEditProgId(pg.id);
    setShowProgForm(true);
  };

  return (
    <div className="flex-1 flex flex-col">
      {printProg && <ProgrammePrint prog={printProg} onClose={() => setPrintProg(null)} />}

      <PortalHeader
        title="Announcements"
        description={`${announcements.length} announcements published`}
        onMenuClick={toggle}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} className="gap-1.5">
              <List className="w-4 h-4" /><span className="hidden sm:inline">List</span>
            </Button>
            <Button size="sm" variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")} className="gap-1.5">
              <CalendarDays className="w-4 h-4" /><span className="hidden sm:inline">Calendar</span>
            </Button>
            <Button size="sm" variant={view === "programme" ? "default" : "outline"} onClick={() => setView("programme")} className="gap-1.5">
              <FolderKanban className="w-4 h-4" /><span className="hidden sm:inline">Programme</span>
            </Button>
            {view !== "programme" && (
              <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={openCreate}>
                <Plus className="w-4 h-4" /><span className="hidden sm:inline">Post</span>
              </Button>
            )}
            {view === "programme" && (
              <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={() => { setProgForm({ ...emptyProgramme }); setEditProgId(null); setShowProgForm(true); }}>
                <Plus className="w-4 h-4" /><span className="hidden sm:inline">New Programme</span>
              </Button>
            )}
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Announcement Create/Edit Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">{editingId ? "Edit Announcement" : "Post Announcement"}</h2>
                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Announcement title" className="mt-1" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {["Event", "Meeting", "Maintenance", "Warning", "General"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      <option value="high">High (Urgent)</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Write your announcement content..." className="mt-1 min-h-[150px]" required />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    {editingId ? <><Check className="w-4 h-4 mr-1" /> Save Changes</> : "Post Announcement"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Programme Form Modal */}
        {showProgForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">{editProgId ? "Edit Programme" : "Create Programme Document"}</h2>
                <button onClick={() => { setShowProgForm(false); setEditProgId(null); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleProgSubmit} className="space-y-4">
                <div><Label>Programme Title</Label><Input value={progForm.title} onChange={e => setProgForm(p => ({ ...p, title: e.target.value }))} className="mt-1" required /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Date</Label><Input type="date" value={progForm.date} onChange={e => setProgForm(p => ({ ...p, date: e.target.value }))} className="mt-1" /></div>
                  <div><Label>Venue</Label><Input value={progForm.venue} onChange={e => setProgForm(p => ({ ...p, venue: e.target.value }))} placeholder="e.g., Barangay Hall" className="mt-1" /></div>
                </div>
                <div><Label>Purpose</Label><Textarea value={progForm.purpose} onChange={e => setProgForm(p => ({ ...p, purpose: e.target.value }))} className="mt-1 min-h-[60px]" placeholder="Why this program is conducted..." /></div>
                <div><Label>Target Participants</Label><Input value={progForm.targetParticipants} onChange={e => setProgForm(p => ({ ...p, targetParticipants: e.target.value }))} placeholder="e.g., Youth, Residents, Senior Citizens" className="mt-1" /></div>

                {/* Activities Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Program Flow / Activities</Label>
                    <button type="button" onClick={addActivity} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium">
                      <Plus className="w-3.5 h-3.5" /> Add Row
                    </button>
                  </div>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[80px_1fr_130px_32px] bg-muted/50 text-xs font-medium px-2 py-2 gap-2 border-b border-border">
                      <span>Time</span><span>Activity</span><span>Person Assigned</span><span></span>
                    </div>
                    {progForm.activities.map((act, i) => (
                      <div key={i} className="grid grid-cols-[80px_1fr_130px_32px] gap-2 px-2 py-1.5 border-b border-border/50 last:border-0">
                        <input value={act.time} onChange={e => updateActivity(i, "time", e.target.value)} placeholder="8:00 AM" className="text-xs border border-border rounded px-1.5 py-1 bg-background w-full" />
                        <input value={act.activity} onChange={e => updateActivity(i, "activity", e.target.value)} placeholder="Activity..." className="text-xs border border-border rounded px-1.5 py-1 bg-background w-full" />
                        <input value={act.personAssigned} onChange={e => updateActivity(i, "personAssigned", e.target.value)} placeholder="Name..." className="text-xs border border-border rounded px-1.5 py-1 bg-background w-full" />
                        <button type="button" onClick={() => removeActivity(i)} className="text-muted-foreground hover:text-destructive transition">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div><Label>Materials Needed</Label><Textarea value={progForm.materialsNeeded} onChange={e => setProgForm(p => ({ ...p, materialsNeeded: e.target.value }))} className="mt-1 min-h-[60px]" placeholder="One item per line..." /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Budget (₱ optional)</Label><Input value={progForm.budget} onChange={e => setProgForm(p => ({ ...p, budget: e.target.value }))} placeholder="e.g., 5,000" className="mt-1" /></div>
                  <div><Label>Prepared By</Label><Input value={progForm.preparedBy} onChange={e => setProgForm(p => ({ ...p, preparedBy: e.target.value }))} placeholder="Your name and position" className="mt-1" /></div>
                </div>
                <div><Label>Expected Outcome</Label><Textarea value={progForm.expectedOutcome} onChange={e => setProgForm(p => ({ ...p, expectedOutcome: e.target.value }))} className="mt-1 min-h-[60px]" placeholder="What you want to achieve..." /></div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => { setShowProgForm(false); setEditProgId(null); }} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">Save Programme</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

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
                    {" — "}<span className="text-muted-foreground">{announcements.filter(a => a.date === selectedDate).length} announcement(s)</span>
                  </p>
                  {announcements.filter(a => a.date === selectedDate).length === 0 ? (
                    <Card className="p-8 text-center">
                      <Megaphone className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No announcements on this date</p>
                    </Card>
                  ) : (
                    announcements.filter(a => a.date === selectedDate).map(ann => (
                      <Card key={ann.id} className="p-4 border-border/50">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge[ann.priority]}`}>{ann.priority}</span>
                              <span className="text-xs text-muted-foreground">{ann.category}</span>
                            </div>
                            <h3 className="font-semibold text-foreground">{ann.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => openEdit(ann)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(ann.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a highlighted date to see announcements</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Programme View */}
        {view === "programme" && (
          <div className="space-y-3">
            {programmes.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <FolderKanban className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-medium text-foreground mb-1">No programmes yet</p>
                <p className="text-sm text-muted-foreground mb-4">Create a programme document to generate a printable BARANGAY PROGRAMME sheet.</p>
                <Button size="sm" onClick={() => { setProgForm({ ...emptyProgramme }); setEditProgId(null); setShowProgForm(true); }} className="gap-1.5">
                  <Plus className="w-4 h-4" /> New Programme
                </Button>
              </Card>
            ) : (
              programmes.map(pg => (
                <Card key={pg.id} className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{pg.title}</h3>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                        {pg.date && <span>{new Date(pg.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</span>}
                        {pg.venue && <span>{pg.venue}</span>}
                        {pg.targetParticipants && <span>{pg.targetParticipants}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEditProg(pg)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setPrintProg(pg)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition" title="Print Programme">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button onClick={() => setProgrammes(prev => prev.filter(p => p.id !== pg.id))} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="space-y-3">
            {displayed.map(ann => (
              <Card key={ann.id} className="p-5 border-border/50 hover:border-primary/30 transition">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${ann.priority === "high" ? "bg-red-100" : ann.priority === "medium" ? "bg-amber-100" : "bg-green-100"}`}>
                    {ann.priority === "high"
                      ? <AlertTriangle className="w-5 h-5 text-red-600" />
                      : <Megaphone className={`w-5 h-5 ${ann.priority === "medium" ? "text-amber-600" : "text-green-600"}`} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs border border-primary/20 text-primary px-1.5 py-0.5 rounded-full">{ann.category}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${priorityBadge[ann.priority]}`}>{ann.priority}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ann.content}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{ann.author} · {new Date(ann.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(ann)} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
