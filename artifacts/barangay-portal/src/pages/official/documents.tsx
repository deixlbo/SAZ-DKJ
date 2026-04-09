import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { MiniCalendar } from "@/components/portal/mini-calendar";
import { mockDocumentRequests } from "@/lib/mock-data";
import {
  FileText, Search, CheckCircle2, XCircle, Clock, AlertCircle, Eye,
  Sparkles, Printer, CalendarDays, List, FileQuestion, Settings, Plus, Trash2, Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DocStatus = "approved" | "pending" | "processing" | "rejected" | "needs-docs";

interface DocRequest {
  id: string;
  residentId: string;
  residentName: string;
  documentType: string;
  purpose: string;
  status: DocStatus;
  date: string;
  address: string;
  notes: string;
}

interface DocType {
  name: string;
  requirements: string[];
}

const defaultDocTypes: DocType[] = [
  { name: "Barangay Clearance", requirements: ["Valid ID", "Recent photo (2x2)", "Proof of residency"] },
  { name: "Certificate of Indigency", requirements: ["Valid ID", "Recent photo (2x2)", "Proof of residency"] },
  { name: "Certificate of Residency", requirements: ["Valid ID", "Utility bill or proof of address"] },
  { name: "Business Clearance", requirements: ["Valid ID", "Business permit application", "Lease contract or proof of ownership"] },
  { name: "Certificate of Good Moral Character", requirements: ["Valid ID", "Recent photo (2x2)", "Recommendation letter (optional)"] },
];

const statusStyles: Record<DocStatus, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  "needs-docs": "bg-purple-50 text-purple-700 border-purple-200",
};
const statusIcons: Record<DocStatus, React.ReactNode> = {
  approved: <CheckCircle2 className="w-3.5 h-3.5" />,
  pending: <Clock className="w-3.5 h-3.5" />,
  processing: <AlertCircle className="w-3.5 h-3.5" />,
  rejected: <XCircle className="w-3.5 h-3.5" />,
  "needs-docs": <FileQuestion className="w-3.5 h-3.5" />,
};

function PrintDocument({ doc, onClose }: { doc: DocRequest; onClose: () => void }) {
  const today = new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl p-8 shadow-2xl my-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="font-bold text-foreground">Document Preview</h2>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.print()} className="gap-1.5 bg-primary">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
        <div className="border border-border rounded-lg p-8 text-sm print:border-0" id="print-area">
          <div className="text-center mb-6">
            <p className="text-xs text-muted-foreground">Republic of the Philippines</p>
            <p className="text-xs text-muted-foreground">Province of Zambales · Municipality of San Antonio</p>
            <h1 className="font-bold text-lg mt-2">BARANGAY SANTIAGO SAZ</h1>
            <p className="text-xs text-muted-foreground">Office of the Punong Barangay</p>
            <div className="border-b-2 border-foreground mt-4 mb-4" />
            <h2 className="font-bold text-base uppercase tracking-wide">{doc.documentType}</h2>
          </div>
          <p className="text-muted-foreground text-xs mb-6">Date: <strong className="text-foreground">{today}</strong></p>
          <p className="leading-relaxed mb-4">
            <strong>TO WHOM IT MAY CONCERN:</strong>
          </p>
          <p className="leading-relaxed mb-4">
            This is to certify that <strong>{doc.residentName}</strong>, a bonafide resident of <strong>{doc.address}</strong>,
            is hereby granted this <strong>{doc.documentType}</strong> for the purpose of <strong>{doc.purpose}</strong>.
          </p>
          <p className="leading-relaxed mb-4">
            This certification is issued upon the request of the above-named person and is for whatever legal purpose it may serve.
          </p>
          <div className="mt-12 text-center">
            <div className="inline-block">
              <p className="font-bold">HON. ROLANDO C. BORJA</p>
              <p className="text-xs text-muted-foreground">Punong Barangay</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Doc Ref: {doc.id} · Issued: {today}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function OfficialDocumentsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocRequest[]>(mockDocumentRequests as DocRequest[]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | DocStatus>("all");
  const [selected, setSelected] = useState<DocRequest | null>(null);
  const [printDoc, setPrintDoc] = useState<DocRequest | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "calendar" | "settings">("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [needsDocsNote, setNeedsDocsNote] = useState("");
  const [showNeedsDocsForm, setShowNeedsDocsForm] = useState(false);
  const [docTypes, setDocTypes] = useState<DocType[]>(defaultDocTypes);
  const [editingDocType, setEditingDocType] = useState<DocType | null>(null);
  const [newDocTypeName, setNewDocTypeName] = useState("");
  const [newReq, setNewReq] = useState("");

  const markedDates = docs.map(d => d.date);
  const getDateCount = (date: string) => docs.filter(d => d.date === date).length;

  const filtered = docs.filter(d => {
    const matchSearch = d.residentName.toLowerCase().includes(search.toLowerCase())
      || d.documentType.toLowerCase().includes(search.toLowerCase())
      || d.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || d.status === filter;
    const matchDate = !selectedDate || d.date === selectedDate;
    return matchSearch && matchFilter && matchDate;
  });

  const updateStatus = (id: string, status: DocStatus, notes = "") => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status, notes } : d));
    setSelected(prev => prev?.id === id ? { ...prev, status, notes } : prev);
    const label = status === "needs-docs" ? "Needs More Documents" : status.charAt(0).toUpperCase() + status.slice(1);
    toast({ title: `Request ${label}`, description: `Resident has been notified via system.` });
  };

  const handleAiReview = async (doc: DocRequest) => {
    setAiLoading(doc.id);
    await new Promise(r => setTimeout(r, 1500));
    setAiLoading(null);
    toast({
      title: "AI Review Complete",
      description: `${doc.documentType} for ${doc.residentName} — Resident verified. All requirements met. Recommended: Approve.`,
    });
  };

  const handleNeedsMoreDocs = () => {
    if (!selected) return;
    updateStatus(selected.id, "needs-docs", needsDocsNote || "Please submit additional documents.");
    setShowNeedsDocsForm(false);
    setNeedsDocsNote("");
    setSelected(null);
  };

  const addRequirement = (dtName: string) => {
    if (!newReq.trim()) return;
    setDocTypes(prev => prev.map(dt => dt.name === dtName
      ? { ...dt, requirements: [...dt.requirements, newReq.trim()] }
      : dt));
    setNewReq("");
  };

  const removeRequirement = (dtName: string, req: string) => {
    setDocTypes(prev => prev.map(dt => dt.name === dtName
      ? { ...dt, requirements: dt.requirements.filter(r => r !== req) }
      : dt));
  };

  const addDocType = () => {
    if (!newDocTypeName.trim()) return;
    setDocTypes(prev => [...prev, { name: newDocTypeName.trim(), requirements: [] }]);
    setNewDocTypeName("");
  };

  const removeDocType = (name: string) => {
    setDocTypes(prev => prev.filter(dt => dt.name !== name));
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Document Requests"
        description={`${docs.filter(d => d.status === "pending").length} pending review`}
        onMenuClick={toggle}
        actions={
          <div className="flex gap-2">
            {(["list", "calendar", "settings"] as const).map(v => (
              <Button
                key={v}
                size="sm"
                variant={view === v ? "default" : "outline"}
                onClick={() => setView(v)}
                className="gap-1.5"
              >
                {v === "list" && <List className="w-4 h-4" />}
                {v === "calendar" && <CalendarDays className="w-4 h-4" />}
                {v === "settings" && <Settings className="w-4 h-4" />}
                <span className="hidden sm:inline capitalize">{v === "settings" ? "Doc Types" : v}</span>
              </Button>
            ))}
          </div>
        }
      />

      {printDoc && <PrintDocument doc={printDoc} onClose={() => setPrintDoc(null)} />}

      <div className="p-4 sm:p-6 space-y-4">
        {/* Settings: Editable Document Types */}
        {view === "settings" && (
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-foreground mb-4">Available Document Types & Requirements</h3>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="New document type name..."
                  value={newDocTypeName}
                  onChange={e => setNewDocTypeName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addDocType()}
                />
                <Button onClick={addDocType} size="sm" className="gap-1 shrink-0">
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>
              <div className="space-y-4">
                {docTypes.map(dt => (
                  <div key={dt.name} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">{dt.name}</h4>
                      <button
                        onClick={() => removeDocType(dt.name)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      {dt.requirements.map(req => (
                        <div key={req} className="flex items-center justify-between bg-muted/50 px-3 py-1.5 rounded-md">
                          <span className="text-sm text-foreground">{req}</span>
                          <button
                            onClick={() => removeRequirement(dt.name, req)}
                            className="text-muted-foreground hover:text-destructive ml-2"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add requirement..."
                        className="text-sm h-8"
                        onKeyDown={e => {
                          if (e.key === "Enter") { addRequirement(dt.name); }
                        }}
                        onChange={e => {
                          if (editingDocType?.name === dt.name) setNewReq(e.target.value);
                          else { setEditingDocType(dt); setNewReq(e.target.value); }
                        }}
                        value={editingDocType?.name === dt.name ? newReq : ""}
                        onFocus={() => setEditingDocType(dt)}
                      />
                      <Button size="sm" variant="outline" className="h-8 shrink-0"
                        onClick={() => { if (editingDocType?.name === dt.name) addRequirement(dt.name); }}>
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
                    {" — "}<span className="text-muted-foreground">{docs.filter(d => d.date === selectedDate).length} request(s)</span>
                  </p>
                  {docs.filter(d => d.date === selectedDate).length === 0 ? (
                    <Card className="p-8 text-center">
                      <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">No document requests on this date</p>
                    </Card>
                  ) : (
                    docs.filter(d => d.date === selectedDate).map(doc => (
                      <Card
                        key={doc.id}
                        className="p-4 border-border/50 hover:border-primary/30 cursor-pointer transition-all"
                        onClick={() => setSelected(doc)}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{doc.documentType}</p>
                            <p className="text-xs text-muted-foreground">{doc.residentName} · {doc.purpose}</p>
                          </div>
                          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>
                            {statusIcons[doc.status]} {doc.status}
                          </span>
                        </div>
                      </Card>
                    ))
                  )}
                </>
              ) : (
                <Card className="p-8 text-center border-dashed">
                  <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Click a highlighted date on the calendar to view requests</p>
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
                <Input placeholder="Search by name, type, ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["all", "pending", "processing", "approved", "rejected", "needs-docs"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                  >
                    {f === "all" ? "All" : f === "needs-docs" ? "Needs Docs" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No document requests found</p>
                </div>
              ) : (
                filtered.map(doc => (
                  <Card
                    key={doc.id}
                    className="p-4 border-border/50 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => setSelected(doc)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">{doc.id}</span>
                            <span className="text-xs text-muted-foreground">{new Date(doc.date).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground truncate">{doc.documentType}</p>
                          <p className="text-xs text-muted-foreground">{doc.residentName} · {doc.purpose}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>
                          {statusIcons[doc.status]} {doc.status === "needs-docs" ? "Needs Docs" : doc.status}
                        </span>
                        {doc.status === "approved" && (
                          <button
                            onClick={e => { e.stopPropagation(); setPrintDoc(doc); }}
                            className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                            title="Print Document"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-6 shadow-2xl animate-fadeUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground">{selected.documentType}</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { label: "Request ID", value: selected.id },
                { label: "Resident", value: selected.residentName },
                { label: "Address", value: selected.address || "Not provided" },
                { label: "Purpose", value: selected.purpose },
                { label: "Date Filed", value: new Date(selected.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }) },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs text-muted-foreground w-24 shrink-0 mt-0.5">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[selected.status]}`}>
                  {statusIcons[selected.status]} {selected.status === "needs-docs" ? "Needs More Documents" : selected.status}
                </span>
              </div>
              {selected.notes && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
                  <p className="font-medium text-xs mb-0.5">Notes</p>
                  {selected.notes}
                </div>
              )}
            </div>

            {/* Requirements checklist */}
            {(() => {
              const dt = docTypes.find(d => d.name === selected.documentType);
              return dt ? (
                <div className="mb-5 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Required Documents</p>
                  <ul className="space-y-1">
                    {dt.requirements.map(r => (
                      <li key={r} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}

            {/* Needs more docs form */}
            {showNeedsDocsForm && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Label className="text-xs font-medium text-purple-800 mb-1 block">Message to Resident</Label>
                <Textarea
                  value={needsDocsNote}
                  onChange={e => setNeedsDocsNote(e.target.value)}
                  placeholder="Please submit: valid ID, recent utility bill..."
                  className="min-h-[80px] text-sm mb-2 border-purple-300"
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowNeedsDocsForm(false)} className="flex-1">Cancel</Button>
                  <Button size="sm" onClick={handleNeedsMoreDocs} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                    <Bell className="w-3.5 h-3.5 mr-1" /> Send & Mark
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAiReview(selected)}
                disabled={aiLoading === selected.id}
                className="gap-1.5 border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiLoading === selected.id ? "Reviewing..." : "AI Review"}
              </Button>
              <Button size="sm" onClick={() => updateStatus(selected.id, "processing")} variant="outline" className="border-blue-300 text-blue-700">
                Mark Processing
              </Button>
              <Button size="sm" onClick={() => { updateStatus(selected.id, "approved"); setSelected(null); }} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
              </Button>
              <Button size="sm" onClick={() => { updateStatus(selected.id, "rejected", "Requirements incomplete."); setSelected(null); }} variant="destructive" className="gap-1">
                <XCircle className="w-3.5 h-3.5" /> Reject
              </Button>
              <Button size="sm" onClick={() => setShowNeedsDocsForm(true)} variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50 gap-1">
                <FileQuestion className="w-3.5 h-3.5" /> Needs Docs
              </Button>
              {selected.status === "approved" && (
                <Button size="sm" onClick={() => setPrintDoc(selected)} className="gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300">
                  <Printer className="w-3.5 h-3.5" /> Print
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
