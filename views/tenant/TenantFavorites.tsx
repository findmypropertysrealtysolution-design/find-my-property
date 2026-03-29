"use client";

import { Heart } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { sampleProperties } from "@/data/properties";
import { useProperties } from "@/hooks/use-properties";

const TenantFavorites = () => {
  const { data } = useProperties();
  const favorites = (data?.length ? data : sampleProperties).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">My Favorites</h2>
        <p className="text-sm text-muted-foreground">Properties you've saved</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
