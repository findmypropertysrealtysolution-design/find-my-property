import {
  reverseGeocodeToStructured,
  type StructuredLocation,
} from "@/lib/nominatim-reverse-geocode";

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 12_000,
};

export type DetectCurrentLocationOutcome =
  | { status: "success"; data: StructuredLocation }
  /** Coordinates only — reverse geocode failed */
  | { status: "partial"; lat: number; lng: number }
  | { status: "unsupported" }
  | { status: "denied" }
  | { status: "failed"; message?: string };

function geolocationPositionErrorCode(e: unknown): number | undefined {
  return typeof e === "object" && e !== null && "code" in e
    ? Number((e as GeolocationPositionError).code)
    : undefined;
}

/**
 * Gets the device position (browser prompt) and reverse-geocodes via OpenStreetMap Nominatim.
 * Use {@link useDetectCurrentLocation} in React components for pending state.
 */
export async function detectCurrentLocation(): Promise<DetectCurrentLocationOutcome> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return { status: "unsupported" };
  }

  let lat: number;
  let lng: number;
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, GEO_OPTIONS);
    });
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
  } catch (e: unknown) {
    const code = geolocationPositionErrorCode(e);
    if (code === 1) return { status: "denied" };
    return { status: "failed", message: e instanceof Error ? e.message : undefined };
  }

  try {
    const data = await reverseGeocodeToStructured(lat, lng);
    return { status: "success", data };
  } catch {
    return { status: "partial", lat, lng };
  }
}
