"use client";

import Image from "next/image";
import { Search, MapPin, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { SITE_NAME } from "@/lib/branding";

const HeroSection = () => {
  const [searchType, setSearchType] = useState<"rent" | "buy">("rent");

  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden sm:min-h-[85vh]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Readable text: dark scrim + subtle gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/75 to-background/55 sm:from-black/80 sm:via-black/55 sm:to-black/35"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent sm:from-black/70 sm:to-transparent" aria-hidden />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-3xl sm:mx-0"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
            {SITE_NAME}
          </p>
          <h1 className="mb-4 font-heading text-3xl font-extrabold leading-[1.12] tracking-tight text-foreground drop-shadow-sm sm:text-5xl md:text-6xl">
            Find your next home
            <span className="text-primary"> — direct </span>
            <span className="text-foreground">from owners</span>
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            Search verified listings, save favourites, and connect without middlemen. Built for clarity on every screen.
          </p>

          {/* Search */}
          <div className="card-shadow max-w-2xl rounded-2xl border border-border/80 bg-card/95 p-3 shadow-2xl backdrop-blur-sm sm:p-4">
            <div className="mb-3 flex w-full gap-1 rounded-xl bg-muted/80 p-1 sm:w-fit">
              <button
                type="button"
                onClick={() => setSearchType("rent")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:flex-initial sm:px-5 ${
                  searchType === "rent"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Home className="h-4 w-4 shrink-0" />
                Rent
              </button>
              <button
                type="button"
                onClick={() => setSearchType("buy")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:flex-initial sm:px-5 ${
                  searchType === "buy"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="h-4 w-4 shrink-0" />
                Buy
              </button>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="City, locality, or landmark…"
                  className="h-12 border-border bg-background pl-10 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button size="lg" className="h-12 shrink-0 gap-2 px-6 sm:px-8">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-4 border-t border-border/60 pt-8 sm:mt-10 sm:flex sm:gap-10 sm:border-0 sm:pt-0"
          >
            {[
              { value: "2M+", label: "Listings" },
              { value: "50L+", label: "Happy users" },
              { value: "₹0", label: "Platform fee" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0 text-center sm:text-left">
                <div className="font-heading text-xl font-bold text-foreground sm:text-2xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
