"use client";

import { Clock, Loader2, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTripEstimate } from "@/hooks/use-trip-estimate";
import type { StopValue } from "./schemas";

interface TripEstimateProps {
  pickup: StopValue | null;
  drops: StopValue[];
  className?: string;
}

function formatDuration(min: number): string {
  if (!Number.isFinite(min) || min <= 0) return "—";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Compact trip summary card for the Packers & Movers form.
 *
 * Hidden until every stop has coordinates (prevents empty-state flicker
 * between suggestion picks) and silently no-ops if the backend couldn't
 * talk to Distance Matrix — the form still submits and the admin can
 * compute later from the stored coords.
 */
export default function TripEstimate({ pickup, drops, className }: TripEstimateProps) {
  const { data, isLoading, error, hasAllCoords } = useTripEstimate(pickup, drops);

  if (!hasAllCoords) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-muted/20 p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Route className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Estimated trip
            </p>
            {isLoading ? (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                Calculating route…
              </p>
            ) : data ? (
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {data.distanceKm.toFixed(1)} km
                <span className="mx-2 text-muted-foreground">•</span>
                <Clock
                  className="inline h-3.5 w-3.5 -translate-y-0.5 text-muted-foreground"
                  aria-hidden
                />{" "}
                {formatDuration(data.durationMin)}
              </p>
            ) : (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {error ??
                  "We’ll confirm the distance on call — estimate unavailable."}
              </p>
            )}
          </div>
        </div>
      </div>
      {data && data.legs.length > 1 ? (
        <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          {data.legs.map((leg, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>
                {i === 0 ? "Pickup" : `Drop ${i}`} → Drop {i + 1}
              </span>
              <span className="tabular-nums">
                {leg.distanceKm.toFixed(1)} km · {formatDuration(leg.durationMin)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
