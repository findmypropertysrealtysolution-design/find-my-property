"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video w-full animate-pulse rounded-xl bg-muted" aria-hidden />
  ),
});

type VideoSectionProps = {
  videoUrl: string;
};

/**
 * Embedded video via react-player. When the block scrolls into view, playback starts automatically
 * (muted — required by browsers for autoplay). User can unmute via native controls.
 */
export function VideoSection({ videoUrl }: VideoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    amount: 0.45,
    margin: "0px 0px -12% 0px",
    once: false,
  });

  /** Sync in-view with playing; user can pause via player — we track that so we don't fight the UI */
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    if (isInView) setUserPaused(false);
  }, [isInView]);

  const playing = isInView && !userPaused;

  const handlePause = useCallback(() => {
    setUserPaused(true);
  }, []);

  const handlePlay = useCallback(() => {
    setUserPaused(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="mb-4 font-heading text-base font-semibold text-foreground">Video tour</h2>
      <div
        ref={containerRef}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted"
      >
        <ReactPlayer
          src={videoUrl}
          className="absolute inset-0 [&_video]:h-full [&_video]:w-full"
          width="100%"
          height="100%"
          playing={playing}
          muted
          controls
          playsInline
          onPause={handlePause}
          onPlay={handlePlay}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Video plays automatically when this section is on screen (starts muted). Use the player controls to unmute or
        pause.
      </p>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Open in new tab
      </a>
    </motion.div>
  );
}
