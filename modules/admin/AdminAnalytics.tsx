"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Building2, Eye } from "lucide-react";

const metrics = [
  { label: "Page Views", value: "24.5K", change: "+18%", icon: Eye },
  { label: "New Users", value: "1,340", change: "+12%", icon: Users },
  { label: "Listings Created", value: "89", change: "+24%", icon: Building2 },
  { label: "Conversion Rate", value: "3.2%", change: "+0.5%", icon: TrendingUp },
];

const topLocalities = [
  { name: "Whitefield", listings: 234, percentage: 85 },
  { name: "HSR Layout", listings: 198, percentage: 72 },
  { name: "Koramangala", listings: 176, percentage: 64 },
  { name: "Indiranagar", listings: 145, percentage: 53 },
  { name: "Electronic City", listings: 132, percentage: 48 },
];

const AdminAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">Analytics</h2>
        <p className="text-sm text-muted-foreground">Platform performance overview</p>
        <p className="mt-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Sample metrics for layout only — wire your analytics backend or Plausible/GA to replace these values.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <m.icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium text-emerald-600">{m.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            <p className="text-sm text-muted-foreground">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-heading font-semibold text-foreground mb-4">Top Localities</h3>
        <div className="space-y-4">
          {topLocalities.map((loc) => (
            <div key={loc.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-foreground">{loc.name}</span>
                <span className="text-muted-foreground">{loc.listings} listings</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${loc.percentage}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
