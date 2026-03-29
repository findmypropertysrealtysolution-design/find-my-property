"use client";

import Image from "next/image";
import { Search, MapPin, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [searchType, setSearchType] = useState<"rent" | "buy">("rent");

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full">
          <Image
            src="/images/hero-bg.jpg"
            alt="Modern apartments"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-4">
            Find Your Perfect <br />
            <span className="text-primary">Home</span> Without Brokers
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 max-w-xl">
            India&apos;s #1 property platform. Connect directly with owners — zero brokerage, 100% verified listings.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-2 card-shadow max-w-2xl">
            {/* Toggle */}
            <div className="flex gap-1 mb-3 p-1 bg-muted rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setSearchType("rent")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  searchType === "rent"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Home className="w-4 h-4 inline mr-1.5" />
                Rent
              </button>
              <button
                type="button"
                onClick={() => setSearchType("buy")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  searchType === "buy"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-1.5" />
                Buy
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter city, locality, or landmark..."
                  className="pl-10 h-12 bg-secondary border-0 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button size="lg" className="h-12 px-8 gap-2">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-8 mt-10"
          >
            {[
              { value: "2M+", label: "Listings" },
              { value: "50L+", label: "Tenants Served" },
              { value: "₹0", label: "Brokerage" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading font-bold text-2xl text-primary-foreground">{stat.value}</div>
                <div className="text-primary-foreground/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
