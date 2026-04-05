"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

type VideoSectionProps = {
  videoUrl: string;
};

/** External link to listing video tour. */
export function VideoSection({ videoUrl }: VideoSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="mb-3 font-heading text-base font-semibold text-foreground">Video</h2>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        <Play className="h-4 w-4" />
        Open video tour
      </a>
    </motion.div>
  );
}
