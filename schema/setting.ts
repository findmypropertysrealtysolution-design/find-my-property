import { z } from "zod";

/**
 * Application settings (API / UI shape, camelCase).
 * Maps the persisted `settings` row; DB columns use snake_case on the backend.
 */
export const settingsSchema = z.object({
  siteName: z.string().min(1),
  supportEmail: z.string().email(),
  autoApproveListings: z.boolean(),
  newAgentRegistration: z.boolean(),
  theme: z.string(),
  primaryLogoUrl: z.string().nullish(),
  faviconUrl: z.string().nullish(),
  cloudinaryApiKey: z.string().nullish(),
  googleMapsKey: z.string().nullish(),
  twoFactorAuthEnforced: z.boolean(),
});

export type Settings = z.infer<typeof settingsSchema>;

/** PATCH `/settings` — all fields optional. */
export const settingsUpdateSchema = settingsSchema.partial();

export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;

/** Optional persisted metadata when the API includes a row id / revision time. */
export const settingsRowSchema = settingsSchema.extend({
  id: z.number().int(),
  updatedAt: z.union([z.coerce.date(), z.string()]),
});

export type SettingsRow = z.infer<typeof settingsRowSchema>;
