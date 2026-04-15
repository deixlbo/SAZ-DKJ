import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalHeader } from "@/components/portal/header";
import { useSidebarToggle } from "@/components/portal/portal-layout";
import { useAuth } from "@/lib/auth-context";
import { mockDocumentRequests } from "@/lib/mock-data";
import {
  FileText, CheckCircle2, Clock, AlertCircle, XCircle, X, Upload,
  ChevronRight, FileQuestion, Bell
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
  uploadedFiles?: string[];
}

interface DocType {
  name: string;
  description: string;
  requirements: string[];
  fee: string;
  processingTime: string;
}

const AVAILABLE_DOCS: DocType[] = [
  {
    name: "Barangay Clearance",
    description: "General-purpose clearance for employment, business, or other transactions.",
    requirements: ["Valid Government ID (original + photocopy)", "Recent 2x2 ID photo (2 copies)", "Proof of residency"],
    fee: "₱50.00",
    processingTime: "1 business day",
  },
  {
    name: "Certificate of Indigency",
    description: "Certifies that the resident belongs to an indigent family. Required for PhilHealth, scholarships, etc.",
    requirements: ["Valid Government ID", "Recent 2x2 ID photo", "Proof of residency"],
    fee: "Free",
    processingTime: "Same day",
  },
  {
    name: "Certificate of Residency",
    description: "Proves that you are a registered resident of Barangay Santiago Saz.",
    requirements: ["Valid Government ID", "Utility bill or proof of address (within 3 months)"],
    fee: "₱30.00",
    processingTime: "Same day",
  },
  {
    name: "Business Clearance",
    description: "Required for business permit renewal at the municipal level.",
    requirements: ["Valid Government ID", "Business permit application form", "Lease contract or proof of ownership"],
    fee: "₱100.00",
    processingTime: "1–2 business days",
  },
  {
    name: "Certificate of Good Moral Character",
    description: "Character certificate required for employment, scholarships, or school enrollment.",
    requirements: ["Valid Government ID", "Recent 2x2 ID photo", "Letter of request (optional)"],
    fee: "₱30.00",
    processingTime: "Same day",
  },
  {
    name: "Cedula (Community Tax Certificate)",
    description: "Community Tax Certificate required for many legal and government transactions.",
    requirements: ["Valid Government ID", "Previous year's Cedula (if applicable)"],
    fee: "₱25.00 + tax based on income",
    processingTime: "Same day",
  },
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
const statusLabel: Record<DocStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  processing: "Processing",
  rejected: "Rejected",
  "needs-docs": "Needs Documents",
};

export default function ResidentDocumentsPage() {
  const { userData } = useAuth();
  const { toggle } = useSidebarToggle();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const initial = mockDocumentRequests.filter(d => d.residentId === userData?.uid) as DocRequest[];
  const [docs, setDocs] = useState<DocRequest[]>(initial);
  const [selectedDoc, setSelectedDoc] = useState<DocType | null>(null);
  const [purpose, setPurpose] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "myrequests">("available");

  const handleSelectDoc = (doc: DocType) => {
    setSelectedDoc(doc);
    setPurpose("");
    setUploadedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (idx: number) => setUploadedFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !purpose.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const newDoc: DocRequest = {
      id: `doc-${Date.now()}`,
      residentId: userData?.uid ?? "",
      residentName: userData?.fullName ?? "Resident",
      documentType: selectedDoc.name,
      purpose,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      address: userData?.address ?? "",
      notes: "",
      uploadedFiles: uploadedFiles.map(f => f.name),
    };

    setDocs(prev => [newDoc, ...prev]);
    setSelectedDoc(null);
    setPurpose("");
    setUploadedFiles([]);
    setLoading(false);
    setActiveTab("myrequests");
    toast({
      title: "Request Submitted",
      description: `Your ${selectedDoc.name} request has been submitted. You will be notified once processed.`,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <PortalHeader
        title="Document Requests"
        description="Request and track barangay documents"
        onMenuClick={toggle}
      />

      {/* Request Panel Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg p-6 shadow-2xl my-4 animate-fadeUp">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-foreground">{selectedDoc.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedDoc.processingTime} · {selectedDoc.fee}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Requirements */}
            <div className="mb-5 p-4 bg-muted/50 rounded-xl">
              <p className="text-xs font-semibold text-foreground mb-2">Required Documents</p>
              <ul className="space-y-1.5">
                {selectedDoc.requirements.map(req => (
                  <li key={req} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Purpose of Request <span className="text-destructive">*</span></Label>
                <Input
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  placeholder="e.g., Job application, School enrollment, Loan"
                  className="mt-1"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <Label>Upload Required Files</Label>
                <div
                  className="mt-1 border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                  <Upload className="w-6 h-6 text-muted-foreground/50 mx-auto mb-1.5" />
                  <p className="text-sm text-muted-foreground">Click to upload files (images, PDF)</p>
                  <p className="text-xs text-muted-foreground/70">Multiple files allowed</p>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm">
                        <span className="text-emerald-700 truncate flex-1">{f.name}</span>
                        <button type="button" onClick={() => removeFile(i)} className="text-muted-foreground hover:text-destructive ml-2">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setSelectedDoc(null)} className="flex-1">Cancel</Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {loading
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Submitting...</span>
                    : "Submit Request"
                  }
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="p-4 sm:p-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeTab === "available" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            Available Documents
          </button>
          <button
            onClick={() => setActiveTab("myrequests")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${activeTab === "myrequests" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            My Requests {docs.length > 0 && `(${docs.length})`}
          </button>
        </div>

        {/* Available Documents Grid */}
        {activeTab === "available" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Click a document to see requirements and submit a request.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {AVAILABLE_DOCS.map(doc => (
                <Card
                  key={doc.name}
                  className="p-4 border-border/50 hover:border-primary/40 hover:shadow-md cursor-pointer transition-all group"
                  onClick={() => handleSelectDoc(doc)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{doc.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="text-primary font-medium">{doc.fee}</span>
                        <span>{doc.processingTime}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* My Requests List */}
        {activeTab === "myrequests" && (
          <div className="space-y-3">
            {docs.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-border/60">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No document requests yet</p>
                <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90 gap-2" onClick={() => setActiveTab("available")}>
                  Browse Available Documents
                </Button>
              </Card>
            ) : (
              docs.map(doc => (
                <Card key={doc.id} className="p-4 border-border/50 hover:border-primary/30 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">{doc.documentType}</h3>
                        <p className="text-xs text-muted-foreground">Purpose: {doc.purpose}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {new Date(doc.date).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                        {doc.notes && (
                          <div className="mt-1.5 flex items-start gap-1.5 text-xs text-purple-700 bg-purple-50 px-2 py-1.5 rounded-md border border-purple-200">
                            <Bell className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>Note from official: {doc.notes}</span>
                          </div>
                        )}
                        {doc.uploadedFiles && doc.uploadedFiles.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded: {doc.uploadedFiles.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[doc.status]}`}>
                        {statusIcons[doc.status]} {statusLabel[doc.status]}
                      </span>
                      {doc.status === "needs-docs" && (
                        <Button size="sm" variant="outline" className="text-xs h-7 border-purple-300 text-purple-700 gap-1"
                          onClick={() => {
                            const dt = AVAILABLE_DOCS.find(d => d.name === doc.documentType);
                            if (dt) handleSelectDoc(dt);
                          }}>
                          <Upload className="w-3 h-3" /> Submit Docs
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
