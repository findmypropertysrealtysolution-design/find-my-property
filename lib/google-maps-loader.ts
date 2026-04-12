/**
 * Single shared options for useJsApiLoader.
 * Google Maps must be loaded only once per page with the same options.
 * Use this in every component that calls useJsApiLoader.
 */
export const GOOGLE_MAPS_LOADER_OPTIONS = {
  id: "google-maps-api",
  /** No extra libraries — map + geocoder only (Places autocomplete removed). */
  libraries: [] as ("drawing" | "geometry" | "places" | "visualization")[],
};

export function getGoogleMapsLoaderOptions(apiKey: string) {
  return {
    googleMapsApiKey: apiKey,
    ...GOOGLE_MAPS_LOADER_OPTIONS,
  };
}
