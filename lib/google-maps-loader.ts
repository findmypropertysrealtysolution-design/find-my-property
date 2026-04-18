/**
 * Shared options for `useJsApiLoader` / `<LoadScript>`.
 *
 * `@react-google-maps/api` enforces a singleton Loader: **every** `useJsApiLoader`
 * call on the page must be invoked with the same options (same `id`, same
 * `libraries`, same `version`, etc). If two components pass different option
 * sets you get:
 *   "Loader must not be called again with different options"
 *
 * We therefore standardize on a single option object that includes the
 * superset of libraries any feature might need (`places` for autocomplete in
 * the service-request flows). Adding an unused library has a tiny one-time
 * network cost and eliminates a whole class of production-only crashes caused
 * by navigating between pages that each thought they only needed a subset.
 */

type MapsLibrary = "drawing" | "geometry" | "places" | "visualization";

const LOADER_ID = "google-maps-api";

/** Canonical loader options. Do **not** create variants — every map surface
 * in the app must funnel through this so the Loader singleton stays happy. */
export const GOOGLE_MAPS_LOADER_OPTIONS = {
  id: LOADER_ID,
  libraries: ["places"] as MapsLibrary[],
};

export function getGoogleMapsLoaderOptions(apiKey: string) {
  return {
    googleMapsApiKey: apiKey,
    ...GOOGLE_MAPS_LOADER_OPTIONS,
  };
}

/**
 * @deprecated Alias kept for call-site compatibility. Always resolves to
 * {@link getGoogleMapsLoaderOptions} so every consumer shares one option set.
 */
export const getGoogleMapsServicesLoaderOptions = getGoogleMapsLoaderOptions;

/** @deprecated Use {@link GOOGLE_MAPS_LOADER_OPTIONS}. */
export const GOOGLE_MAPS_SERVICES_LOADER_OPTIONS = GOOGLE_MAPS_LOADER_OPTIONS;
