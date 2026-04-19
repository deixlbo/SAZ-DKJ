"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OfficialBusinessesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    owner_name: "",
    type: "",
    address: "",
    contact_number: "",
  });

  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => api.businesses.list(),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.businesses.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setFormData({
        name: "",
        owner_name: "",
        type: "",
        address: "",
        contact_number: "",
      });
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.businesses.update(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setFormData({
        name: "",
        owner_name: "",
        type: "",
        address: "",
        contact_number: "",
      });
      setEditingId(null);
      setIsOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.businesses.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });

  const businessesList = businesses?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (business: any) => {
    setEditingId(business.id);
    setFormData({
      name: business.name,
      owner_name: business.owner_name,
      type: business.type,
      address: business.address,
      contact_number: business.contact_number,
    });
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      owner_name: "",
      type: "",
      address: "",
      contact_number: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Businesses</h1>
          <p className="text-slate-600 mt-2">
            Register and manage businesses in Barangay Santiago
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + New Business
        </Button>
      </div>

      {isOpen && (
        <Card className="p-6 bg-slate-50">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Business" : "Register Business"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Business name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Owner Name
                </label>
                <Input
                  value={formData.owner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_name: e.target.value })
                  }
                  placeholder="Owner name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business Type
                </label>
                <Input
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  placeholder="e.g., Sari-Sari Store, Restaurant"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contact Number
                </label>
                <Input
                  value={formData.contact_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact_number: e.target.value,
                    })
                  }
                  placeholder="09xxxxxxxxx"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Business address"
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? "Update" : "Register"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-slate-600">Loading...</div>
      ) : businessesList.length === 0 ? (
        <div className="text-center py-8 text-slate-600">No businesses found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessesList.map((business: any) => (
            <Card key={business.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-slate-900">
                  {business.name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => deleteMutation.mutate(business.id)}
                  disabled={deleteMutation.isPending}
                >
                  ×
                </Button>
              </div>
              <p className="text-sm text-slate-600">{business.owner_name}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <span className="font-medium text-slate-900">Type:</span>
                  <p className="text-slate-600">{business.type}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Address:</span>
                  <p className="text-slate-600">{business.address}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-900">Contact:</span>
                  <p className="text-slate-600">{business.contact_number}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => handleEdit(business)}
              >
                Edit
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
