import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { MiniCalendar } from "@/components/portal/mini-calendar";
import { mockBlotterCases } from "@/lib/mock-data";
import {
  ClipboardList, Search, Plus, X, MapPin, Clock, User, Sparkles, Eye,
  CalendarDays, List, CheckCircle2, XCircle, AlertCircle, Ban
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BlotterStatus = "reported" | "investigating" | "mediation" | "resolved" | "escalated" | "closed" | "cancelled";

interface BlotterCase {
  id: string;
  incidentType: string;
  location: string;
  reportedBy: string;
  reportedById: string;
  respondent?: string;
  status: BlotterStatus;
  date: string;
  time: string;
  description: string;
  narrative: string;
  witnesses?: string[];
  assignedTo?: string;
  resolution?: string;
  cancellationReason?: string;
}

const incidentTypes = [
  "Noise Complaint", "Property Dispute", "Physical Altercation", "Verbal Abuse",
  "Theft/Burglary", "Vandalism", "Domestic Issue", "Trespassing", "Illegal Parking", "Others"
];

const statusColors: Record<BlotterStatus, string> = {
  reported: "bg-gray-100 text-gray-700 border-gray-200",
  investigating: "bg-blue-100 text-blue-700 border-blue-200",
  mediation: "bg-amber-100 text-amber-700 border-amber-200",
  resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
  escalated: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-pink-100 text-pink-700 border-pink-200",
};

const CANCELLATION_REASONS = [
  "Issue resolved",
  "Filed by mistake",
  "Duplicate report",
  "Personal reason",
  "Other",
];

export default function OfficialBlotterPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [cases, setCases] = useState<BlotterCase[]>(mockBlotterCases as BlotterCase[]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | BlotterStatus>("all");
  const [selected, setSelected] = useState<BlotterCase | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState(CANCELLATION_REASONS[0]);
  const [cancelNote, setCancelNote] = useState("");

  const markedDates = cases.map(c => c.date);
  const getDateCount = (date: string) => cases.filter(c => c.date === date).length;

  const filtered = cases.filter(c => {
    const matchSearch = c.id.toLowerCase().includes(search.toLowerCase())
      || c.incidentType.toLowerCase().includes(search.toLowerCase())
      || c.reportedBy.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    const matchDate = !selectedDate || c.date === selectedDate;
    return matchSearch && matchFilter && matchDate;
  });

  const updateStatus = (id: string, status: BlotterStatus, extra?: Partial<BlotterCase>) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status, ...extra } : c));
    setSelected(prev => prev ? { ...prev, status, ...extra } : null);
    toast({ title: "Status Updated", description: `Case updated to: ${status}` });
  };

  const handleAiClassify = async (c: BlotterCase) => {
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setAiLoading(false);
    const sev = ["Theft/Burglary", "Domestic Issue", "Physical Altercation"].includes(c.incidentType) ? "HIGH"
      : c.incidentType === "Property Dispute" ? "MEDIUM" : "LOW";
    toast({
      title: "AI Severity Classification",
      description: `Case ${c.id} (${c.incidentType}): ${sev} severity. ${sev === "HIGH" ? "Recommend immediate action and possible escalation to PNP." : sev === "MEDIUM" ? "Recommend formal mediation within 5 days." : "Recommend barangay-level mediation."}`,
    });
  };

  const handleCancelApprove = () => {
    if (!selected) return;
    const reason = cancelReason === "Other" ? cancelNote : cancelReason;
    updateStatus(selected.id, "cancelled", { cancellationReason: reason });
    setShowCancelForm(false);
    setCancelNote("");
    setCancelReason(CANCELLATION_REASONS[0]);
    setSelected(null);
    toast({ title: "Cancellation Approved", description: "Case has been marked as cancelled." });
  };

  const [form, setForm] = useState({
    incidentType: incidentTypes[0],
    location: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    reportedBy: "",
    respondent: "",
    description: "",
    narrative: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = `BLT-00${33 + cases.length}`;
    setCases(prev => [{
      id: nextId,
      incidentType: form.incidentType,
      location: form.location,
      reportedBy: form.reportedBy,
      reportedById: "official-entry",
      respondent: form.respondent || undefined,
      status: "reported",
      date: form.date,
      time: form.time,
      description: form.description,
      narrative: form.narrative,
      witnesses: [],
    }, ...prev]);
    setShowForm(false);
    toast({ title: "Blotter Filed", description: `Case ${nextId} has been recorded.` });
  };

  const calendarCases = selectedDate ? cases.filter(c => c.date === selectedDate) : [];

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Blotter Cases"
        description={`${cases.filter(c => !["resolved", "closed", "cancelled"].includes(c.status)).length} active cases`}
        onMenuClick={toggle}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} className="gap-1.5">
              <List className="w-4 h-4" /><span className="hidden sm:inline">List</span>
            </Button>
            <Button size="sm" variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")} className="gap-1.5">
              <CalendarDays className="w-4 h-4" /><span className="hidden sm:inline">Calendar</span>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">New Case</span>
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
                    {" — "}<span className="text-muted-foreground">{calendarCases.length} case(s)</span>
                  </p>
                  {calendarCases.length === 0 ? (
                    <Card className="p-8 text-center">
                      <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No cases on this date</p>
                    </Card>
                  ) : (
                    calendarCases.map(c => (
                      <Card key={c.id} className="p-4 border-border/50 hover:border-primary/30 cursor-pointer transition-all" onClick={() => setSelected(c)}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                            <p className="text-sm font-semibold text-foreground">{c.incidentType}</p>
                            <p className="text-xs text-muted-foreground">{c.reportedBy} · {c.location}</p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[c.status]}`}>{c.status}</span>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a highlighted date to see cases</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search cases..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(["all", "reported", "investigating", "mediation", "resolved", "escalated", "closed", "cancelled"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs px-2.5 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No cases found</p>
                </div>
              ) : (
                filtered.map(c => (
                  <Card
                    key={c.id}
                    className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => setSelected(c)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <ClipboardList className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                            <span className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{c.incidentType}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{c.reportedBy}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                          </div>
                          {c.cancellationReason && (
                            <p className="text-xs text-pink-600 mt-1">Cancel reason: {c.cancellationReason}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${statusColors[c.status]}`}>{c.status}</span>
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}

        {/* Case Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono text-muted-foreground">{selected.id}</span>
                  <h2 className="text-lg font-bold text-foreground">{selected.incidentType}</h2>
                </div>
                <button onClick={() => { setSelected(null); setShowCancelForm(false); }} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Reported By", value: selected.reportedBy },
                  { label: "Respondent", value: selected.respondent || "Unknown" },
                  { label: "Location", value: selected.location },
                  { label: "Date/Time", value: `${new Date(selected.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })} ${selected.time}` },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4 p-4 bg-muted/40 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground">{selected.description}</p>
                {selected.narrative && (
                  <>
                    <p className="text-xs font-medium text-muted-foreground mt-3 mb-1">Narrative</p>
                    <p className="text-sm text-foreground leading-relaxed">{selected.narrative}</p>
                  </>
                )}
              </div>

              {selected.cancellationReason && (
                <div className="mb-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-xs font-medium text-pink-800 mb-0.5">Cancellation Request Reason</p>
                  <p className="text-sm text-pink-700">{selected.cancellationReason}</p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-foreground">Current Status:</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[selected.status]}`}>{selected.status}</span>
              </div>

              {/* Cancellation form */}
              {showCancelForm && (
                <div className="mb-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                  <p className="text-xs font-semibold text-pink-800 mb-2">Process Cancellation Request</p>
                  <div className="mb-2">
                    <Label className="text-xs">Cancellation Reason</Label>
                    <select value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none">
                      {CANCELLATION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  {cancelReason === "Other" && (
                    <Textarea value={cancelNote} onChange={e => setCancelNote(e.target.value)} placeholder="Specify reason..." className="mb-2 min-h-[60px] text-sm" />
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowCancelForm(false)} className="flex-1">Cancel</Button>
                    <Button size="sm" onClick={handleCancelApprove} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white gap-1">
                      <Ban className="w-3.5 h-3.5" /> Approve Cancellation
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                <Button size="sm" variant="outline" onClick={() => handleAiClassify(selected)} disabled={aiLoading} className="gap-1.5 border-purple-300 text-purple-700 hover:bg-purple-50">
                  <Sparkles className="w-3.5 h-3.5" /> {aiLoading ? "Analyzing..." : "AI Classify"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "investigating")} className="gap-1 border-blue-300 text-blue-700">
                  <AlertCircle className="w-3.5 h-3.5" /> Investigate
                </Button>
                <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "mediation")} className="gap-1 border-amber-300 text-amber-700">
                  <User className="w-3.5 h-3.5" /> Mediation
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "resolved")} className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "escalated")} variant="destructive" className="gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Escalate
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "closed")} variant="outline" className="gap-1 border-slate-300 text-slate-700">
                  <XCircle className="w-3.5 h-3.5" /> Close Case
                </Button>
                <Button size="sm" onClick={() => setShowCancelForm(true)} variant="outline" className="gap-1 border-pink-300 text-pink-700 hover:bg-pink-50">
                  <Ban className="w-3.5 h-3.5" /> Handle Cancellation
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Add Case Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground">Record New Blotter Case</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Incident Type</Label>
                    <select value={form.incidentType} onChange={e => setForm(p => ({ ...p, incidentType: e.target.value }))} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                      {incidentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Location of incident" className="mt-1" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Complainant / Reported By</Label>
                    <Input value={form.reportedBy} onChange={e => setForm(p => ({ ...p, reportedBy: e.target.value }))} placeholder="Full name" className="mt-1" required />
                  </div>
                  <div>
                    <Label>Respondent (Optional)</Label>
                    <Input value={form.respondent} onChange={e => setForm(p => ({ ...p, respondent: e.target.value }))} placeholder="Full name" className="mt-1" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="mt-1" required /></div>
                  <div><Label>Time</Label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="mt-1" required /></div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" className="mt-1" required />
                </div>
                <div>
                  <Label>Narrative</Label>
                  <Textarea value={form.narrative} onChange={e => setForm(p => ({ ...p, narrative: e.target.value }))} placeholder="Detailed account of events..." className="mt-1 min-h-[100px]" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">Submit</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
