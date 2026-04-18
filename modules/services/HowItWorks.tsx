"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface HowItWorksStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface HowItWorksProps {
  heading: string;
  subheading?: string;
  steps: HowItWorksStep[];
}

export function HowItWorks({ heading, subheading, steps }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="bg-muted/30 py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            {heading}
          </h2>
          {subheading ? (
            <p className="mx-auto max-w-xl text-muted-foreground">
              {subheading}
            </p>
          ) : null}
        </div>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" aria-hidden />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 font-heading font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
