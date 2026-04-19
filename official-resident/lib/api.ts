import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const api = {
  // Auth
  auth: {
    login: (email: string, password: string, role: string) =>
      apiClient.post("/auth/login", { email, password, role }),
    register: (email: string, password: string, name: string, role: string) =>
      apiClient.post("/auth/register", { email, password, name, role }),
    logout: () => apiClient.post("/auth/logout"),
    me: () => apiClient.get("/auth/me"),
  },

  // Documents
  documents: {
    list: (params?: any) => apiClient.get("/documents", { params }),
    create: (data: any) => apiClient.post("/documents", data),
    update: (id: string, data: any) => apiClient.put(`/documents/${id}`, data),
    delete: (id: string) => apiClient.delete(`/documents/${id}`),
    download: (id: string) =>
      apiClient.get(`/documents/${id}/download`, { responseType: "blob" }),
  },

  // Residents
  residents: {
    list: (params?: any) => apiClient.get("/residents", { params }),
    get: (id: string) => apiClient.get(`/residents/${id}`),
    create: (data: any) => apiClient.post("/residents", data),
    update: (id: string, data: any) =>
      apiClient.put(`/residents/${id}`, data),
    delete: (id: string) => apiClient.delete(`/residents/${id}`),
  },

  // Blotter
  blotter: {
    list: (params?: any) => apiClient.get("/blotter", { params }),
    get: (id: string) => apiClient.get(`/blotter/${id}`),
    create: (data: any) => apiClient.post("/blotter", data),
    update: (id: string, data: any) => apiClient.put(`/blotter/${id}`, data),
    delete: (id: string) => apiClient.delete(`/blotter/${id}`),
  },

  // Announcements
  announcements: {
    list: (params?: any) => apiClient.get("/announcements", { params }),
    get: (id: string) => apiClient.get(`/announcements/${id}`),
    create: (data: any) => apiClient.post("/announcements", data),
    update: (id: string, data: any) =>
      apiClient.put(`/announcements/${id}`, data),
    delete: (id: string) => apiClient.delete(`/announcements/${id}`),
  },

  // Projects
  projects: {
    list: (params?: any) => apiClient.get("/projects", { params }),
    get: (id: string) => apiClient.get(`/projects/${id}`),
    create: (data: any) => apiClient.post("/projects", data),
    update: (id: string, data: any) =>
      apiClient.put(`/projects/${id}`, data),
    delete: (id: string) => apiClient.delete(`/projects/${id}`),
  },

  // Assets
  assets: {
    list: (params?: any) => apiClient.get("/assets", { params }),
    get: (id: string) => apiClient.get(`/assets/${id}`),
    create: (data: any) => apiClient.post("/assets", data),
    update: (id: string, data: any) =>
      apiClient.put(`/assets/${id}`, data),
    delete: (id: string) => apiClient.delete(`/assets/${id}`),
  },

  // Ordinances
  ordinances: {
    list: (params?: any) => apiClient.get("/ordinances", { params }),
    get: (id: string) => apiClient.get(`/ordinances/${id}`),
    create: (data: any) => apiClient.post("/ordinances", data),
    update: (id: string, data: any) =>
      apiClient.put(`/ordinances/${id}`, data),
    delete: (id: string) => apiClient.delete(`/ordinances/${id}`),
  },

  // Businesses
  businesses: {
    list: (params?: any) => apiClient.get("/businesses", { params }),
    get: (id: string) => apiClient.get(`/businesses/${id}`),
    create: (data: any) => apiClient.post("/businesses", data),
    update: (id: string, data: any) =>
      apiClient.put(`/businesses/${id}`, data),
    delete: (id: string) => apiClient.delete(`/businesses/${id}`),
  },

  // AI Chatbot
  chatbot: {
    sendMessage: (message: string, context?: any) =>
      apiClient.post("/chatbot/message", { message, context }),
    getInsights: (type: string) =>
      apiClient.get(`/chatbot/insights/${type}`),
  },
};

export default apiClient;
