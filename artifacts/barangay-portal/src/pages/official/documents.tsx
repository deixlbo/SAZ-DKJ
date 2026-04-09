import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { mockDocumentRequests } from "@/lib/mock-data";
import { FileText, Search, CheckCircle2, XCircle, Clock, AlertCircle, Eye, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DocStatus = "approved" | "pending" | "processing" | "rejected";

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

export default function OfficialDocumentsPage() {
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const [docs, setDocs] = useState<DocRequest[]>(mockDocumentRequests as DocRequest[]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | DocStatus>("all");
  const [selected, setSelected] = useState<DocRequest | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const filtered = docs.filter(d => {
    const matchSearch = d.residentName.toLowerCase().includes(search.toLowerCase())
      || d.documentType.toLowerCase().includes(search.toLowerCase())
      || d.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || d.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id: string, status: DocStatus, notes = "") => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status, notes } : d));
    setSelected(null);
    toast({
      title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `Document request has been ${status}.`,
    });
  };

  const handleAiReview = async (doc: DocRequest) => {
    setAiLoading(doc.id);
    await new Promise(r => setTimeout(r, 1500));
    setAiLoading(null);
    toast({
      title: "AI Review Complete",
      description: `${doc.documentType} for ${doc.residentName} — Resident verified in database. All requirements met. Recommended: Approve.`,
    });
  };

  const statusStyles: Record<DocStatus, string> = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  const statusIcons: Record<DocStatus, React.ReactNode> = {
    approved: <CheckCircle2 className="w-3.5 h-3.5" />,
    pending: <Clock className="w-3.5 h-3.5" />,
    processing: <AlertCircle className="w-3.5 h-3.5" />,
    rejected: <XCircle className="w-3.5 h-3.5" />,
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader title="Document Requests" description={`${docs.filter(d => d.status === "pending").length} pending review`} onMenuClick={toggle} />

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search by name, type, ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "processing", "approved", "rejected"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
                data-testid={`filter-${f}`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="modal-doc-detail">
            <Card className="w-full max-w-lg p-6 shadow-2xl animate-fadeUp">
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
                <div className="flex items-center gap-2 pt-2">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[selected.status]}`}>
                    {statusIcons[selected.status]} {selected.status}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAiReview(selected)}
                  disabled={aiLoading === selected.id}
                  className="gap-1.5 border-purple-300 text-purple-700 hover:bg-purple-50"
                  data-testid="button-ai-review"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiLoading === selected.id ? "Reviewing..." : "AI Review"}
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "processing")} variant="outline" className="border-blue-300 text-blue-700" data-testid="button-process">
                  Mark Processing
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "approved")} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1" data-testid="button-approve">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </Button>
                <Button size="sm" onClick={() => updateStatus(selected.id, "rejected", "Requirements incomplete. Please visit barangay hall.")} variant="destructive" className="gap-1" data-testid="button-reject">
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </Button>
              </div>
            </Card>
          </div>
        )}

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
                data-testid={`doc-row-${doc.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{doc.id}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground truncate">{doc.documentType}</p>
                      <p className="text-xs text-muted-foreground">{doc.residentName} · {doc.purpose}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>
                      {statusIcons[doc.status]} {doc.status}
                    </span>
                    <Eye className="w-4 h-4 text-muted-foreground" />
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
