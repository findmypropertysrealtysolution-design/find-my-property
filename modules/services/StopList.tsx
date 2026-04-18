"use client";

import { ArrowDown, ArrowUp, Flag, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import LocationSearchField, { type LocationValue } from "./LocationSearchField";
import type { StopValue } from "./schemas";

interface StopListProps {
  value: StopValue[];
  onChange: (next: StopValue[]) => void;
  max?: number;
  className?: string;
  error?: string;
  firstStopHint?: string;
}

const EMPTY_STOP: StopValue = { label: "", lat: 0, lng: 0, notes: "" };

/**
 * Ordered list of drop locations for the Packers & Movers form.
 *
 * Kept intentionally keyboard-first (no drag libs) so it works great on
 * touch without pulling in react-dnd. Reorder via up/down buttons; add up
 * to `max` drops; each stop exposes an optional notes field so the user
 * can explain what goes at each address ("2BHK for parents' house").
 */
export default function StopList({
  value,
  onChange,
  max = 5,
  className,
  error,
  firstStopHint = "Drop location",
}: StopListProps) {
  const setAt = (i: number, next: Partial<StopValue>) => {
    const arr = value.slice();
    arr[i] = { ...arr[i], ...next };
    onChange(arr);
  };

  const setStop = (i: number, loc: LocationValue | null) => {
    const arr = value.slice();
    if (!loc) {
      arr[i] = { ...arr[i], label: "", lat: 0, lng: 0, placeId: undefined };
    } else {
      arr[i] = {
        ...arr[i],
        label: loc.label,
        lat: loc.lat,
        lng: loc.lng,
        placeId: loc.placeId,
      };
    }
    onChange(arr);
  };

  const add = () => {
    if (value.length >= max) return;
    onChange([...value, { ...EMPTY_STOP }]);
  };

  const remove = (i: number) => {
    if (value.length <= 1) return;
    onChange(value.filter((_, idx) => idx !== i));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const arr = value.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {value.map((stop, i) => {
        const hasCoord =
          Number.isFinite(stop.lat) &&
          Number.isFinite(stop.lng) &&
          stop.lat !== 0 &&
          stop.lng !== 0;
        return (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-3 space-y-2"
          >
            <div className="flex items-start gap-2">
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                <Flag className="h-3.5 w-3.5" aria-hidden />
                <span className="sr-only">Drop {i + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  {i === 0 ? firstStopHint : `Drop ${i + 1}`}
                </p>
                <LocationSearchField
                  value={
                    hasCoord
                      ? {
                          label: stop.label,
                          lat: stop.lat,
                          lng: stop.lng,
                          placeId: stop.placeId ?? undefined,
                        }
                      : null
                  }
                  onChange={(loc) => setStop(i, loc)}
                  placeholder="Search for a drop address or area…"
                  showMapPreview
                  mapPreviewHeight={140}
                />
                <Textarea
                  value={stop.notes ?? ""}
                  onChange={(e) =>
                    setAt(i, { notes: e.target.value })
                  }
                  rows={2}
                  maxLength={500}
                  placeholder="Notes for this stop (optional) — e.g. ‘2BHK worth of items’, floor #, contact at site"
                  className="mt-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="h-7 w-7"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label="Move down"
                  className="h-7 w-7"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(i)}
                  disabled={value.length <= 1}
                  aria-label="Remove stop"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {value.length} of {max} drops
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          disabled={value.length >= max}
        >
          <Plus className="mr-1 h-3.5 w-3.5" aria-hidden />
          Add another drop
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
