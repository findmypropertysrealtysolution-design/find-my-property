import type { Property } from "@/components/property/PropertyCard";
import { mapBackendProperty, type BackendProperty } from "@/lib/property-mapper";
import { request } from "@/end-points/http";
import { cacheLife, cacheTag } from "next/cache";
import { TAGS } from "@/config/tags";

/** Public catalog — safe to cache; invalidate with `TAGS.properties` (or per-row tags). */
export async function getCachedProperties(): Promise<Property[]> {
  "use cache";
  cacheTag(TAGS.properties);
  cacheLife("days");

  const rows = await request<BackendProperty[]>("/properties");
  return rows.map((property) => mapBackendProperty(property));
}

/**
 * Single public property. Tagged with both the global catalog and this id so you can
 * revalidate only `TAGS.property(id)` or the whole list with `TAGS.properties`.
 */
export async function getCachedProperty(id: string): Promise<Property | undefined> {
  "use cache";
  cacheTag(TAGS.properties, TAGS.property(id));
  cacheLife("days");

  try {
    const property = await request<BackendProperty>(`/properties/${id}`);
    return mapBackendProperty(property);
  } catch {
    return undefined;
  }
}
