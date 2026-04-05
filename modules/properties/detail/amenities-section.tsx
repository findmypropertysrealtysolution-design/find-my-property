"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

type AmenitiesSectionProps = {
  amenities: string[];
};

/** Grid of amenity labels from the listing. */
export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="mb-4 font-heading text-base font-semibold text-foreground">Amenities & Features</h2>
      {amenities.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Plus className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{amenity}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No amenities listed for this property.</p>
      )}
    </motion.div>
  );
}
