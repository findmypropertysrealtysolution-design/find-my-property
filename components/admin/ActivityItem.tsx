"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Building2,
  ChevronDown,
  CircleUser,
  MessageSquareText,
  Settings2,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CATEGORY_STYLE,
  type ActivityCategory,
  type ActivityEvent,
} from "@/lib/activity-log";

const CATEGORY_ICON: Record<ActivityCategory, LucideIcon> = {
  service: Sparkles,
  listing: Building2,
  lead: MessageSquareText,
  user: CircleUser,
  auth: ShieldCheck,
  system: Settings2,
  error: AlertCircle,
};

interface ActivityItemProps {
  event: ActivityEvent;
  /** Technical details drawer available — admin-only surface. */
  showTechnical?: boolean;
  /** Render compact (for small cards on overview). */
  compact?: boolean;
  className?: string;
}

export function ActivityItem({
  event,
  showTechnical = true,
  compact = false,
  className,
}: ActivityItemProps) {
  const [open, setOpen] = useState(false);
  const Icon = CATEGORY_ICON[event.category];
  const style = CATEGORY_STYLE[event.category];

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg px-2 py-2 transition-colors",
        "hover:bg-muted/30",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
          style.chip,
          style.ring,
        )}
        aria-hidden
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm font-medium",
              event.category === "error" ? style.text : "text-foreground",
            )}
            title={event.title}
          >
            {event.title}
          </p>
          <span className="shrink-0 whitespace-nowrap pt-0.5 text-xs text-muted-foreground">
            {formatDistanceToNow(event.timestamp, { addSuffix: true })}
          </span>
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
          {event.actor && <span>{event.actor}</span>}
          {event.meta && (
            <>
              <span aria-hidden>·</span>
              <span
                className={cn(
                  "rounded px-1 font-medium",
                  event.category === "error"
                    ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                    : "bg-muted",
                )}
              >
                {event.meta}
              </span>
            </>
          )}
          {showTechnical && !compact && event.safeDetails.length > 0 && (
            <>
              <span aria-hidden>·</span>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                aria-expanded={open}
              >
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    open && "rotate-180",
                  )}
                />
                {open ? "Hide details" : "Technical details"}
              </button>
            </>
          )}
        </div>

        {open && event.safeDetails.length > 0 && (
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-[11px]">
            {event.safeDetails.map((row, i) => (
              <div key={`${row.label}-${i}`} className="contents">
                <dt className="truncate font-medium text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="truncate font-mono text-foreground/90" title={row.value}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

export default ActivityItem;
