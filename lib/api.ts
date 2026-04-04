import type { Property } from "@/components/property/PropertyCard";
import { User } from "@/contexts/auth-context";
import { mapBackendProperty, type BackendProperty } from "@/lib/property-mapper";

const DEFAULT_LOCAL_API_URL = "http://localhost:3005";

function getApiBaseUrl() {
  const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (typeof window !== "undefined") {
    if (configuredApiUrl) {
      const isSecurePage = window.location.protocol === "https:";
      const isInsecureApiOrigin = configuredApiUrl.startsWith("http://");

      if (isSecurePage && isInsecureApiOrigin) {
        return "/api";
      }

      return configuredApiUrl;
    }

    return window.location.protocol === "https:" ? "/api" : DEFAULT_LOCAL_API_URL;
  }

  return configuredApiUrl || DEFAULT_LOCAL_API_URL;
}

type RequestOptions = RequestInit & {
  token?: string;
};

export type UserRole = "admin" | "agent" | "tenant";

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  pendingEmail?: string | null;
  phone?: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onboardingCompleted: boolean;
  locationAddress?: string | null;
  locationCity?: string | null;
  locationState?: string | null;
  locationCountry?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface SystemLog {
  id: number;
  level: "error" | "info" | "warn" | "debug";
  message: string;
  timestamp: string;
  url?: string;
  method?: string;
  userId?: number;
}

export interface Settings {
  siteName: string;
  supportEmail: string;
  autoApproveListings: boolean;
  newAgentRegistration: boolean;
  theme: string;
  primaryLogoUrl?: string;
  faviconUrl?: string;
  cloudinaryApiKey?: string;
  googleMapsKey?: string;
  twoFactorAuthEnforced: boolean;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  isVerified: boolean;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

/** Tenant enquiry assigned to the listing agent. See `docs/BACKEND_LEADS.md` for API contract. */
export type LeadStatus = "new" | "contacted" | "closed" | "archived";

export interface Lead {
  id: number;
  propertyId: number;
  propertyTitle: string;
  tenantId: number;
  tenantName: string;
  tenantEmail: string;
  tenantPhone?: string | null;
  message?: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt?: string;
}

interface BackendLead {
  id: number;
  property_id?: number;
  propertyId?: number;
  property_title?: string;
  propertyTitle?: string;
  tenant_id?: number;
  tenantId?: number;
  tenant_name?: string;
  tenantName?: string;
  tenant_email?: string;
  tenantEmail?: string;
  tenant_phone?: string | null;
  tenantPhone?: string | null;
  message?: string | null;
  status?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

function mapLead(raw: BackendLead): Lead {
  const statusRaw = (raw.status || "new").toLowerCase();
  const status: LeadStatus =
    statusRaw === "contacted" || statusRaw === "closed" || statusRaw === "archived" ? statusRaw : "new";
  return {
    id: raw.id,
    propertyId: Number(raw.propertyId ?? raw.property_id),
    propertyTitle: raw.propertyTitle ?? raw.property_title ?? "",
    tenantId: Number(raw.tenantId ?? raw.tenant_id),
    tenantName: raw.tenantName ?? raw.tenant_name ?? "",
    tenantEmail: raw.tenantEmail ?? raw.tenant_email ?? "",
    tenantPhone: raw.tenantPhone ?? raw.tenant_phone ?? null,
    message: raw.message ?? null,
    status,
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.updated_at,
  };
}

interface BackendAuthUser {
  id: number;
  name?: string;
  email?: string | null;
  pendingEmail?: string | null;
  phone?: string | null;
  role?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  onboardingCompleted?: boolean;
  locationAddress?: string | null;
  locationCity?: string | null;
  locationState?: string | null;
  locationCountry?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface AuthApiResponse {
  access_token: string;
  user: BackendAuthUser;
}

function getStoredToken() {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("nb_token") || undefined;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorBody = await response.json();
      if (Array.isArray(errorBody?.message)) {
        message = errorBody.message.join(", ");
      } else if (typeof errorBody?.message === "string") {
        message = errorBody.message;
      }
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function normalizeRole(role?: string): UserRole {
  const normalized = role?.toLowerCase();
  if (normalized === "admin" || normalized === "agent" || normalized === "tenant") {
    return normalized;
  }
  // Legacy or unknown roles (e.g. former "company") map to tenant
  return "tenant";
}

function mapAuthUser(user: BackendAuthUser): AuthUser {
  return {
    id: String(user.id),
    name: user.name?.trim() || user.email || user.phone || "User",
    email: user.email ?? null,
    pendingEmail: user.pendingEmail ?? null,
    phone: user.phone ?? null,
    role: normalizeRole(user.role),
    isEmailVerified: Boolean(user.isEmailVerified),
    isPhoneVerified: Boolean(user.isPhoneVerified),
    onboardingCompleted: Boolean(user.onboardingCompleted),
    locationAddress: user.locationAddress ?? null,
    locationCity: user.locationCity ?? null,
    locationState: user.locationState ?? null,
    locationCountry: user.locationCountry ?? null,
    latitude: user.latitude ?? null,
    longitude: user.longitude ?? null,
  };
}

function mapAuthResponse(data: AuthApiResponse) {
  return {
    accessToken: data.access_token,
    user: mapAuthUser(data.user),
  };
}

export const api = {
  async uploadFile(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ url: string }>("/upload", {
      method: "POST",
      token: getStoredToken(),
      body: formData,
    });
  },

  async requestPhoneOtp(phone: string) {
    return request<{ message: string; status: string }>("/auth/phone-otp/request", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  async verifyPhoneOtp(input: { phone: string; code: string; name?: string }) {
    const response = await request<AuthApiResponse>("/auth/phone-otp/verify", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return mapAuthResponse(response);
  },

  async getMe(token?: string) {
    const response = await request<{ user: BackendAuthUser }>("/auth/me", {
      method: "GET",
      token: token || getStoredToken(),
    });
    return { user: mapAuthUser(response.user) };
  },

  async updateMe(input: {
    email?: string;
    name?: string;
    role?: UserRole;
    locationAddress?: string;
    locationCity?: string;
    locationState?: string;
    locationCountry?: string;
    latitude?: number;
    longitude?: number;
  }) {
    const response = await request<AuthApiResponse>("/auth/me", {
      method: "PATCH",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
    return mapAuthResponse(response);
  },

  async deleteMe() {
    return request<{ message: string }>("/auth/me", {
      method: "DELETE",
      token: getStoredToken(),
    });
  },

  async getProperties(): Promise<Property[]> {
    const properties = await request<BackendProperty[]>("/properties");
    return properties.map((property) => mapBackendProperty(property));
  },

  /** Returns raw backend rows for admin tables (same endpoint as getProperties). */
  async getRawProperties(): Promise<BackendProperty[]> {
    return request<BackendProperty[]>("/properties");
  },

  async getMyProperties(): Promise<Property[]> {
    const properties = await request<BackendProperty[]>("/properties/my-properties", {
      method: "GET",
      token: getStoredToken(),
    });
    return properties.map((property) => mapBackendProperty(property));
  },

  async getProperty(id: string): Promise<Property> {
    const property = await request<BackendProperty>(`/properties/${id}`);
    return mapBackendProperty(property);
  },

  async getRawProperty(id: string): Promise<BackendProperty> {
    return request<BackendProperty>(`/properties/${id}`);
  },

  async createProperty(input: Record<string, unknown>) {
    const created = await request<BackendProperty>("/properties", {
      method: "POST",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
    return mapBackendProperty(created);
  },

  async updateProperty(id: string, input: Record<string, unknown>) {
    const updated = await request<BackendProperty>(`/properties/${id}`, {
      method: "PATCH",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
    return mapBackendProperty(updated);
  },

  async deleteProperty(id: string) {
    return request<{ message: string }>(`/properties/${id}`, {
      method: "DELETE",
      token: getStoredToken(),
    });
  },

  /**
   * Admin: approve a pending listing and assign a listing agent.
   * Backend: `POST /properties/:id/approve` body `{ agentId: number }`.
   */
  async approveProperty(id: string, agentId: number): Promise<Property> {
    const updated = await request<BackendProperty>(`/properties/${id}/approve`, {
      method: "POST",
      token: getStoredToken(),
      body: JSON.stringify({ agentId }),
    });
    return mapBackendProperty(updated);
  },

  /**
   * Admin: reject a pending listing with a reason.
   * Backend: `POST /properties/:id/reject` body `{ reason: string }` (may return updated property or 204).
   */
  async rejectProperty(id: string, reason: string): Promise<Property | undefined> {
    const raw = await request<BackendProperty | undefined>(`/properties/${id}/reject`, {
      method: "POST",
      token: getStoredToken(),
      body: JSON.stringify({ reason }),
    });
    return raw ? mapBackendProperty(raw) : undefined;
  },

  async getSystemLogs(): Promise<SystemLog[]> {
    return request<SystemLog[]>("/system-logs", {
      method: "GET",
      token: getStoredToken(),
    });
  },

  async getSettings(): Promise<Settings> {
    return request<Settings>("/settings", {
      method: "GET",
    });
  },

  async updateSettings(input: Partial<Settings>): Promise<Settings> {
    return request<Settings>("/settings", {
      method: "PATCH",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
  },

  async getAgents() {
    return request<User[]>("/agents", {
      method: "GET",
      token: getStoredToken(),
    });
  },

  async createAgent(input: Partial<Agent>): Promise<Agent> {
    return request<Agent>("/agents", {
      method: "POST",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
  },

  async updateAgent(id: number, input: Partial<Agent>): Promise<Agent> {
    return request<Agent>(`/agents/${id}`, {
      method: "PATCH",
      token: getStoredToken(),
      body: JSON.stringify(input),
    });
  },

  async deleteAgent(id: number): Promise<void> {
    return request<void>(`/agents/${id}`, {
      method: "DELETE",
      token: getStoredToken(),
    });
  },

  async verifyAgent(token: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/auth/verify?token=${token}`);
  },

  /** Agent dashboard: enquiries for properties this agent handles. */
  async getMyLeads(): Promise<Lead[]> {
    const rows = await request<BackendLead[]>("/leads", {
      method: "GET",
      token: getStoredToken(),
    });
    return Array.isArray(rows) ? rows.map(mapLead) : [];
  },

  /** Tenant (or buyer): express interest in a property; backend assigns the listing agent. */
  async createLead(input: { propertyId: string | number; message?: string }): Promise<Lead> {
    const created = await request<BackendLead>("/leads", {
      method: "POST",
      token: getStoredToken(),
      body: JSON.stringify({
        propertyId: Number(input.propertyId),
        ...(input.message?.trim() ? { message: input.message.trim() } : {}),
      }),
    });
    return mapLead(created);
  },

  /** Agent: update workflow status on a lead they own. */
  async updateLeadStatus(id: number, status: LeadStatus): Promise<Lead> {
    const updated = await request<BackendLead>(`/leads/${id}`, {
      method: "PATCH",
      token: getStoredToken(),
      body: JSON.stringify({ status }),
    });
    return mapLead(updated);
  },
};
