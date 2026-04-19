const BASE = "/api";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export const api = {
  announcements: {
    list: () => req<any[]>("/announcements"),
    get: (id: string) => req<any>(`/announcements/${id}`),
    create: (data: any) => req<any>("/announcements", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/announcements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/announcements/${id}`, { method: "DELETE" }),
  },
  ordinances: {
    list: () => req<any[]>("/ordinances"),
    get: (id: string) => req<any>(`/ordinances/${id}`),
    create: (data: any) => req<any>("/ordinances", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/ordinances/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/ordinances/${id}`, { method: "DELETE" }),
  },
  documents: {
    list: (residentId?: string) => req<any[]>(`/documents${residentId ? `?residentId=${residentId}` : ""}`),
    get: (id: string) => req<any>(`/documents/${id}`),
    create: (data: any) => req<any>("/documents", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/documents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/documents/${id}`, { method: "DELETE" }),
  },
  blotter: {
    list: (reportedById?: string) => req<any[]>(`/blotter${reportedById ? `?reportedById=${reportedById}` : ""}`),
    get: (id: string) => req<any>(`/blotter/${id}`),
    create: (data: any) => req<any>("/blotter", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/blotter/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/blotter/${id}`, { method: "DELETE" }),
  },
  projects: {
    list: () => req<any[]>("/projects"),
    get: (id: string) => req<any>(`/projects/${id}`),
    create: (data: any) => req<any>("/projects", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/projects/${id}`, { method: "DELETE" }),
  },
  residents: {
    list: () => req<any[]>("/residents"),
    get: (id: string) => req<any>(`/residents/${id}`),
    create: (data: any) => req<any>("/residents", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/residents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/residents/${id}`, { method: "DELETE" }),
  },
  assets: {
    list: () => req<any[]>("/assets"),
    get: (id: string) => req<any>(`/assets/${id}`),
    create: (data: any) => req<any>("/assets", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/assets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/assets/${id}`, { method: "DELETE" }),
  },
  businesses: {
    list: () => req<any[]>("/businesses"),
    get: (id: string) => req<any>(`/businesses/${id}`),
    create: (data: any) => req<any>("/businesses", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/businesses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => req<any>(`/businesses/${id}`, { method: "DELETE" }),
  },
  users: {
    list: () => req<any[]>("/users"),
    get: (id: string) => req<any>(`/users/${id}`),
    create: (data: any) => req<any>("/users", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => req<any>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    login: (email: string, password: string) => req<any>("/users/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  },
};
