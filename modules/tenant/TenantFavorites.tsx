"use client";

import { Heart } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/skeletons/property-card-skeleton";
import { useProperties } from "@/hooks/use-properties";

const TenantFavorites = () => {
  const { data, isLoading } = useProperties();
  const favorites = (data ?? []).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">My Favorites</h2>
        <p className="text-sm text-muted-foreground">Properties you have saved</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
          <PropertyCardSkeleton />
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No saved properties yet</p>
        </div>
      )}
    </div>
  );
};

export default TenantFavorites;
