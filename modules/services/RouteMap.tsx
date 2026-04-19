"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getGoogleMapsServicesLoaderOptions } from "@/lib/google-maps-loader";
import { getThemeMarkerSymbol } from "@/lib/map-marker";
import { cn } from "@/lib/utils";
import type { Stop } from "@/lib/api";

interface RouteMapProps {
  pickup: Stop | null | undefined;
  drops: Stop[] | null | undefined;
  height?: number;
  className?: string;
}

/**
 * Admin-facing route visualisation.
 *
 * Requests a Directions route via the client-side Maps JS SDK (so we pay no
 * billable Directions request until an admin actually expands the sheet).
 * When the Directions call fails we degrade to showing numbered markers
 * for each stop, which is always useful for dispatch regardless.
 */
export default function RouteMap({
  pickup,
  drops,
  height = 320,
  className,
}: RouteMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader(
    getGoogleMapsServicesLoaderOptions(apiKey),
  );

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const lastSigRef = useRef<string>("");

  const routeSignature = useMemo(() => {
    if (!pickup || !drops?.length) return "";
    return [
      `${pickup.lat.toFixed(5)},${pickup.lng.toFixed(5)}`,
      ...drops.map((d) => `${d.lat.toFixed(5)},${d.lng.toFixed(5)}`),
    ].join("|");
  }, [pickup, drops]);

  const requestDirections = useCallback(() => {
    if (!isLoaded || !pickup || !drops?.length) return;
    if (!window.google?.maps?.DirectionsService) return;
    if (routeSignature === lastSigRef.current) return;
    // Single-stop-at-origin case (e.g. P&C): nothing meaningful to route.
    const isSelfRoute =
      drops.length === 1 &&
      Math.abs(drops[0].lat - pickup.lat) < 1e-6 &&
      Math.abs(drops[0].lng - pickup.lng) < 1e-6;
    if (isSelfRoute) {
      setDirections(null);
      setDirectionsError(null);
      lastSigRef.current = routeSignature;
      return;
    }
    lastSigRef.current = routeSignature;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: pickup.lat, lng: pickup.lng },
        destination: {
          lat: drops[drops.length - 1].lat,
          lng: drops[drops.length - 1].lng,
        },
        waypoints: drops.slice(0, -1).map((d) => ({
          location: { lat: d.lat, lng: d.lng },
          stopover: true,
        })),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
          setDirectionsError(null);
        } else {
          setDirections(null);
          setDirectionsError(status);
        }
      },
    );
  }, [isLoaded, pickup, drops, routeSignature]);

  useEffect(() => {
    requestDirections();
  }, [requestDirections]);

  const fallbackCenter = useMemo(() => {
    if (pickup) return { lat: pickup.lat, lng: pickup.lng };
    return { lat: 12.9716, lng: 77.5946 };
  }, [pickup]);

  if (!apiKey) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground",
          className,
        )}
        style={{ height }}
      >
        Map unavailable (missing Google Maps key).
      </div>
    );
  }
  if (loadError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-xs text-destructive",
          className,
        )}
        style={{ height }}
      >
        Could not load Google Maps.
      </div>
    );
  }
  if (!isLoaded) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground",
          className,
        )}
        style={{ height }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height }}
        center={fallbackCenter}
        zoom={11}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          clickableIcons: false,
        }}
      >
        {directions ? (
          <DirectionsRenderer
            options={{
              directions,
              suppressMarkers: false,
              preserveViewport: false,
            }}
          />
        ) : (
          <>
            {pickup ? (
              <Marker
                position={{ lat: pickup.lat, lng: pickup.lng }}
                icon={getThemeMarkerSymbol({ scale: 1.3, withLabel: true })}
                label={{ text: "P", color: "white", fontSize: "11px", fontWeight: "bold" }}
              />
            ) : null}
            {(drops ?? []).map((d, i) => (
              <Marker
                key={i}
                position={{ lat: d.lat, lng: d.lng }}
                icon={getThemeMarkerSymbol({ scale: 1.3, withLabel: true })}
                label={{
                  text: String(i + 1),
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              />
            ))}
          </>
        )}
      </GoogleMap>
      {directionsError ? (
        <p className="border-t border-border bg-muted/30 px-3 py-1.5 text-[11px] text-muted-foreground">
          Route preview unavailable ({directionsError}). Markers shown instead.
        </p>
      ) : null}
    </div>
  );
}
