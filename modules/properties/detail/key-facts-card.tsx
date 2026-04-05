"use client";

import { motion } from "framer-motion";
import { Bath, Bed, Calendar, Square } from "lucide-react";
import type { Property } from "@/components/property/PropertyCard";

type KeyFactsCardProps = {
  property: Pick<Property, "bedrooms" | "bathrooms" | "area" | "yearBuilt">;
};

/** Compact grid: beds, baths, area, year built. */
export function KeyFactsCard({ property }: KeyFactsCardProps) {
  const items = [
    { icon: Bed, value: `${property.bedrooms}`, label: "Room" },
    { icon: Bath, value: `${property.bathrooms}+`, label: "Bathrooms" },
    { icon: Square, value: property.area, label: "Area" },
    {
      icon: Calendar,
      value: property.yearBuilt != null ? String(property.yearBuilt) : "—",
      label: "Year Built",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4"
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <item.icon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
