import type { Lead, LeadStatus } from "@/schema/lead";
import { getStoredToken, request } from "@/end-points/http";

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

export const leads = {
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
