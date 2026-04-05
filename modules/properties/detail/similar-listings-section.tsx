"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PropertyCard from "@/components/property/PropertyCard";
import type { Property } from "@/components/property/PropertyCard";

type SimilarListingsSectionProps = {
  properties: Property[];
};

/** Grid of related PropertyCards + link to full catalogue. */
export function SimilarListingsSection({ properties }: SimilarListingsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mt-16"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-foreground">Similar Listings</h2>
        <Link href="/properties" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          See all listing
        </Link>
      </div>
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No similar listings to show.</p>
      )}
    </motion.div>
  );
}
