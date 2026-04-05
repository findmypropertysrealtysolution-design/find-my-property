"use client";

import { motion } from "framer-motion";
import { Heart, Bell, Eye, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyCardSkeleton } from "@/components/skeletons/property-card-skeleton";
import { useProperties } from "@/hooks/use-properties";
import { useAuth } from "@/contexts/auth-context";

/** No backend APIs yet — show placeholders instead of fake counts */
const stats = [
  { label: "Saved Properties", value: "—", icon: Heart },
  { label: "Active Alerts", value: "—", icon: Bell },
  { label: "Recently Viewed", value: "—", icon: Eye },
  { label: "Applications", value: "—", icon: Building2 },
];

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
        <p className="mt-2 text-xs text-muted-foreground/90">
          Dashboard stats (saved, alerts, history) are not connected to the API yet.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-4 border border-border text-center"
          >
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground">Recommended For You</h3>
        <Button variant="link" asChild>
          <Link href="/properties"><Search className="w-3.5 h-3.5 mr-1" /> See all</Link>
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
