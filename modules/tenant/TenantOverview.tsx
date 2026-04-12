"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/skeletons/property-card-skeleton";
import { useProperties } from "@/hooks/use-properties";
import { useAuth } from "@/contexts/auth-context";

const TenantOverview = () => {
  const { user } = useAuth();
  const { data, isLoading } = useProperties();
  const properties = data ?? [];
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
        </h2>
        <p className="text-sm text-muted-foreground">Find your perfect home today</p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground">Recommended For You</h3>
        <Button variant="link" asChild>
          <Link href="/browse"><Search className="w-3.5 h-3.5 mr-1" /> See all</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </>
        ) : (
          properties
            .filter((p) => p.type === "rent")
            .slice(0, 3)
            .map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))
        )}
      </div>
      {!isLoading && properties.filter((p) => p.type === "rent").length === 0 && (
        <p className="text-sm text-muted-foreground">No rentals to show yet.</p>
      )}
    </div>
  );
};

export default TenantOverview;
