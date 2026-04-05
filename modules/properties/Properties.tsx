"use client";

import PropertyCard from "@/modules/properties/PropertyCard";
import { buildPropertyPath } from "@/lib/property-slug";
import { FurnishingStatus } from "@/modules/properties/PropertyCard";
import { PropertyGridSkeleton } from "@/components/skeletons/property-grid-skeleton";
import { useProperties } from "@/hooks/use-properties";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X, Map, LayoutGrid } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import PropertiesMap from "@/modules/properties/PropertiesMap";
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
  const { data, isLoading } = useProperties();
  const { isAuthenticated } = useAuth();
  const allProperties = data ?? [];
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  const isFiltered = activeFilterCount > 0;

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

  const renderFilterFields = () => (
    <>
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

      <div className="rounded-xl bg-card border border-border p-4">
        <Label className="text-sm font-medium text-foreground mb-3 block">Location</Label>
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

      <div className="rounded-xl bg-card border border-border p-4">
        <Label className="text-sm font-medium text-foreground mb-3 block">Listing Type</Label>
        <div className="flex flex-wrap gap-2">
          {(["rent", "buy"] as const).map((type) => (
            <button
              key={type}
              type="button"
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
            type="button"
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

      <div className="rounded-xl bg-card border border-border p-4">
        <Label className="text-sm font-medium text-foreground mb-3 block">Bedroom</Label>
        <div className="flex flex-wrap gap-2">
          {bhkOptions.map((bhk) => (
            <button
              key={bhk}
              type="button"
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
            type="button"
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

      <div className="rounded-xl bg-card border border-border p-4">
        <Label className="text-sm font-medium text-foreground mb-3 block">Budget</Label>
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

      <div className="rounded-xl bg-card border border-border p-4">
        <Label className="text-sm font-medium text-foreground mb-3 block">Furnishing</Label>
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
    </>
  );

  const viewModeGroup = (
    <div
      className="flex shrink-0 flex-nowrap rounded-lg border border-border bg-muted/50 p-0.5"
      role="group"
      aria-label="View mode"
    >
      <Button
        type="button"
        variant={viewMode === "list" ? "secondary" : "ghost"}
        size="sm"
        className="shrink-0 rounded-md"
        onClick={() => setViewMode("list")}
        aria-pressed={viewMode === "list"}
      >
        <LayoutGrid className="mr-1.5 h-4 w-4" />
        List
      </Button>
      <Button
        type="button"
        variant={viewMode === "map" ? "secondary" : "ghost"}
        size="sm"
        className="shrink-0 rounded-md"
        onClick={() => setViewMode("map")}
        aria-pressed={viewMode === "map"}
      >
        <Map className="mr-1.5 h-4 w-4" />
        Map
      </Button>
    </div>
  );

  const filterCardHeader = (
    <section className="flex items-center justify-between border-b border-border bg-background/80 px-5 py-4">
      <div>
        <h2 className="font-heading text-lg font-semibold text-foreground">Filters</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {isFiltered ? "Filtered view — results match your choices" : "Showing all listings"}
        </p>
      </div>
      {activeFilterCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {activeFilterCount} active
        </Badge>
      )}
    </section>
  );

  const filterCardFooter = (
    <section className="border-t border-border bg-background/80 px-4 pb-4 pt-3">
      <Button
        variant={isFiltered ? "default" : "outline"}
        className="w-full rounded-xl sm:w-auto"
        onClick={clearFilters}
        disabled={!isFiltered}
      >
        <X className="mr-2 h-4 w-4" />
        {isFiltered ? "Clear all filters" : "No filters applied"}
      </Button>
    </section>
  );

  const activeFilterBadges =
    activeFilterCount > 0 ? (
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {selectedBHK.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            {selectedBHK.join(", ")} BHK
            <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedBHK([])} />
          </Badge>
        )}
        {locality !== "All Localities" && (
          <Badge variant="secondary" className="gap-1">
            {locality}
            <X className="h-3 w-3 cursor-pointer" onClick={() => setLocality("All Localities")} />
          </Badge>
        )}
        {selectedFurnishing.length > 0 && (
          <Badge variant="secondary" className="gap-1">
            {selectedFurnishing.join(", ")}
            <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedFurnishing([])} />
          </Badge>
        )}
      </div>
    ) : null;

  const resultsBlock = (
    <>
      {isLoading ? (
        <PropertyGridSkeleton count={6} columns="list" />
      ) : filtered.length > 0 ? (
        <>
          {viewMode === "list" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((property, i) => (
                <div
                  key={property.id}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(buildPropertyPath(property.id, property.title));
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
              onPropertyClick={(p) => router.push(buildPropertyPath(p.id, p.title))}
            />
          )}
        </>
      ) : (
        <div className="py-20 text-center">
          <SlidersHorizontal className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="font-heading mb-2 text-xl font-semibold text-foreground">No properties found</h3>
          <p className="mb-4 text-muted-foreground">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className={isAuthenticated ? "pb-12" : "pb-20 pt-24"}>
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <div className="container mx-auto">
          {/* Mobile & tablet: filters button + list/map */}
            <div className="mb-4 flex flex-col gap-3 lg:hidden">
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant={isFiltered ? "default" : "outline"}
                size="sm"
                className="shrink-0 gap-2"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>{isFiltered ? "Edit filters" : "Filters"}</span>
                {activeFilterCount > 0 ? (
                  <Badge variant="secondary" className="border border-background/20 text-xs">
                    {activeFilterCount}
                  </Badge>
                ) : null}
              </Button>
              {viewModeGroup}
            </div>
            <p className="min-w-0 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
              <span className="text-foreground">{allProperties.length}</span> properties
              {isFiltered ? (
                <span className="ml-1.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  filtered
                </span>
              ) : (
                <span className="ml-1.5 text-xs">(all)</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <aside className="hidden min-w-0 lg:block">
              <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
                {filterCardHeader}
                <section className="grid grid-cols-1 gap-4 p-4">{renderFilterFields()}</section>
                {filterCardFooter}
              </div>
            </aside>

            <div className="min-w-0 lg:col-span-2">
              {isFiltered && (
                <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
                  <span className="font-medium">Filtered results</span>
                  <span className="text-muted-foreground">
                    {filtered.length} of {allProperties.length} properties match
                  </span>
                </div>
              )}
              <div className="mb-4 hidden flex-row items-center justify-between gap-3 lg:flex">
                <p className="min-w-0 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
                  <span className="text-foreground">{allProperties.length}</span> shown
                  {!isFiltered ? <span className="ml-1 text-xs">(no filters)</span> : null}
                </p>
                {viewModeGroup}
              </div>
              {activeFilterBadges}
              {resultsBlock}
            </div>
          </div>
        </div>

        <SheetContent
          side="left"
          className="flex w-full max-w-md flex-col gap-0 overflow-hidden p-0 sm:max-w-lg lg:hidden"
        >
          <SheetHeader className="border-b border-border px-4 py-4 text-left">
            <SheetTitle className="font-heading">Filters</SheetTitle>
            {activeFilterCount > 0 ? (
              <Badge variant="secondary" className="mt-2 w-fit text-xs">
                {activeFilterCount} active
              </Badge>
            ) : null}
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-1 gap-4">{renderFilterFields()}</div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 border-t border-border bg-background/95 px-4 py-4">
            <Button
              variant={isFiltered ? "default" : "outline"}
              className="w-full rounded-xl"
              onClick={() => {
                clearFilters();
                setFiltersOpen(false);
              }}
              disabled={!isFiltered}
            >
              <X className="mr-2 h-4 w-4" /> {isFiltered ? "Clear all filters" : "No filters to clear"}
            </Button>
            <Button className="w-full" onClick={() => setFiltersOpen(false)}>
              {isFiltered ? `Show ${filtered.length} filtered results` : "Show all results"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Properties;
