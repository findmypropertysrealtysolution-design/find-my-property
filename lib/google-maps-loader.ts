/**
 * Single shared options for useJsApiLoader.
 * Google Maps must be loaded only once per page with the same options.
 * Use this in every component that calls useJsApiLoader.
 */
export const GOOGLE_MAPS_LOADER_OPTIONS = {
  id: "google-maps-api",
  /** Mutable tuple for `@react-google-maps/api` `useJsApiLoader` typing */
  libraries: ["places"] as ("places")[],
};

export function getGoogleMapsLoaderOptions(apiKey: string) {
  return {
    googleMapsApiKey: apiKey,
    ...GOOGLE_MAPS_LOADER_OPTIONS,
  };
}
