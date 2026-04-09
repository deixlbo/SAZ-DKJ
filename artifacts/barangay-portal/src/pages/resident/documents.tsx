import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { mockDocumentRequests } from "@/lib/mock-data";
import { FileText, Plus, CheckCircle2, Clock, AlertCircle, XCircle, X, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const documentTypes = [
  "Barangay Clearance",
  "Certificate of Residency",
  "Certificate of Indigency",
  "Business Permit",
  "Certificate of Good Moral Character",
  "Barangay ID",
  "Cedula (Community Tax Certificate)",
];

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

export default function ResidentDocumentsPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();

  const initialDocs = mockDocumentRequests.filter(d => d.residentId === userData?.uid) as DocRequest[];
  const [docs, setDocs] = useState<DocRequest[]>(initialDocs);
  const [showForm, setShowForm] = useState(false);
  const [docType, setDocType] = useState(documentTypes[0]);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newDoc: DocRequest = {
      id: `doc-${Date.now()}`,
      residentId: userData?.uid ?? "",
      residentName: userData?.fullName ?? "Resident",
      documentType: docType,
      purpose,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      address: userData?.address ?? "",
      notes: "",
    };
    setDocs(prev => [newDoc, ...prev]);
    setShowForm(false);
    setPurpose("");
    setLoading(false);
    toast({ title: "Request Submitted", description: `Your ${docType} request has been submitted. It will be processed within 1-2 business days.` });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Document Requests"
        description="Request and track barangay documents"
        onMenuClick={toggle}
        actions={
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            onClick={() => setShowForm(true)}
            data-testid="button-new-request"
          >
            <Plus className="w-4 h-4" /> New Request
          </Button>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        {/* Request Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" data-testid="modal-request">
            <Card className="w-full max-w-lg p-6 shadow-2xl animate-fadeUp">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">New Document Request</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="docType">Document Type</Label>
                  <select
                    id="docType"
                    value={docType}
                    onChange={e => setDocType(e.target.value)}
                    className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    data-testid="select-doctype"
                  >
                    {documentTypes.map(dt => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    value={purpose}
                    onChange={e => setPurpose(e.target.value)}
                    placeholder="e.g., Job application, School enrollment, Bank loan"
                    className="mt-1"
                    required
                    data-testid="input-purpose"
                  />
                </div>
                <div className="p-3 bg-muted/60 rounded-lg text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Requirements</p>
                  <ul className="space-y-0.5 text-xs list-disc list-inside">
                    <li>Valid Government ID</li>
                    <li>Proof of residency (if needed)</li>
                    <li>Processing fee: ₱50.00 (clearance) / Free for indigency cert.</li>
                  </ul>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                  <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-submit-request">
                    {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Submitting...</span> : "Submit Request"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Available Documents Info */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-foreground text-sm mb-2">Available Documents</h3>
          <div className="flex flex-wrap gap-2">
            {documentTypes.map(dt => (
              <span key={dt} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md">{dt}</span>
            ))}
          </div>
        </Card>

        {/* My Requests */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">My Requests ({docs.length})</h2>
          {docs.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-border/60">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No document requests yet</p>
              <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" /> Make Your First Request
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {docs.map((doc) => (
                <Card key={doc.id} className="p-4 border-border/50 hover:border-primary/30 transition" data-testid={`doc-item-${doc.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">{doc.documentType}</h3>
                        <p className="text-xs text-muted-foreground">Purpose: {doc.purpose}</p>
                        <p className="text-xs text-muted-foreground">Submitted: {new Date(doc.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</p>
                        {doc.notes && (
                          <p className="text-xs text-amber-600 mt-1">Note: {doc.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>
                        {statusIcons[doc.status]} {doc.status}
                      </span>
                      {doc.status === "approved" && (
                        <Button size="sm" variant="outline" className="text-xs h-7 border-primary/30 text-primary gap-1" data-testid={`button-download-${doc.id}`}>
                          <Download className="w-3 h-3" /> Download
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
