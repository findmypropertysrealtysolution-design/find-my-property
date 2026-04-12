"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Home } from "lucide-react";
import { motion } from "framer-motion";

/** Same asset + srcset target as Framer reference (`sizes` matches half of (min(100vw, 1200px) − 90px)). */
const HERO_IMG =
  "https://framerusercontent.com/images/oSCsz14veQXmjGyGMAQAK0BUUA.png?width=800&height=1200";

const heroImageSizes =
  "(max-width: 1024px) 100vw, max(calc((min(100vw, 1200px) - 90px) / 2), 1px)";

const HeroSection = () => {
  return (
    <section className="relative bg-white pt-16 dark:bg-background">
      <div className="mx-auto w-full max-w-[1200px] p-4 sm:p-6 md:p-[45px]">
        <div className="grid min-h-[calc(100dvh-20rem)] grid-cols-1 items-stretch gap-10 py-10 lg:grid-cols-2 lg:gap-10 lg:py-0">
          <div className="order-2 flex flex-col justify-center lg:order-1 lg:py-12">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex max-w-[520px] flex-col gap-8 lg:max-w-none"
            >
              {/* Tag container */}
              <div className="inline-flex w-fit items-center rounded-full border border-[#E8E8E8] bg-[#FAFAFA] px-3.5 py-1.5 dark:border-border dark:bg-muted/40">
                <p className="text-center text-[12px] leading-[1.4] tracking-[0.02em] text-[#8A8A8A] dark:text-muted-foreground">
                  Trusted by 1,200+ families
                </p>
              </div>

              {/* H1 + subtitle */}
              <div className="flex flex-col gap-5">
                <h1 className="font-heading text-left text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-[#0A0A0A] dark:text-foreground">
                  Helping Buyers Find Homes and Sellers Get Results
                </h1>
                <p className="max-w-[520px] text-left text-base leading-relaxed text-[#525252] sm:text-[17px] dark:text-muted-foreground">
                  From buying to selling, we handle every step with precision, discretion, and a
                  tailored approach that maximizes your property&apos;s value and potential.
                </p>
              </div>

              {/* Buttons — Framer: inner radius 8px, primary #000 / secondary #fff + #E0E0E0 border */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/browse"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  <Search className="size-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
                  Browse Properties
                </Link>
                <Link
                  href="/add-property"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E0E0E0] bg-white px-5 text-[15px] font-medium text-[#212121] transition-colors hover:bg-[#FAFAFA] dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-muted/50"
                >
                  <Home className="size-[18px] shrink-0" strokeWidth={1.5} aria-hidden />
                  Sell Your Home
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="order-1 relative min-h-[min(380px,48vh)] w-full overflow-hidden rounded-2xl lg:order-2 lg:h-full lg:min-h-0"
          >
            <Image
              src={HERO_IMG}
              alt="Modern luxury house on a hillside surrounded by trees, featuring large glass windows, a terrace, and a small pool at sunset."
              fill
              priority
              className="object-cover object-center"
              sizes={heroImageSizes}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
