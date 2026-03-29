"use client";

import { MapPin, Bed, Bath, Heart, Star, BarChart3, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";

export type FurnishingStatus = "furnished" | "semi-furnished" | "unfurnished";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  priceLabel: string;
  priceValue: number;
  type: "rent" | "buy";
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  images?: string[];
  isVerified?: boolean;
  ownerName?: string;
  furnishing: FurnishingStatus;
  status?: string;
  /** Optional coordinates for map display */
  lat?: number;
  lng?: number;
}

const typeLabels: Record<string, string> = {
  rent: "Rent",
  buy: "Sales",
};

const PropertyCard = ({ property, index = 0 }: { property: Property; index?: number }) => {
  return (
    <Link href={`/property/${property.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        className="group cursor-pointer"
      >
        {/* Image container */}
        <div className="relative overflow-hidden rounded-2xl aspect-4/3 bg-muted">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top-left badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-card/90 text-foreground backdrop-blur-sm border-0 shadow-sm font-medium text-xs px-3 py-1">
              {typeLabels[property.type] || property.type}
            </Badge>
          </div>

          {/* Top-right icons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {property.isVerified && (
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Star className="w-4 h-4 text-accent-foreground fill-current" />
              </div>
            )}
            <button className="w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <BarChart3 className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info below image */}
        <div className="pt-3 space-y-1.5 min-w-0">
          <h3 className="font-heading font-semibold text-foreground text-base leading-tight line-clamp-2 wrap-break-word">
            {property.title}
          </h3>
          <p className="font-heading font-bold text-foreground text-lg wrap-break-word">
            {property.price}
            <span className="text-sm font-normal text-muted-foreground ml-1">{property.priceLabel}</span>
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap gap-y-1">
            <span className="flex items-center gap-1 min-w-0 wrap-break-word">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{property.location.split(",")[0]}</span>
            </span>
            <span className="text-border shrink-0">•</span>
            <span className="flex items-center gap-1 shrink-0">
              <Bed className="w-3.5 h-3.5" /> {property.bedrooms} BHK
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Bath className="w-3.5 h-3.5" /> {property.bathrooms} Bath
            </span>
            <span className="flex items-center gap-1 min-w-0 wrap-break-word">
              <Square className="w-3.5 h-3.5 shrink-0" /> {property.area}
            </span>
          </div>
          <p className="text-xs text-muted-foreground capitalize wrap-break-word">{property.furnishing.replace("-", " ")}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default PropertyCard;
