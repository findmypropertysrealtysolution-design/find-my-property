"use client";

import { motion } from "framer-motion";
import { Building2, Users, CheckCircle, Clock, AlertTriangle, Shield, Globe, Terminal } from "lucide-react";
import { useSystemLogs } from "@/hooks/use-system-logs";
import { useAdminDashboardStats } from "@/hooks/use-admin-dashboard-stats";
import { formatDistanceToNow } from "date-fns";
import type { AdminDashboardStats, DashboardStatBlock } from "@/schema/admin-dashboard-stats";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { data: logs, isLoading: logsLoading } = useSystemLogs();
  const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminDashboardStats();

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

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading mb-4 font-semibold text-foreground">System Activity logs</h2>
        <div className="space-y-3">
          {logsLoading ? (
            <div className="py-10 text-center text-sm italic text-muted-foreground">Loading logs...</div>
          ) : (logs || []).length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No system activity logged yet.</div>
          ) : (
            (logs || []).slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-lg border-b border-border px-2 py-2 transition-colors last:border-0 hover:bg-muted/30"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    log.level === "error"
                      ? "bg-red-100 text-red-600"
                      : log.level === "warn"
                        ? "bg-amber-100 text-amber-600"
                        : log.level === "debug"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {log.level === "error" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : log.level === "warn" ? (
                    <Shield className="h-4 w-4" />
                  ) : log.method ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <Terminal className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <p className={`text-sm font-medium ${log.level === "error" ? "text-red-700" : "text-foreground"}`}>
                      {log.message}
                    </p>
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase opacity-60">
                      {log.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {log.method && log.url && (
                      <span className="rounded bg-muted/50 px-1 font-mono">
                        {log.method} {log.url}
                      </span>
                    )}
                    {log.userId && <span>• User #{log.userId}</span>}
                  </div>
                </div>
                <span className="whitespace-nowrap pt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
