"use client";

import { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGoogleMapsLoaderOptions } from "@/lib/google-maps-loader";

export interface SearchLocationResult {
  /** Main text to filter by (e.g. locality or formatted address) */
  searchText: string;
  lat?: number;
  lng?: number;
  formattedAddress?: string;
}

export interface SearchLocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (result: SearchLocationResult) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const SearchLocationInput = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter city, address, or place...",
  className,
  id,
}: SearchLocationInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ?? "";
  const { isLoaded } = useJsApiLoader(getGoogleMapsLoaderOptions(apiKey));

  useEffect(() => {
    if (!isLoaded || !apiKey || !inputRef.current || !window.google?.maps?.places) return;
    const input = inputRef.current;
    autocompleteRef.current = new google.maps.places.Autocomplete(input, {
      fields: ["geometry", "address_components", "formatted_address", "name"],
      types: ["(regions)"],
    });
    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place) return;
      const loc = place.geometry?.location;
      const lat = loc?.lat();
      const lng = loc?.lng();
      const formatted = place.formatted_address ?? place.name ?? "";
      const components = place.address_components ?? [];
      const locality =
        components.find((c) => c.types.includes("locality"))?.long_name ||
        components.find((c) => c.types.includes("sublocality"))?.long_name ||
        formatted;
      const searchText = locality || formatted;
      onChange(searchText);
      onPlaceSelect?.({
        searchText,
        lat: lat != null ? lat : undefined,
        lng: lng != null ? lng : undefined,
        formattedAddress: formatted || undefined,
      });
    });
    return () => {
      if (typeof listener?.remove === "function") listener.remove();
      autocompleteRef.current = null;
    };
  }, [isLoaded, apiKey, onChange, onPlaceSelect]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        id={id}
        type="text"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-background border-border"
      />
    </div>
  );
};

export default SearchLocationInput;
