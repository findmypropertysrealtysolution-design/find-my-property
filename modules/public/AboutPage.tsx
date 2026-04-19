"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/branding";
import { useSettings } from "@/contexts/settings-context";

const milestones = [
  { year: "2024", text: "Platform launched with a focus on verified listings and direct contact." },
  { year: "2025", text: "Expanded tools for agents and owners — approvals, leads, and analytics." },
  { year: "2026", text: "Growing cities across India with the same transparent experience." },
];

const principles = [
  "Listings reviewed for consistency — photos and basics should match reality.",
  "Roles for tenants, owners, and agents so everyone sees the right tools.",
  "No paywall just to ask a question — sign-in gates only where they protect users.",
];

type AboutPageProps = {
  /** SSR-resolved branding used as the source of truth on first paint. */
  siteName?: string;
};

export default function AboutPage({ siteName: ssrSiteName }: AboutPageProps = {}) {
  const { settings } = useSettings();
  const siteName =
    settings?.siteName?.trim() || ssrSiteName?.trim() || SITE_NAME;
  return (
    <main className="pb-20 pt-24">
      <div className="container mx-auto max-w-3xl px-4">
        <Button variant="ghost" size="sm" asChild className="mb-8 -ml-2 text-muted-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
            About {siteName}
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Property search that respects your time
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            We&apos;re building a calmer alternative to noisy listing sites: fewer surprises, clearer ownership of
            conversations, and a product team obsessed with the unglamorous work — verification, permissions, and
            performance on real devices.
          </p>
        </motion.div>

        <section className="mb-16 space-y-4">
          <h2 className="font-heading text-2xl font-semibold text-foreground">What we believe</h2>
          <ul className="space-y-3">
            {principles.map((line) => (
              <li key={line} className="flex gap-3 text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">Timeline</h2>
          <div className="relative border-l-2 border-border pl-8">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative mb-10 last:mb-0"
              >
                <span className="absolute -left-[calc(2rem+5px)] top-1 flex h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <p className="font-heading text-sm font-bold text-primary">{m.year}</p>
                <p className="mt-1 text-muted-foreground">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <h2 className="font-heading text-xl font-semibold text-foreground">Talk to us</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Press, partnerships, or product feedback — we read every message we can.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/contact">Go to contact</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
