"use client";

import { useCallback, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGoogleMapsLoaderOptions } from "@/lib/google-maps-loader";
import type { Property } from "@/components/PropertyCard";

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };
const DEFAULT_ZOOM = 11;

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: 400,
  borderRadius: 12,
};

export interface PropertiesMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  className?: string;
  height?: number;
}

const PropertiesMap = ({
  properties,
  onPropertyClick,
  className,
  height = 480,
}: PropertiesMapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader(getGoogleMapsLoaderOptions(apiKey));

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const fitAllProperties = useCallback(() => {
    const withCoords = properties.filter((p) => p.lat != null && p.lng != null);
    if (withCoords.length === 0 || !mapRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    withCoords.forEach((p) => bounds.extend({ lat: p.lat!, lng: p.lng! }));
    mapRef.current.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  }, [properties]);

  const zoomIn = useCallback(() => {
    if (mapRef.current) {
      const z = mapRef.current.getZoom() ?? DEFAULT_ZOOM;
      mapRef.current.setZoom(Math.min(21, z + 1));
      setZoom(Math.min(21, z + 1));
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (mapRef.current) {
      const z = mapRef.current.getZoom() ?? DEFAULT_ZOOM;
      mapRef.current.setZoom(Math.max(1, z - 1));
      setZoom(Math.max(1, z - 1));
    }
  }, []);

  if (!apiKey) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-muted/30 flex items-center justify-center p-8 text-sm text-muted-foreground",
          className
        )}
        style={{ height }}
      >
        Add NEXT_PUBLIC_GOOGLE_MAP_KEY to enable the map.
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-destructive/10 text-destructive flex items-center justify-center p-8 text-sm",
          className
        )}
        style={{ height }}
      >
        Failed to load map.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-muted/30 flex items-center justify-center text-muted-foreground text-sm",
          className
        )}
        style={{ height }}
      >
        Loading map…
      </div>
    );
  }

  const withCoords = properties.filter((p) => p.lat != null && p.lng != null);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">
          Zoom: {zoom} | {withCoords.length} propert{withCoords.length === 1 ? "y" : "ies"}
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={fitAllProperties}>
            <Maximize2 className="w-4 h-4 mr-1" /> Fit All Properties
          </Button>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button type="button" variant="ghost" size="icon" className="rounded-none" onClick={zoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="rounded-none border-l border-border" onClick={zoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden border border-border" style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ ...containerStyle, height, minHeight: height }}
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: false,
          }}
        >
          {withCoords.map((p) => {
            const label =
              p.priceValue >= 10000000
                ? `₹${(p.priceValue / 10000000).toFixed(1)}Cr`
                : p.priceValue >= 1000
                  ? `₹${(p.priceValue / 1000).toFixed(0)}K`
                  : `₹${p.priceValue}`;
            return (
              <Marker
                key={p.id}
                position={{ lat: p.lat!, lng: p.lng! }}
                label={{
                  text: label.length > 8 ? label.slice(0, 7) + "…" : label,
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
                title={p.title}
                onClick={() => onPropertyClick?.(p)}
                cursor="pointer"
              />
            );
          })}
        </GoogleMap>
      </div>
    </div>
  );
};

export default PropertiesMap;
