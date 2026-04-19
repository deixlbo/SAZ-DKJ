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
import { Download, Printer } from "lucide-react";
import * as XLSX from "xlsx";

type DocumentStatus = "all" | "pending" | "approved" | "paid";

export default function OfficialDocumentsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<DocumentStatus>("all");

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents", status],
    queryFn: () =>
      api.documents.list({
        status: status !== "all" ? status : undefined,
      }),
    enabled: !!user,
  });

  const filteredDocuments = documents?.data || [];

  const handleExportExcel = () => {
    if (!filteredDocuments || filteredDocuments.length === 0) {
      alert("No documents to export");
      return;
    }

    const data = filteredDocuments.map((doc: any) => ({
      "Document Type": doc.type,
      "Resident Name": doc.user_name,
      "Date Requested": new Date(doc.created_at).toLocaleDateString(),
      Status: doc.status.toUpperCase(),
      "Amount Paid": doc.amount_paid ? `₱${doc.amount_paid}` : "Unpaid",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");

    // Set column widths
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 },
    ];

    XLSX.writeFile(
      workbook,
      `barangay-documents-${status}-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Document Requests</h1>
        <p className="text-slate-600 mt-2">Manage all document requests</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-lg border border-slate-200 no-print">
        <div className="flex gap-3 items-center">
          <label className="text-sm font-medium text-slate-700">
            Filter by Status:
          </label>
          <Select value={status} onValueChange={(value: any) => setStatus(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleExportExcel}
            className="gap-2"
            variant="outline"
          >
            <Download size={16} />
            Export Excel
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer size={16} />
            Print
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="print-full-page border-0 md:border">
        {isLoading ? (
          <div className="p-8 text-center text-slate-600">Loading...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8 text-center text-slate-600">
            No documents found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 no-print">
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">
                    Document Type
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">
                    Resident Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">
                    Date Requested
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDocuments.map((doc: any) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50 no-print:hover:bg-slate-50 print:border-b"
                  >
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{doc.user_name}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium no-print:inline-block ${
                          doc.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : doc.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {doc.status.toUpperCase()}
                      </span>
                      <span className="print:inline hidden text-slate-900">
                        {doc.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {doc.amount_paid ? `₱${doc.amount_paid}` : "Unpaid"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
