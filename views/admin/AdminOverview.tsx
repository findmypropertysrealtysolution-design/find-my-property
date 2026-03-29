"use client";

import { motion } from "framer-motion";
import { Building2, Users, CheckCircle, Clock, TrendingUp, AlertTriangle, Shield, Globe, Terminal } from "lucide-react";
import { useSystemLogs } from "@/hooks/use-system-logs";
import { formatDistanceToNow } from "date-fns";

const stats = [
  { label: "Total Properties", value: "1,248", icon: Building2, trend: "+12%" },
  { label: "Pending Approvals", value: "23", icon: Clock, trend: "-5%" },
  { label: "Active Agents", value: "45", icon: Users, trend: "+8%" },
  { label: "Approved This Week", value: "67", icon: CheckCircle, trend: "+15%" },
];

const DUMMY_LOGS = [
  {
    id: -1,
    level: "info",
    message: "Property #1024 status updated to Approved",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    method: "PATCH",
    url: "/properties/1024",
    userId: 12,
  },
  {
    id: -2,
    level: "info",
    message: "New agent registered: Sneha Reddy",
    timestamp: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
    method: "POST",
    url: "/auth/register",
  },
  {
    id: -3,
    level: "error",
    message: "Exception: Internal server error during property sync",
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    method: "POST",
    url: "/properties/sync",
    userId: 42,
  },
] as any[];

const AdminOverview = () => {
  const { data: logs, isLoading } = useSystemLogs();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl p-5 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-emerald-600">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / System Logs */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-heading font-semibold text-foreground mb-4">System Activity logs</h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground italic">Loading logs...</div>
          ) : (
            [...(logs || []), ...DUMMY_LOGS].slice(0, 8).map((log, i) => (
              <div key={log.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0 hover:bg-muted/30 transition-colors px-2 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  log.level === "error" ? "bg-red-100 text-red-600" :
                  log.level === "warn" ? "bg-amber-100 text-amber-600" :
                  log.level === "debug" ? "bg-slate-100 text-slate-600" :
                  "bg-blue-100 text-blue-600"
                }`}>
                  {log.level === "error" ? <AlertTriangle className="w-4 h-4" /> :
                   log.level === "warn" ? <Shield className="w-4 h-4" /> :
                   log.method ? <Globe className="w-4 h-4" /> :
                   <Terminal className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-medium ${log.level === "error" ? "text-red-700" : "text-foreground"}`}>
                      {log.message}
                    </p>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 bg-muted px-1.5 py-0.5 rounded">
                      {log.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {log.method && log.url && (
                      <span className="font-mono bg-muted/50 px-1 rounded">{log.method} {log.url}</span>
                    )}
                    {log.userId && <span>• User #{log.userId}</span>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap pt-1">
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
