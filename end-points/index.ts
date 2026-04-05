/**
 * HTTP API surface — split by domain under `./` and composed here.
 * App code should import `api` from `@/lib/api` (re-export) for a stable entry.
 */
import { auth } from "@/end-points/auth";
import { agents } from "@/end-points/agents";
import { leads } from "@/end-points/leads";
import { properties } from "@/end-points/properties";
import { settings } from "@/end-points/settings";
import { systemLogs } from "@/end-points/system-logs";
import { admin } from "@/end-points/admin";

export const api = {
  ...auth,
  ...properties,
  ...systemLogs,
  ...settings,
  ...agents,
  ...leads,
  ...admin,
};

export type Api = typeof api;
