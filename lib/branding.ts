export const SITE_NAME = "Find My Property";

/** Public support inbox (override with `NEXT_PUBLIC_SUPPORT_EMAIL`). */
export const SUPPORT_EMAIL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim()
    ? process.env.NEXT_PUBLIC_SUPPORT_EMAIL.trim()
    : "findmypropertysrealtysolution@gmail.com";
