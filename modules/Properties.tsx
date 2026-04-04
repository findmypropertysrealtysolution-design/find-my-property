"use client";

import PropertyCard from "@/components/property/PropertyCard";
import { FurnishingStatus } from "@/components/property/PropertyCard";
import { sampleProperties } from "@/data/properties";
import { useProperties } from "@/hooks/use-properties";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Map, LayoutGrid } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PropertiesMap from "@/components/property/PropertiesMap";
import { useAuth } from "@/contexts/auth-context";

const localities = [
  "All Localities",
  "Whitefield",
  "HSR Layout",
  "Koramangala",
  "Indiranagar",
  "Electronic City",
  "MG Road",
];

const bhkOptions = [1, 2, 3, 4] as const;
const furnishingOptions: { value: FurnishingStatus; label: string }[] = [
  { value: "furnished", label: "Furnished" },
  { value: "semi-furnished", label: "Semi-Furnished" },
  { value: "unfurnished", label: "Unfurnished" },
];

/** Budget presets (min, max) for pill selection. Label shown in UI. */
const budgetRanges: { label: string; min: number; max: number }[] = [
  { label: "Under ₹25K", min: 0, max: 25000 },
  { label: "₹25K - ₹50K", min: 25000, max: 50000 },
  { label: "₹50K - ₹1 Lac", min: 50000, max: 100000 },
  { label: "₹1 Lac+", min: 100000, max: 999999999 },
];

const Properties = () => {
  const { data } = useProperties();
  const { isAuthenticated } = useAuth();
  const allProperties = data?.length ? data : sampleProperties;
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "rent" | "buy">("all");
  const [search, setSearch] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedBHK, setSelectedBHK] = useState<number[]>([]);
  const [locality, setLocality] = useState("All Localities");
  const [selectedFurnishing, setSelectedFurnishing] = useState<FurnishingStatus[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000000]);
  const [selectedBudgetPreset, setSelectedBudgetPreset] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const maxPrice = useMemo(() => {
    if (allProperties.length === 0) return 1_000_000;
    return Math.max(...allProperties.map((p) => p.priceValue));
  }, [allProperties]);

  const activeFilterCount = [
    selectedBHK.length > 0,
    locality !== "All Localities",
    selectedFurnishing.length > 0,
    priceRange[0] > 0 || priceRange[1] < maxPrice,
    !!search,
    !!searchLocation,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedBHK([]);
    setLocality("All Localities");
    setSelectedFurnishing([]);
    setPriceRange([0, maxPrice]);
    setSelectedBudgetPreset(null);
    setSearch("");
    setSearchLocation("");
    setFilter("all");
  };

  const selectBudgetPreset = (preset: (typeof budgetRanges)[number]) => {
    setPriceRange([preset.min, preset.max]);
    setSelectedBudgetPreset(preset.label);
  };
  const isBudgetPresetActive = (preset: (typeof budgetRanges)[number]) =>
    selectedBudgetPreset === preset.label ||
    (priceRange[0] === preset.min && priceRange[1] === preset.max);

  const toggleBHK = (bhk: number) => {
    setSelectedBHK((prev) =>
      prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]
    );
  };

  const toggleFurnishing = (status: FurnishingStatus) => {
    setSelectedFurnishing((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)} Lac`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  const filtered = allProperties.filter((p) => {
    const matchType = filter === "all" || p.type === filter;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchSearchLocation =
      !searchLocation ||
      p.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchBHK = selectedBHK.length === 0 || selectedBHK.includes(p.bedrooms);
    const matchLocality =
      locality === "All Localities" ||
      p.location.toLowerCase().includes(locality.toLowerCase());
    const matchFurnishing =
      selectedFurnishing.length === 0 || selectedFurnishing.includes(p.furnishing);
    const matchPrice = p.priceValue >= priceRange[0] && p.priceValue <= priceRange[1];
    return matchType && matchSearch && matchSearchLocation && matchBHK && matchLocality && matchFurnishing && matchPrice;
  });

  const mainContent = (
    <div className={isAuthenticated ? "pt-6 pb-12" : "pt-24 pb-20"}>
      <div className="container mx-auto px-4">
          <div className="mb-6 rounded-2xl border border-border bg-muted/30 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background/80">
              <h2 className="font-heading font-semibold text-foreground text-lg">Filters</h2>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {/* Single search: name or location */}
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Label className="text-sm font-medium text-foreground mb-2 block">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Name or location..."
                        value={search}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSearch(v);
                          setSearchLocation(v);
                        }}
                        className="pl-9 h-9 text-sm bg-muted/50 border-border rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Location - pills */}
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Location
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {localities.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setLocality(loc)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all break-words text-left ${
                            locality === loc
                              ? "bg-foreground text-background"
                              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Listing Type - pills */}
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Listing Type
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {(["rent", "buy"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilter(filter === type ? "all" : type)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            filter === type
                              ? "bg-foreground text-background"
                              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {type === "rent" ? "Rent" : "Sales"}
                        </button>
                      ))}
                      <button
                        onClick={() => setFilter("all")}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          filter === "all"
                            ? "bg-foreground text-background"
                            : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        All
                      </button>
                    </div>
                  </div>

                  {/* Bedroom - pills */}
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Bedroom
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {bhkOptions.map((bhk) => (
                        <button
                          key={bhk}
                          onClick={() => toggleBHK(bhk)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedBHK.includes(bhk)
                              ? "bg-foreground text-background"
                              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {bhk}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          if (selectedBHK.includes(4)) {
                            setSelectedBHK((prev) => prev.filter((b) => b !== 4));
                          } else {
                            setSelectedBHK((prev) => [...prev, 4]);
                          }
                        }}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedBHK.includes(4)
                            ? "bg-foreground text-background"
                            : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        4+
                      </button>
                    </div>
                  </div>

                  {/* Budget - pills */}
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Budget
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {budgetRanges.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            if (isBudgetPresetActive(preset)) {
                              setPriceRange([0, maxPrice]);
                              setSelectedBudgetPreset(null);
                            } else {
                              selectBudgetPreset(preset);
                            }
                          }}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            isBudgetPresetActive(preset)
                              ? "bg-foreground text-background"
                              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Furnishing - pills */}
                  <div className="rounded-xl bg-card border border-border p-4">
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Furnishing
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {furnishingOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleFurnishing(opt.value)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedFurnishing.includes(opt.value)
                              ? "bg-foreground text-background"
                              : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
            </div>

            <div className="px-4 pb-4 border-t border-border bg-background/80">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-xl bg-muted/50 border-border text-foreground hover:bg-muted"
                onClick={clearFilters}
              >
                <X className="w-4 h-4 mr-2" /> Clear Filters
              </Button>
            </div>
          </div>

          <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <p className="text-sm text-muted-foreground min-w-0 truncate">
                  <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                  properties found
                </p>
                <div className="flex rounded-lg border border-border p-0.5 bg-muted/50 shrink-0 flex-nowrap" role="group" aria-label="View mode">
                  <Button
                    type="button"
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-md shrink-0"
                    onClick={() => setViewMode("list")}
                    aria-pressed={viewMode === "list"}
                  >
                    <LayoutGrid className="w-4 h-4 mr-1.5" />
                    List
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "map" ? "secondary" : "ghost"}
                    size="sm"
                    className="rounded-md shrink-0"
                    onClick={() => setViewMode("map")}
                    aria-pressed={viewMode === "map"}
                  >
                    <Map className="w-4 h-4 mr-1.5" />
                    Map
                  </Button>
                </div>
              </div>
                {activeFilterCount > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {selectedBHK.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedBHK.join(", ")} BHK
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setSelectedBHK([])}
                        />
                      </Badge>
                    )}
                    {locality !== "All Localities" && (
                      <Badge variant="secondary" className="gap-1">
                        {locality}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setLocality("All Localities")}
                        />
                      </Badge>
                    )}
                    {selectedFurnishing.length > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedFurnishing.join(", ")}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => setSelectedFurnishing([])}
                        />
                      </Badge>
                    )}
                  </div>
                )}

              {filtered.length > 0 ? (
                <>
                  {viewMode === "list" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filtered.map((property, i) => (
                        <div
                          key={property.id}
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/property/${property.id}`);
                          }}
                        >
                          <PropertyCard property={property} index={i} />
                        </div>
                      ))}
                    </div>
                  )}
                  {viewMode === "map" && (
                    <PropertiesMap
                      properties={filtered}
                      height={520}
                      onPropertyClick={(p) => router.push(`/property/${p.id}`)}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    No properties found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
      </div>
    </div>
  );

  return mainContent;
};

export default Properties;
