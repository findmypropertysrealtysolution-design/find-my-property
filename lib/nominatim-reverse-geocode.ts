import type { AddressComponents } from "@/modules/properties/LocationPicker";

const NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse";

/** Subset of Nominatim `address` object we read from reverse responses */
export interface NominatimAddress {
  house_number?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  country?: string;
}

export interface NominatimReverseJson {
  display_name?: string;
  address?: NominatimAddress;
}

/**
 * Maps a Nominatim reverse-geocode JSON payload to {@link AddressComponents}
 * (aligned with add-property / LocationPicker structured fields).
 */
export function nominatimJsonToAddressComponents(data: NominatimReverseJson): AddressComponents {
  const a = data.address;
  const street = [a?.house_number, a?.road].filter(Boolean).join(" ").trim();
  const city = a?.city || a?.town || a?.village || a?.county || "";
  const locality =
    a?.suburb ||
    a?.neighbourhood ||
    a?.quarter ||
    a?.city_district ||
    (a?.village && a.village !== city ? a.village : "") ||
    city;
  const addressLine =
    street ||
    data.display_name?.split(",").slice(0, 2).join(", ").trim() ||
    data.display_name ||
    "";
  return {
    address: addressLine || undefined,
    locality: locality || city || undefined,
    city: city || undefined,
    state: a?.state || undefined,
    country: a?.country || undefined,
  };
}

export async function fetchNominatimReverseJson(lat: number, lng: number): Promise<NominatimReverseJson> {
  const url = `${NOMINATIM_REVERSE}?format=jsonv2&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Nominatim HTTP ${response.status}`);
  return (await response.json()) as NominatimReverseJson;
}

/** Coordinates + single display line + structured fields for forms */
export interface StructuredLocation {
  lat: number;
  lng: number;
  /** Raw `display_name` from Nominatim — useful for onboarding single address field */
  displayName: string;
  structured: AddressComponents;
}

export async function reverseGeocodeToStructured(lat: number, lng: number): Promise<StructuredLocation> {
  const json = await fetchNominatimReverseJson(lat, lng);
  return {
    lat,
    lng,
    displayName: json.display_name?.trim() || "",
    structured: nominatimJsonToAddressComponents(json),
  };
}
