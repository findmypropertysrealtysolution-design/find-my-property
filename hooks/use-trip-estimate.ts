"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Stop, TripEstimate } from "@/lib/api";

/**
 * Debounced client hook that asks the backend for a Distance Matrix summary
 * whenever the pickup + drops set becomes fully coord'd. We keep this outside
 * React Query because we want manual debounce + silent failure (the form
 * must still work when Distance Matrix is unavailable).
 */
export function useTripEstimate(
  pickup: Stop | null | undefined,
  drops: Stop[] | null | undefined,
  opts: { debounceMs?: number } = {},
) {
  const debounceMs = opts.debounceMs ?? 500;
  const [data, setData] = useState<TripEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seqRef = useRef(0);

  const hasAllCoords =
    Boolean(pickup && Number.isFinite(pickup.lat) && Number.isFinite(pickup.lng)) &&
    Array.isArray(drops) &&
    drops.length > 0 &&
    drops.every(
      (d) => Number.isFinite(d.lat) && Number.isFinite(d.lng),
    );

  // Include coordinates in the dependency signature so a stop move triggers a refetch.
  const signature = hasAllCoords
    ? [
        `${pickup!.lat.toFixed(5)},${pickup!.lng.toFixed(5)}`,
        ...drops!.map((d) => `${d.lat.toFixed(5)},${d.lng.toFixed(5)}`),
      ].join("|")
    : "";

  useEffect(() => {
    if (!signature) {
      setData(null);
      setError(null);
      return;
    }
    const mySeq = ++seqRef.current;
    const t = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getTripEstimate(
          { lat: pickup!.lat, lng: pickup!.lng },
          drops!.map((d) => ({ lat: d.lat, lng: d.lng })),
        );
        if (mySeq !== seqRef.current) return;
        setData(res.estimate ?? null);
      } catch (e) {
        if (mySeq !== seqRef.current) return;
        setError(e instanceof Error ? e.message : "Could not estimate trip");
      } finally {
        if (mySeq === seqRef.current) setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, debounceMs]);

  return { data, isLoading, error, hasAllCoords };
}
