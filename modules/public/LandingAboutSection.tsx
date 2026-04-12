"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/branding";

export function LandingAboutSection() {
  return (
    <section className="border-y border-border bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-lg"
          >
            <Image
              src="/images/hero-bg.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 50vw"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" /> */}
            <p className="absolute bottom-6 left-6 right-6 font-heading text-xl font-bold text-primary-foreground drop-shadow-md md:text-2xl">
              Built for renters, owners, and agents — without the noise.
            </p>
          </motion.div>

          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">About us</p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              We&apos;re making property search feel human again
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {SITE_NAME} started from a simple idea: you should see real listings, talk to real people, and move
              forward without wading through spam or opaque fees. We combine careful verification with tools that keep
              owners, tenants, and agents on the same page.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              <li className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">Clarity first</p>
                  <p className="mt-1 text-xs text-muted-foreground">Pricing and location details you can trust.</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <HeartHandshake className="h-5 w-5 text-primary" aria-hidden />
                </div>
                <div>
                  <p className="font-heading text-sm font-semibold text-foreground">Direct lines</p>
                  <p className="mt-1 text-xs text-muted-foreground">Fewer hand-offs, faster decisions.</p>
                </div>
              </li>
            </ul>
            <Button variant="outline" size="lg" asChild className="rounded-xl">
              <Link href="/about">
                Our story &amp; team <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
