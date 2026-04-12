import { cache } from "react";
import { DEFAULT_LOCAL_API_URL } from "@/end-points/http";
import type { BackendProperty } from "@/lib/property-mapper";
import { parsePropertyIdFromSlugParam } from "@/lib/property-slug";

function getServerApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    process.env.INTERNAL_API_URL?.trim() ||
    DEFAULT_LOCAL_API_URL
  );
}

/**
 * Cached server fetch for SEO (metadata + JSON-LD). Same request dedupes via `cache`.
 * Revalidate periodically so search snippets stay fresh without hammering the API.
 */
export const getBackendPropertyForSeo = cache(async (slug: string): Promise<BackendProperty | null> => {
  const id = parsePropertyIdFromSlugParam(slug);
  if (!id) return null;
  try {
    const res = await fetch(`${getServerApiBaseUrl()}/properties/${id}`, {
      next: { revalidate: 24 * 60 * 60 } // 1 day
    });
    if (!res.ok) return null;
    return res.json() as Promise<BackendProperty>;
  } catch {
    return null;
  }
});
