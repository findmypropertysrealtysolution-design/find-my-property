"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Link2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGoogleMapsLoaderOptions } from "@/lib/google-maps-loader";

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 }; // Bangalore

export interface LocationValue {
  lat: number;
  lng: number;
}

/** Parsed address from Geocoding API or Places API */
export interface AddressComponents {
  address?: string;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
}

/** Parse address_components from Geocoder result or Place */
function parseAddressComponents(components: google.maps.GeocoderAddressComponent[]): AddressComponents {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name ?? "";
  const streetNumber = get("street_number");
  const route = get("route");
  const sublocality = get("sublocality_level_1") || get("sublocality");
  const locality = get("locality");
  const city = get("administrative_area_level_2") || locality;
  const state = get("administrative_area_level_1");
  const country = get("country");
  const address = [streetNumber, route].filter(Boolean).join(" ") || undefined;
  return {
    address: address || undefined,
    locality: locality || sublocality || undefined,
    city: city || undefined,
    state: state || undefined,
    country: country || undefined,
  };
}

/** Parse lat,lng from common Google Maps URL patterns */
function parseGoogleMapsUrl(url: string): LocationValue | null {
  const trimmed = url.trim();
  const qMatch = trimmed.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }
  const atMatch = trimmed.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  }
  return null;
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: 280,
  borderRadius: 12,
};

export interface LocationPickerProps {
  value: LocationValue | null;
  onChange: (value: LocationValue | null) => void;
  /** When location is set via map/link or place selected, optional callback with parsed address */
  onAddressChange?: (address: AddressComponents | null) => void;
  className?: string;
  height?: number;
  showLinkInput?: boolean;
  /** Show "Search address or place" input (Places Autocomplete) */
  showSearchInput?: boolean;
}

const LocationPicker = ({
  value,
  onChange,
  onAddressChange,
  className,
  height = 320,
  showLinkInput = true,
  showSearchInput = true,
}: LocationPickerProps) => {
  const [linkInput, setLinkInput] = useState("");
  const [linkError, setLinkError] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ?? "";
  const { isLoaded, loadError } = useJsApiLoader(getGoogleMapsLoaderOptions(apiKey));

  const mapCenter = useMemo(
    () => (value ? { lat: value.lat, lng: value.lng } : DEFAULT_CENTER),
    [value]
  );

  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!window.google?.maps?.Geocoder) return;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === "OK" && results?.[0]?.address_components) {
            onAddressChange?.(parseAddressComponents(results[0].address_components));
          } else {
            onAddressChange?.(null);
          }
        }
      );
    },
    [onAddressChange]
  );

  const setLocationAndGeocode = useCallback(
    (loc: LocationValue) => {
      onChange(loc);
      reverseGeocode(loc.lat, loc.lng);
    },
    [onChange, reverseGeocode]
  );

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        setLocationAndGeocode({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }
    },
    [setLocationAndGeocode]
  );

  const handleApplyLink = useCallback(() => {
    const parsed = parseGoogleMapsUrl(linkInput);
    if (parsed) {
      setLocationAndGeocode(parsed);
      setLinkError(false);
      setLinkInput("");
    } else {
      setLinkError(true);
    }
  }, [linkInput, setLocationAndGeocode]);

  // Init Places Autocomplete when script is loaded
  useEffect(() => {
    if (!isLoaded || !showSearchInput || !searchInputRef.current || !window.google?.maps?.places) return;
    const input = searchInputRef.current;
    autocompleteRef.current = new google.maps.places.Autocomplete(input, {
      fields: ["geometry", "address_components", "formatted_address"],
      types: ["address"],
    });
    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry?.location) return;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLocationAndGeocode({ lat, lng });
      if (place.address_components?.length) {
        onAddressChange?.(parseAddressComponents(place.address_components));
      }
      input.value = "";
    });
    return () => {
      if (typeof listener?.remove === "function") listener.remove();
      autocompleteRef.current = null;
    };
  }, [isLoaded, showSearchInput, setLocationAndGeocode, onAddressChange]);

  if (!apiKey) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-muted/30 flex items-center justify-center p-6 text-sm text-muted-foreground",
          className
        )}
        style={{ minHeight: height }}
      >
        Add NEXT_PUBLIC_GOOGLE_MAP_KEY to .env.local to enable the map.
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-destructive/10 text-destructive flex items-center justify-center p-6 text-sm",
          className
        )}
        style={{ minHeight: height }}
      >
        Failed to load map. Check your API key and network.
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
        style={{ minHeight: height }}
      >
        Loading map…
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {showSearchInput && (
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-muted-foreground">
            <Search className="w-3.5 h-3.5" /> Search address or place
          </Label>
          <Input
            ref={searchInputRef}
            placeholder="Start typing an address (e.g. Whitefield, Bengaluru)"
            className="w-full"
            type="text"
            autoComplete="off"
          />
        </div>
      )}
      {showLinkInput && (
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-muted-foreground">
            <Link2 className="w-3.5 h-3.5" /> Paste Google Maps link (optional)
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="https://www.google.com/maps?q=12.97,77.59"
              value={linkInput}
              onChange={(e) => {
                setLinkInput(e.target.value);
                setLinkError(false);
              }}
              className={linkError ? "border-destructive" : ""}
            />
            <button
              type="button"
              onClick={handleApplyLink}
              className="px-3 py-2 rounded-md border border-border bg-muted hover:bg-muted/80 text-sm font-medium whitespace-nowrap"
            >
              Apply
            </button>
          </div>
          {linkError && (
            <p className="text-xs text-destructive">
              Could not read coordinates from this link. Use a link with lat,lng (e.g. ?q=12.97,77.59).
            </p>
          )}
        </div>
      )}
      <div className="relative rounded-xl overflow-hidden border border-border" style={{ height }}>
        <GoogleMap
          mapContainerStyle={{ ...containerStyle, height, minHeight: height }}
          center={mapCenter}
          zoom={value ? 15 : 10}
          onClick={onMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
            clickableIcons: false,
          }}
        >
          {value && <Marker position={{ lat: value.lat, lng: value.lng }} />}
        </GoogleMap>
        <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur text-xs text-muted-foreground px-2 py-1 rounded flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {value ? `${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : "Click on map to set location"}
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
