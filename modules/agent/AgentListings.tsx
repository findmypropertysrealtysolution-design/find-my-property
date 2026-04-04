"use client";

import { motion } from "framer-motion";
import { Plus, MapPin, Bed, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sampleProperties } from "@/data/properties";
import { useMyProperties } from "@/hooks/use-properties";
import { PropertyStatus } from "@/lib/property-mapper";

const AgentListings = () => {
  const { data } = useMyProperties();
  const listings = (data?.length ? data : sampleProperties).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">My Listings</h2>
          <p className="text-sm text-muted-foreground">Manage your property listings</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Property
        </Button>
      </div>

      <div className="grid gap-4">
        {listings.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4"
          >
            <img src={p.image} alt={p.title} className="w-full sm:w-36 h-24 object-cover rounded-lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">{p.title}</h3>
                <Badge variant={p.status === PropertyStatus.APPROVED ? "default" : p.status === PropertyStatus.REJECTED ? "destructive" : "secondary"} className="text-[10px]">
                  {p.status || PropertyStatus.PENDING}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <MapPin className="w-3.5 h-3.5" /> {p.location}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{p.bedrooms} Bed</span>
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{p.bathrooms} Bath</span>
                <span className="font-semibold text-foreground ml-auto">{p.price}{p.priceLabel}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AgentListings;
