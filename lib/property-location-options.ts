import type { Property } from "@/lib/property-view-model";

export type AreaOption = { name: string; count: number };

export type PopularCity = { name: string; count: number };

/**
 * Top cities by listing count (uses structured `city` on each property). For landing “Popular cities” chips;
 * links should use `/browse?loc=${encodeURIComponent(name)}` to match browse filters.
 */
export function buildPopularCitiesFromProperties(
  properties: Property[],
  limit = 8,
): PopularCity[] {
  const counts = new Map<string, number>();
  for (const p of properties) {
    const city = p.city?.trim();
    if (!city) continue;
    counts.set(city, (counts.get(city) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "en", { sensitivity: "base" }))
    .slice(0, Math.max(0, limit));
}

/**
 * Build area filter chips from live listings: prefer locality, else city, grouped by frequency.
 */
export function buildAreaFilterOptions(properties: Property[]): AreaOption[] {
  const counts = new Map<string, number>();
  for (const p of properties) {
    const label = p.locality?.trim() || p.city?.trim();
    if (!label) continue;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

/** Whether a listing matches the selected area chip (exact on structured fields, else substring on full location). */
export function matchesAreaFilter(property: Property, selectedArea: string): boolean {
  if (selectedArea === "All Localities") return true;
  const q = selectedArea.trim().toLowerCase();
  if (!q) return true;
  if (property.locality?.trim().toLowerCase() === q) return true;
  if (property.city?.trim().toLowerCase() === q) return true;
  return property.location.toLowerCase().includes(q);
}
