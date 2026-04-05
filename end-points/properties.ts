import type { Property } from "@/components/property/PropertyCard";
import { mapBackendProperty, type BackendProperty } from "@/lib/property-mapper";
import { getStoredToken, request } from "@/end-points/http";

export const properties = {
  async getProperties() {
    const rows = await request<BackendProperty[]>("/properties");
    return rows.map((property) => mapBackendProperty(property));
  },

  /** Raw backend rows for admin tables (same endpoint as getProperties). */
  async getRawProperties() {
    return request<BackendProperty[]>("/properties");
  },

  async getMyProperties() {
    const rows = await request<BackendProperty[]>("/properties/my-properties", {
      method: "GET",
      token: getStoredToken(),
    });
    return rows.map((property) => mapBackendProperty(property));
  },

  async getProperty(id: string) {
    const property = await request<BackendProperty>(`/properties/${id}`);
    return mapBackendProperty(property);
  },

  async getRawProperty(id: string) {
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
   * Admin: approve a pending listing.
   * Backend: `POST /properties/:id/approve` — with agent `{ agentId: number }`, or skip assignment `{ skipAgentAssignment: true }`.
   */
  async approveProperty(
    id: string,
    options: { assignedAgentId: number } | { skipAgentAssignment: true },
  ) {
    const body =
      "skipAgentAssignment" in options && options.skipAgentAssignment
        ? JSON.stringify({ skipAgentAssignment: true })
        : JSON.stringify({ assignedAgentId: (options as { assignedAgentId: number }).assignedAgentId });
    const updated = await request<BackendProperty>(`/properties/${id}/approve`, {
      method: "PATCH",
      token: getStoredToken(),
      body,
    });
    return mapBackendProperty(updated);
  },

  /**
   * Admin: reject a pending listing with a reason.
   * Backend: `POST /properties/:id/reject` body `{ reason: string }`.
   */
  async rejectProperty(id: string, reason: string) {
    const raw = await request<BackendProperty | undefined>(`/properties/${id}/reject`, {
      method: "PATCH",
      token: getStoredToken(),
      body: JSON.stringify({ reason }),
    });
    return raw ? mapBackendProperty(raw) : undefined;
  },
};
