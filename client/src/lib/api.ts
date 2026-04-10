// Central API wrapper — all backend calls go through here.
// It automatically attaches the Clerk JWT token to every request.

import { useAuth } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Types that mirror the Prisma schema
export type JobStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type InvoiceStatus = "UNPAID" | "PAID" | "OVERDUE";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  jobs?: Job[];
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  status: JobStatus;
  amount: number;
  date: string;
  clientId: string;
  client?: Client;
  invoice?: Invoice;
  createdAt: string;
}

export interface Invoice {
  id: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  jobId: string;
  job?: Job & { client?: Client };
  createdAt: string;
}

export interface DashboardStats {
  totalJobs: number;
  totalRevenue: number;
  outstandingInvoices: number;
  outstandingAmount: number;
}

// Hook that returns typed fetch functions with auth baked in
export function useApi() {
  const { getToken } = useAuth();

  async function request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(err.error || "Request failed");
    }
    return res.json();
  }

  return {
    // Clients
    getClients: () => request<Client[]>("/api/clients"),
    getClient: (id: string) => request<Client>(`/api/clients/${id}`),
    createClient: (data: Omit<Client, "id" | "createdAt">) =>
      request<Client>("/api/clients", { method: "POST", body: JSON.stringify(data) }),
    updateClient: (id: string, data: Partial<Client>) =>
      request<Client>(`/api/clients/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteClient: (id: string) =>
      request<{ message: string }>(`/api/clients/${id}`, { method: "DELETE" }),

    // Jobs
    getJobs: () => request<Job[]>("/api/jobs"),
    getJob: (id: string) => request<Job>(`/api/jobs/${id}`),
    createJob: (data: Omit<Job, "id" | "createdAt" | "client" | "invoice">) =>
      request<Job>("/api/jobs", { method: "POST", body: JSON.stringify(data) }),
    updateJob: (id: string, data: Partial<Job>) =>
      request<Job>(`/api/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteJob: (id: string) =>
      request<{ message: string }>(`/api/jobs/${id}`, { method: "DELETE" }),

    // Invoices
    getInvoices: () => request<Invoice[]>("/api/invoices"),
    updateInvoice: (id: string, data: Partial<Invoice>) =>
      request<Invoice>(`/api/invoices/${id}`, { method: "PUT", body: JSON.stringify(data) }),

    // Dashboard
    getStats: () => request<DashboardStats>("/api/invoices/stats/summary"),
  };
}
