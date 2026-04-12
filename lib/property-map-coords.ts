import type { Property } from "@/lib/property-view-model";

/** Bangalore — matches `PropertiesMap` / `LocationPicker` default. */
export const MAP_DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

/**
 * Stable pseudo-coordinates when the API has no lat/lng so the browse map can still show markers.
 * Spread is a few km so pins do not stack on one pixel.
 */
function hashToOffset(id: string, location: string): { lat: number; lng: number } {
  const s = `${id}\0${location}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  const t = ((h & 0xffff_ffff) >>> 0) / 0xffff_ffff;
  const a = t * Math.PI * 2;
  const r = 0.015 + ((h >>> 8) & 0xff) / 0xff * 0.035;
  return {
    lat: MAP_DEFAULT_CENTER.lat + r * Math.cos(a),
    lng: MAP_DEFAULT_CENTER.lng + r * Math.sin(a) * 1.15,
  };
}

export type MarkerPosition = { lat: number; lng: number; approximate: boolean };

/** Resolve where to draw a listing on the map (real coords or deterministic fallback). */
export function getMarkerPosition(property: Property): MarkerPosition {
  const { lat, lng } = property;
  if (
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  ) {
    return { lat, lng, approximate: false };
  }
  const o = hashToOffset(property.id, property.location || "");
  return { lat: o.lat, lng: o.lng, approximate: true };
}
