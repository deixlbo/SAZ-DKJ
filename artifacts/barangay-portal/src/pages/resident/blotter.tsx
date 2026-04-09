import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { mockBlotterCases } from "@/lib/mock-data";
import { ClipboardList, Plus, X, MapPin, Clock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type BlotterStatus = "reported" | "investigating" | "mediation" | "resolved" | "escalated";

interface BlotterCase {
  id: string;
  incidentType: string;
  location: string;
  reportedBy: string;
  reportedById: string;
  status: BlotterStatus;
  date: string;
  time: string;
  description: string;
  narrative: string;
  respondent?: string;
  assignedTo?: string;
}

const incidentTypes = [
  "Noise Complaint",
  "Property Dispute",
  "Physical Altercation",
  "Verbal Abuse",
  "Theft/Burglary",
  "Vandalism",
  "Domestic Issue",
  "Trespassing",
  "Illegal Parking",
  "Others",
];

export default function ResidentBlotterPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();

  const initial = mockBlotterCases.filter(b => b.reportedById === userData?.uid) as BlotterCase[];
  const [cases, setCases] = useState<BlotterCase[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    incidentType: incidentTypes[0],
    location: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    description: "",
    narrative: "",
    respondent: "",
  });

  const statusStyles: Record<BlotterStatus, string> = {
    reported: "bg-gray-100 text-gray-700 border-gray-200",
    investigating: "bg-blue-100 text-blue-700 border-blue-200",
    mediation: "bg-amber-100 text-amber-700 border-amber-200",
    resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    escalated: "bg-red-100 text-red-700 border-red-200",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location.trim() || !form.description.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newCase: BlotterCase = {
      id: `BLT-00${32 + cases.length}`,
      incidentType: form.incidentType,
      location: form.location,
      reportedBy: userData?.fullName ?? "Resident",
      reportedById: userData?.uid ?? "",
      status: "reported",
      date: form.date,
      time: form.time,
      description: form.description,
      narrative: form.narrative,
      respondent: form.respondent || undefined,
    };
    setCases(prev => [newCase, ...prev]);
    setShowForm(false);
    setForm({ incidentType: incidentTypes[0], location: "", date: new Date().toISOString().split("T")[0], time: "", description: "", narrative: "", respondent: "" });
    setLoading(false);
    toast({ title: "Blotter Filed", description: `Case ${newCase.id} has been filed and will be reviewed by barangay officials.` });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Blotter Report"
        description="File and track incident reports"
        onMenuClick={toggle}
        actions={
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            onClick={() => setShowForm(true)}
            data-testid="button-file-blotter"
          >
            <Plus className="w-4 h-4" /> File Report
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" data-testid="modal-blotter">
            <Card className="w-full max-w-2xl p-6 shadow-2xl my-4 animate-fadeUp">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-foreground">File Blotter Report</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Incident Type</Label>
                    <select
                      value={form.incidentType}
                      onChange={e => setForm(p => ({ ...p, incidentType: e.target.value }))}
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      data-testid="select-incident-type"
                    >
                      {incidentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Location of Incident</Label>
                    <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g., Purok 1, near sari-sari store" className="mt-1" required data-testid="input-location" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="mt-1" required />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="mt-1" required />
                  </div>
                </div>
                <div>
                  <Label>Respondent (Optional)</Label>
                  <Input value={form.respondent} onChange={e => setForm(p => ({ ...p, respondent: e.target.value }))} placeholder="Name of person involved" className="mt-1" data-testid="input-respondent" />
                </div>
                <div>
                  <Label>Brief Description</Label>
                  <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description of the incident" className="mt-1" required data-testid="input-description" />
                </div>
                <div>
                  <Label>Narrative (Detailed Account)</Label>
                  <Textarea value={form.narrative} onChange={e => setForm(p => ({ ...p, narrative: e.target.value }))} placeholder="Describe in detail what happened, who was involved, and any witnesses..." className="mt-1 min-h-[100px]" data-testid="input-narrative" />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Filing false blotter reports is a punishable offense. Ensure all information is accurate and truthful.</span>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-blotter">
                    {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Filing...</span> : "Submit Blotter"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* My Cases */}
        <h2 className="font-semibold text-foreground">My Blotter Reports ({cases.length})</h2>
        {cases.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-border/60">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No blotter reports filed</p>
            <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4" /> File a Report
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {cases.map(c => (
              <Card key={c.id} className="p-5 border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                    <h3 className="font-semibold text-foreground mt-0.5">{c.incidentType}</h3>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(c.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })} {c.time}</span>
                  {c.assignedTo && (
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />Assigned to: {c.assignedTo}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
