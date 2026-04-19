"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function OfficialProjectsPage() {
  const { user } = useAuth();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api.projects.list(),
    enabled: !!user,
  });

  const projectList = projects?.data || [];

  return (
    <div className="space-y-6 print-full-page">
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block text-center mb-8 pb-4 border-b-2 border-slate-900">
        <p className="text-sm font-semibold">Republic of the Philippines</p>
        <p className="text-sm font-semibold">Province of Zambales</p>
        <p className="text-sm font-semibold">Municipality of San Antonio</p>
        <p className="text-base font-bold mt-2">Barangay Santiago</p>
        <p className="text-sm font-semibold">Office of the Punong Barangay</p>
      </div>

      {/* Header */}
      <div className="no-print">
        <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
        <p className="text-slate-600 mt-2">Manage barangay development projects</p>
      </div>

      {/* Print Button */}
      <div className="flex justify-end no-print">
        <Button onClick={() => window.print()} className="gap-2">
          <Printer size={16} />
          Print
        </Button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : projectList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No projects found</div>
      ) : (
        <div className="grid gap-4">
          {projectList.map((project: any) => (
            <Card key={project.id} className="p-6 print:border print:border-slate-900">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {project.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium no-print:inline-block ${
                      project.status === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : project.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.status.toUpperCase()}
                  </span>
                  <span className="hidden print:inline text-sm font-medium">
                    {project.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-slate-900">Budget:</span>
                    <p className="text-slate-600">₱{project.budget}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">
                      Start Date:
                    </span>
                    <p className="text-slate-600">
                      {new Date(project.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">
                      End Date:
                    </span>
                    <p className="text-slate-600">
                      {new Date(project.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">
                      Assigned To:
                    </span>
                    <p className="text-slate-600">{project.assigned_to}</p>
                  </div>
                </div>

                {project.completion_percentage !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-900">
                        Progress
                      </span>
                      <span className="text-slate-600">
                        {project.completion_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${project.completion_percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
