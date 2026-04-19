"use server";

import { revalidateTag } from "next/cache";

/**
 * Bust the SSR data cache for `/settings`. Called from the admin settings hook
 * after a successful PATCH so the next request re-renders metadata, JSON-LD,
 * and any other server surface with the new branding.
 */
export async function revalidateBranding() {
  revalidateTag("settings");
}
