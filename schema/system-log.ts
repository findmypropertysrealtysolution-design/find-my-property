import { z } from "zod";

export const logLevelSchema = z.enum(["info", "error", "warn", "debug"]);
export type LogLevel = z.infer<typeof logLevelSchema>;

/** Full system log row (persisted / API). */
export const systemLogSchema = z.object({
  id: z.number().int(),
  level: logLevelSchema,
  message: z.string(),
  context: z.unknown().nullable().optional(),
  source: z.string().nullable().optional(),
  method: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  stack: z.string().nullable().optional(),
  userId: z.number().int().nullable().optional(),
  ip: z.string().nullable().optional(),
  timestamp: z.union([z.coerce.date(), z.string()]),
});

export type SystemLog = z.infer<typeof systemLogSchema>;

/** Insert payload (no id / timestamp). */
export const systemLogCreateSchema = systemLogSchema.omit({
  id: true,
  timestamp: true,
});

export type SystemLogCreate = z.infer<typeof systemLogCreateSchema>;

export const systemLogUpdateSchema = systemLogCreateSchema.partial();

export type SystemLogUpdate = z.infer<typeof systemLogUpdateSchema>;
