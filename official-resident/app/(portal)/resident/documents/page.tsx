"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FileUp, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DOCUMENT_TYPES = {
  clearance: {
    name: "Barangay Clearance",
    requiredDocuments: [
      "Valid ID (Voter's ID, Driver's License, or Passport)",
      "Proof of Residence (utility bill or lease agreement)",
      "Character Reference Letter",
    ],
  },
  indigency: {
    name: "Certificate of Indigency",
    requiredDocuments: [
      "Valid ID",
      "Proof of Residence",
      "Income Declaration Form",
    ],
  },
  residency: {
    name: "Certificate of Residency",
    requiredDocuments: ["Valid ID", "Proof of Residence"],
  },
  solo_parent: {
    name: "Solo Parent Certificate",
    requiredDocuments: [
      "Valid ID",
      "Birth Certificate of Child",
      "Proof of Residence",
    ],
  },
  business_permit: {
    name: "Business Permit",
    requiredDocuments: [
      "Valid ID",
      "Business Registration",
      "Proof of Business Location",
    ],
  },
};

export default function ResidentDocumentsPage() {
  const { user } = useAuth();
  const [selectedDocType, setSelectedDocType] = useState<string>("");
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: myDocuments, isLoading } = useQuery({
    queryKey: ["my-documents"],
    queryFn: () => api.documents.list({ user_id: user?.id }),
    enabled: !!user,
  });

  const documentsList = myDocuments?.data || [];

  const currentDocType = selectedDocType as keyof typeof DOCUMENT_TYPES;
  const docConfig = currentDocType
    ? DOCUMENT_TYPES[currentDocType]
    : null;

  const handleCheckboxChange = (index: number) => {
    const key = `${selectedDocType}_${index}`;
    setCheckedDocs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const key = `${selectedDocType}_${index}`;
      setUploadedDocs((prev) => ({
        ...prev,
        [key]: file,
      }));
      const docKey = `${selectedDocType}_${index}`;
      setCheckedDocs((prev) => ({
        ...prev,
        [docKey]: true,
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    const key = `${selectedDocType}_${index}`;
    setUploadedDocs((prev) => {
      const newDocs = { ...prev };
      delete newDocs[key];
      return newDocs;
    });
    setCheckedDocs((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const canSubmit =
    selectedDocType &&
    docConfig &&
    docConfig.requiredDocuments.every((_, index) => {
      const key = `${selectedDocType}_${index}`;
      return checkedDocs[key] && uploadedDocs[key];
    });

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please upload all required documents");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", selectedDocType);

      Object.entries(uploadedDocs).forEach(([key, file]) => {
        formData.append(`documents[${key}]`, file);
      });

      // Call API to submit document request
      await api.documents.create(formData);
      toast.success("Document request submitted successfully!");

      // Reset form
      setSelectedDocType("");
      setCheckedDocs({});
      setUploadedDocs({});
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Document Requests</h1>
        <p className="text-slate-600 mt-2">Request documents from the barangay</p>
      </div>

      {/* Request Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">
          Request a New Document
        </h2>

        <div className="space-y-6">
          {/* Document Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">
              Select Document Type
            </label>
            <Select value={selectedDocType} onValueChange={setSelectedDocType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a document type..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Checklist */}
          {docConfig && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Required Documents for {docConfig.name}
                </h3>

                <div className="space-y-3">
                  {docConfig.requiredDocuments.map((doc, index) => {
                    const key = `${selectedDocType}_${index}`;
                    const isChecked = checkedDocs[key];
                    const hasFile = uploadedDocs[key];

                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() =>
                            handleCheckboxChange(index)
                          }
                          disabled={!hasFile}
                          className="mt-1"
                        />

                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {doc}
                          </p>
                          {hasFile && (
                            <p className="text-sm text-green-600 mt-1">
                              ✓ {uploadedDocs[key]?.name}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {!hasFile ? (
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                onChange={(e) => handleFileUpload(e, index)}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  document
                                    .querySelector(
                                      `input[type="file"]`
                                    )
                                    ?.click()
                                }
                                className="gap-2"
                              >
                                <FileUp size={16} />
                                Upload
                              </Button>
                            </label>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFile(index)}
                              className="gap-2"
                            >
                              <Trash2 size={16} />
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Document Request"}
              </Button>

              {!canSubmit && (
                <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  ⚠️ You must upload all required documents to submit your request.
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* My Requests */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          My Document Requests
        </h2>

        {isLoading ? (
          <p className="text-slate-600">Loading...</p>
        ) : documentsList.length === 0 ? (
          <p className="text-slate-600">You haven't requested any documents yet.</p>
        ) : (
          <div className="space-y-3">
            {documentsList.map((doc: any) => (
              <div
                key={doc.id}
                className="flex justify-between items-center p-4 border border-slate-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">{doc.type}</p>
                  <p className="text-sm text-slate-600">
                    Requested on{" "}
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doc.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : doc.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {doc.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
