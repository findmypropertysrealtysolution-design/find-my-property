"use client";

import { useMemo, useState } from "react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import {
  Activity,
  AlertCircle,
  Building2,
  CircleUser,
  Eye,
  EyeOff,
  Loader2,
  MessageSquareText,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useClearSystemLogs,
  useSystemLogs,
} from "@/hooks/use-system-logs";
import {
  CATEGORY_LABELS,
  HIDE_ERRORS_IN_UI,
  formatLogEvent,
  groupByDay,
  type ActivityCategory,
} from "@/lib/activity-log";
import { ActivityItem } from "@/components/admin/ActivityItem";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const PAGE_SIZE = 30;

type CategoryFilter = "all" | ActivityCategory;

// Error rows are hidden from the UI in production (the backend still records
// them — this only controls display). Build the pill list + URL parser from a
// single source so a stale `?cat=error` link silently coerces to "all".
const VISIBLE_CATEGORIES = (
  HIDE_ERRORS_IN_UI
    ? (["service", "listing", "lead", "user", "auth", "system"] as const)
    : (["service", "listing", "lead", "user", "auth", "system", "error"] as const)
) satisfies ReadonlyArray<ActivityCategory>;

const CATEGORY_ICON: Record<ActivityCategory, LucideIcon> = {
  service: Sparkles,
  listing: Building2,
  lead: MessageSquareText,
  user: CircleUser,
  auth: ShieldCheck,
  system: Settings2,
  error: AlertCircle,
};

const CATEGORY_FILTERS: Array<{ key: CategoryFilter; label: string; icon: LucideIcon }> = [
  { key: "all", label: "All activity", icon: Activity },
  ...VISIBLE_CATEGORIES.map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    icon: CATEGORY_ICON[key],
  })),
];

const filterParsers = {
  cat: parseAsStringLiteral(["all", ...VISIBLE_CATEGORIES] as const).withDefault(
    "all",
  ),
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export default function AdminActivity() {
  const [{ cat, q, page }, setQuery] = useQueryStates(filterParsers, {
    history: "replace",
    shallow: true,
  });
  const [showRoutine, setShowRoutine] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const { toast } = useToast();

  // Fetch a generous window and filter/group on the client. The backend
  // endpoint is offset/limit only (no category), and categories are a pure
  // client-side derivation anyway. 200 is well within table size.
  const {
    data: rawLogs,
    isLoading,
    isError,
    error,
    isFetching,
  } = useSystemLogs({ limit: 200, offset: 0 });

  const clearMutation = useClearSystemLogs();

  const allEvents = useMemo(() => {
    const mapped = (rawLogs ?? []).map(formatLogEvent);
    // Drop error rows up-front in production so counts, search, and pagination
    // all stay consistent with what the user can see.
    return HIDE_ERRORS_IN_UI
      ? mapped.filter((ev) => ev.category !== "error")
      : mapped;
  }, [rawLogs]);
  const routineCount = useMemo(
    () => allEvents.filter((ev) => ev.chatty).length,
    [allEvents],
  );
  const events = useMemo(
    () => (showRoutine ? allEvents : allEvents.filter((ev) => !ev.chatty)),
    [allEvents, showRoutine],
  );

  const runClear = async (
    input: Parameters<typeof clearMutation.mutateAsync>[0],
    successLabel: string,
  ) => {
    try {
      const res = await clearMutation.mutateAsync(input);
      toast({
        title: successLabel,
        description: `${res.deleted} ${res.deleted === 1 ? "entry" : "entries"} removed.`,
      });
      setClearOpen(false);
    } catch (e) {
      toast({
        title: "Could not clear logs",
        description: (e as Error)?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  const counts = useMemo(() => {
    const c: Record<CategoryFilter, number> = {
      all: events.length,
      service: 0,
      listing: 0,
      lead: 0,
      user: 0,
      auth: 0,
      system: 0,
      error: 0,
    };
    for (const ev of events) c[ev.category] += 1;
    c.all = events.length;
    return c;
  }, [events]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return events.filter((ev) => {
      if (cat !== "all" && ev.category !== cat) return false;
      if (!needle) return true;
      if (ev.title.toLowerCase().includes(needle)) return true;
      if (ev.actor?.toLowerCase().includes(needle)) return true;
      return ev.safeDetails.some((r) =>
        r.value.toLowerCase().includes(needle),
      );
    });
  }, [events, cat, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const groups = useMemo(() => groupByDay(slice), [slice]);

  const hasFilters = cat !== "all" || q.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading mb-1 text-xl font-bold text-foreground">
            Activity log
          </h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Every important action across the platform — requests, listings,
            sign-ins, errors. Click any row to see technical details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Refreshing…
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRoutine((v) => !v)}
            title={
              showRoutine
                ? "Hide routine events (token refresh, etc.)"
                : "Show routine events"
            }
          >
            {showRoutine ? (
              <EyeOff className="mr-1.5 h-3.5 w-3.5" />
            ) : (
              <Eye className="mr-1.5 h-3.5 w-3.5" />
            )}
            {showRoutine ? "Hide routine" : "Show routine"}
            {routineCount > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] tabular-nums text-muted-foreground">
                {routineCount}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setClearOpen(true)}
            className="text-destructive hover:bg-destructive/5 hover:text-destructive"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Clear logs
          </Button>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_FILTERS.map(({ key, label, icon: Icon }) => {
          const active = cat === key;
          const count = counts[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => setQuery({ cat: key, page: 1 })}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              <span
                className={cn(
                  "ml-0.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] tabular-nums",
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3">
        <div className="min-w-[240px] flex-1">
          <Label className="text-xs text-muted-foreground">Search</Label>
          <div className="relative mt-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={q}
              onChange={(e) => setQuery({ q: e.target.value, page: 1 })}
              placeholder="Search title, actor, or detail…"
              className="pl-9"
            />
          </div>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery({ cat: "all", q: "", page: 1 })}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Reset filters
          </Button>
        )}
      </div>

      {/* Content */}
      {isError ? (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">
              Could not load activity
            </p>
            <p className="mt-1 text-muted-foreground">
              {(error as Error)?.message ||
                "Make sure you are signed in as admin and try again."}
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="space-y-2 rounded-xl border border-border bg-card p-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-10 text-center">
          <Activity className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            {hasFilters ? "No matches for these filters" : "No activity yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {hasFilters
              ? "Try clearing a filter or adjusting the search."
              : "Once people use the platform, you will see a timeline here."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="mb-2 flex items-center gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h3>
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs tabular-nums text-muted-foreground">
                  {group.items.length}{" "}
                  {group.items.length === 1 ? "event" : "events"}
                </span>
              </div>
              <div className="divide-y divide-border rounded-xl border border-border bg-card">
                {group.items.map((event) => (
                  <div key={event.id} className="px-2 py-1 first:pt-2 last:pb-2">
                    <ActivityItem event={event} />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2 text-sm">
              <span className="text-xs text-muted-foreground">
                Page {safePage} of {totalPages} · {filtered.length} events
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage <= 1}
                  onClick={() =>
                    setQuery({ page: Math.max(1, safePage - 1) })
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setQuery({ page: Math.min(totalPages, safePage + 1) })
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear activity log</DialogTitle>
            <DialogDescription>
              {HIDE_ERRORS_IN_UI
                ? "Remove entries from the database. This cannot be undone. Choose a scope below."
                : "Remove entries from the database. This cannot be undone. Errors and warnings are kept by default — choose a scope below."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <ClearOption
              title="Older than 24 hours"
              subtitle="Keeps today's activity. Removes info-level rows older than 24h."
              loading={clearMutation.isPending}
              onClick={() =>
                runClear(
                  { olderThanHours: 24, level: "info" },
                  "Old activity cleared",
                )
              }
            />
            <ClearOption
              title="Older than 7 days"
              subtitle="Tidy housekeeping. Removes info rows older than a week."
              loading={clearMutation.isPending}
              onClick={() =>
                runClear(
                  { olderThanHours: 24 * 7, level: "info" },
                  "Old activity cleared",
                )
              }
            />
            <ClearOption
              title="All info-level events"
              subtitle="Removes routine activity but keeps errors and warnings."
              loading={clearMutation.isPending}
              onClick={() =>
                runClear({ level: "info" }, "Routine activity cleared")
              }
            />
            <ClearOption
              title="Everything (nuclear)"
              subtitle="Wipes the activity log completely, including errors."
              tone="danger"
              loading={clearMutation.isPending}
              onClick={() => runClear({}, "Activity log wiped")}
            />
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setClearOpen(false)}
              disabled={clearMutation.isPending}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClearOption({
  title,
  subtitle,
  tone,
  loading,
  onClick,
}: {
  title: string;
  subtitle: string;
  tone?: "danger";
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "group flex w-full items-start justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors",
        "hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-60",
        tone === "danger" &&
          "border-destructive/30 hover:bg-destructive/5",
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-medium",
            tone === "danger" ? "text-destructive" : "text-foreground",
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {loading ? (
        <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <Trash2
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors",
            "group-hover:text-foreground",
            tone === "danger" && "group-hover:text-destructive",
          )}
        />
      )}
    </button>
  );
}
