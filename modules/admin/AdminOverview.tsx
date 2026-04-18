"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Users, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { useSystemLogs } from "@/hooks/use-system-logs";
import { useAdminDashboardStats } from "@/hooks/use-admin-dashboard-stats";
import type { AdminDashboardStats, DashboardStatBlock } from "@/schema/admin-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceRequestsOverviewTiles } from "@/modules/admin/ServiceRequestsAdmin";
import { formatLogEvent } from "@/lib/activity-log";
import { ActivityItem } from "@/components/admin/ActivityItem";

const numberFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function formatChangePercent(p: number): string {
  if (!Number.isFinite(p)) return "—";
  const sign = p > 0 ? "+" : "";
  return `${sign}${p}%`;
}

function changePercentClass(p: number): string {
  if (!Number.isFinite(p) || p === 0) return "text-muted-foreground";
  if (p > 0) return "text-emerald-600 dark:text-emerald-400";
  return "text-red-600 dark:text-red-400";
}

const kpiConfig: {
  key: keyof AdminDashboardStats;
  label: string;
  icon: typeof Building2;
}[] = [
  { key: "totalProperties", label: "Total Properties", icon: Building2 },
  { key: "pendingApprovals", label: "Pending Approvals", icon: Clock },
  { key: "activeAgents", label: "Active Agents", icon: Users },
  { key: "approvedThisWeek", label: "Approved This Week", icon: CheckCircle },
];

function StatCard({
  label,
  icon: Icon,
  block,
  loading,
  failed,
}: {
  label: string;
  icon: typeof Building2;
  block: DashboardStatBlock | undefined;
  loading: boolean;
  failed?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="mb-2 h-8 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (failed) {
    return (
      <div className="rounded-xl border border-dashed border-muted bg-muted/20 p-5">
        <div className="mb-3 flex items-center justify-between opacity-60">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">—</span>
        </div>
        <p className="text-lg font-medium text-muted-foreground">—</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    );
  }

  const pct = block?.changePercent ?? 0;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className={`text-xs font-medium tabular-nums ${changePercentClass(pct)}`}>{formatChangePercent(pct)}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums text-foreground">{numberFmt.format(block?.value ?? 0)}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

const AdminOverview = () => {
  const { data: logs, isLoading: logsLoading } = useSystemLogs({ limit: 40 });
  const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminDashboardStats();

  // Hide chatty events (e.g. silent token refresh) from the overview panel.
  const events = useMemo(
    () =>
      (logs ?? [])
        .map(formatLogEvent)
        .filter((ev) => !ev.chatty)
        .slice(0, 8),
    [logs],
  );

  return (
    <div className="space-y-6">
      {statsError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Could not load dashboard metrics. Check that you are signed in as admin and the API exposes{" "}
          <code className="rounded bg-muted px-1 text-xs">GET /admin/dashboard-stats</code>.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiConfig.map((row, i) => (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StatCard
              label={row.label}
              icon={row.icon}
              block={stats?.[row.key]}
              loading={statsLoading}
              failed={statsError}
            />
          </motion.div>
        ))}
      </div>

      <ServiceRequestsOverviewTiles />

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-semibold text-foreground">Recent activity</h2>
            <p className="text-xs text-muted-foreground">
              Latest 8 actions across the platform.
            </p>
          </div>
          <Link
            href="/admin/activity"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-1">
          {logsLoading ? (
            <div className="py-10 text-center text-sm italic text-muted-foreground">
              Loading activity…
            </div>
          ) : events.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No activity yet. It will show up here as people use the platform.
            </div>
          ) : (
            events.map((event) => <ActivityItem key={event.id} event={event} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
