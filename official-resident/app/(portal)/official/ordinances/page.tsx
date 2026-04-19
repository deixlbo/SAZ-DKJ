"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function OfficialOrdinancesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    effective_date: "",
  });

  const { data: ordinances, isLoading } = useQuery({
    queryKey: ["ordinances"],
    queryFn: () => api.ordinances.list(),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.ordinances.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordinances"] });
      setFormData({ title: "", description: "", effective_date: "" });
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.ordinances.update(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordinances"] });
      setFormData({ title: "", description: "", effective_date: "" });
      setEditingId(null);
      setIsOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.ordinances.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordinances"] });
    },
  });

  const ordinanceList = ordinances?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (ordinance: any) => {
    setEditingId(ordinance.id);
    setFormData({
      title: ordinance.title,
      description: ordinance.description,
      effective_date: ordinance.effective_date?.split("T")[0] || "",
    });
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({ title: "", description: "", effective_date: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ordinances</h1>
          <p className="text-slate-600 mt-2">Create and manage barangay ordinances</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + New Ordinance
        </Button>
      </div>

      {isOpen && (
        <Card className="p-6 bg-slate-50">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Ordinance" : "Create Ordinance"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ordinance title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ordinance details and content"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Effective Date
              </label>
              <Input
                type="date"
                value={formData.effective_date}
                onChange={(e) =>
                  setFormData({ ...formData, effective_date: e.target.value })
                }
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : ordinanceList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No ordinances found</div>
      ) : (
        <div className="grid gap-4">
          {ordinanceList.map((ordinance: any) => (
            <Card key={ordinance.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900">
                    {ordinance.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    {ordinance.description}
                  </p>
                  <div className="mt-4 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-900">
                        Effective Date:
                      </span>{" "}
                      {new Date(ordinance.effective_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(ordinance)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(ordinance.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
