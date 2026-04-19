/**
 * Compile-time fallback for the brand name. The runtime source of truth is the
 * admin-editable `settings.site_name` row in the backend; this constant only
 * fills in when the API is unreachable or before SSR data has resolved.
 */
export const DEFAULT_SITE_NAME = "Find My Property";

/** Backwards-compatible alias — many call sites still import `SITE_NAME`. */
export const SITE_NAME = DEFAULT_SITE_NAME;

/** Public support inbox (override with `NEXT_PUBLIC_SUPPORT_EMAIL`). */
export const SUPPORT_EMAIL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim()
    ? process.env.NEXT_PUBLIC_SUPPORT_EMAIL.trim()
    : "findmypropertysrealtysolution@gmail.com";
