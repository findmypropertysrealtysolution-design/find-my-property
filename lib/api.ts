import type { Property } from "@/components/PropertyCard";
import { mapBackendProperty, type BackendProperty } from "@/lib/property-mapper";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005";

type RequestOptions = RequestInit & {
  token?: string;
};

export type UserRole = "admin" | "agent" | "tenant" | "company";

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

  const response = await fetch(`${API_BASE_URL}${path}`, {
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

  async getAgents(): Promise<Agent[]> {
    return request<Agent[]>("/agents", {
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
    return request<{ message: string }>("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },
};
