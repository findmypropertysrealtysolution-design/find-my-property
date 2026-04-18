/**
 * Shared options for `useJsApiLoader`.
 *
 * Google Maps must be loaded only once per page with the same options, so each
 * page picks the option set matching the features it actually needs. Using the
 * same `id` across sets still lets the SDK cache between navigations.
 */

type MapsLibrary = "drawing" | "geometry" | "places" | "visualization";

const LOADER_ID = "google-maps-api";

/** Default: map + geocoder only (property flows that don't need Places autocomplete). */
export const GOOGLE_MAPS_LOADER_OPTIONS = {
  id: LOADER_ID,
  libraries: [] as MapsLibrary[],
};

/** Service-request flows: enables Places Autocomplete + Directions on the client. */
export const GOOGLE_MAPS_SERVICES_LOADER_OPTIONS = {
  id: LOADER_ID,
  libraries: ["places"] as MapsLibrary[],
};

export function getGoogleMapsLoaderOptions(apiKey: string) {
  return {
    googleMapsApiKey: apiKey,
    ...GOOGLE_MAPS_LOADER_OPTIONS,
  };
}

export function getGoogleMapsServicesLoaderOptions(apiKey: string) {
  return {
    googleMapsApiKey: apiKey,
    ...GOOGLE_MAPS_SERVICES_LOADER_OPTIONS,
  };
}
