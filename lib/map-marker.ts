/**
 * Theme-aware Google Maps marker symbols.
 *
 * Google Maps' Symbol API rasterises an SVG path against a `fillColor` string,
 * and that string must be a concrete CSS color the renderer can parse — `oklch()`
 * tokens (which our design system uses for `--primary`) won't work. We mirror
 * the brand color into a plain hex CSS variable (`--map-marker`) and read it at
 * runtime so the pin automatically follows the active light/dark theme without
 * any per-component plumbing.
 */

const FALLBACK_FILL = "#1f8773";
const FALLBACK_FOREGROUND = "#ffffff";

/** Material-style teardrop pin, 24×34 viewbox. Tip at (12, 34), head at (12, 12). */
const PIN_PATH =
  "M 12 0 C 5.4 0 0 5.4 0 12 c 0 9 12 22 12 22 s 12 -13 12 -22 c 0 -6.6 -5.4 -12 -12 -12 z";

function readVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return raw || fallback;
}

export interface ThemePinColors {
  fill: string;
  foreground: string;
}

/** Snapshot the current theme's marker colors (hex). Safe in SSR. */
export function getThemePinColors(): ThemePinColors {
  return {
    fill: readVar("--map-marker", FALLBACK_FILL),
    foreground: readVar("--map-marker-foreground", FALLBACK_FOREGROUND),
  };
}

export interface ThemeMarkerOptions {
  /** Visual scale; `1` ≈ 24×34px. */
  scale?: number;
  /** When `true`, anchor a `Marker.label` inside the pin head (e.g. price chips). */
  withLabel?: boolean;
  /** Override the fill color (defaults to `--map-marker`). */
  fill?: string;
  /** Override the stroke color (defaults to `--map-marker-foreground`). */
  stroke?: string;
}

/**
 * Build a `google.maps.Symbol` for a teardrop pin in the current theme color.
 * Returns `undefined` until the Maps SDK is loaded so callers can spread it
 * into JSX without crashing during SSR / hydration.
 */
export function getThemeMarkerSymbol(
  opts: ThemeMarkerOptions = {},
): google.maps.Symbol | undefined {
  if (typeof window === "undefined" || !window.google?.maps) return undefined;
  const { scale = 1, withLabel = false } = opts;
  const { fill, foreground } = getThemePinColors();
  return {
    path: PIN_PATH,
    fillColor: opts.fill ?? fill,
    fillOpacity: 1,
    strokeColor: opts.stroke ?? foreground,
    strokeWeight: 1.5,
    scale,
    anchor: new google.maps.Point(12, 34),
    ...(withLabel ? { labelOrigin: new google.maps.Point(12, 12) } : {}),
  };
}
