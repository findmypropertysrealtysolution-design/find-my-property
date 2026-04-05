import { z } from "zod";

export const leadStatusSchema = z.enum(["new", "contacted", "closed", "archived"]);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

/**
 * Persisted row (`property_leads`) — property + tenant + agent user ids.
 */
export const propertyLeadSchema = z.object({
  id: z.number().int(),
  propertyId: z.number().int(),
  tenantUserId: z.number().int(),
  agentUserId: z.number().int(),
  message: z.string().nullable(),
  status: leadStatusSchema,
  createdAt: z.union([z.coerce.date(), z.string()]),
  updatedAt: z.union([z.coerce.date(), z.string()]),
});

export type PropertyLead = z.infer<typeof propertyLeadSchema>;

export const propertyLeadCreateSchema = propertyLeadSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type PropertyLeadCreate = z.infer<typeof propertyLeadCreateSchema>;

export const propertyLeadUpdateSchema = propertyLeadCreateSchema.partial();

export type PropertyLeadUpdate = z.infer<typeof propertyLeadUpdateSchema>;

/**
 * Lead as returned by `/leads` (enriched with property + tenant display fields).
 * See `docs/BACKEND_LEADS.md`.
 */
export const leadSchema = z.object({
  id: z.number().int(),
  propertyId: z.number().int(),
  propertyTitle: z.string(),
  tenantId: z.number().int(),
  tenantName: z.string(),
  tenantEmail: z.string(),
  tenantPhone: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  status: leadStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type Lead = z.infer<typeof leadSchema>;

export const leadCreateInputSchema = z.object({
  propertyId: z.union([z.string(), z.number()]),
  message: z.string().optional(),
});

export type LeadCreateInput = z.infer<typeof leadCreateInputSchema>;
