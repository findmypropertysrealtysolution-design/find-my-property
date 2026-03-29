"use client";

import { motion } from "framer-motion";
import { Building2, Users, BarChart3, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Properties", value: "24", icon: Building2, trend: "+3" },
  { label: "Active Agents", value: "8", icon: Users, trend: "2 new" },
  { label: "Reports", value: "12", icon: BarChart3, trend: "This month" },
  { label: "Growth", value: "14%", icon: TrendingUp, trend: "+2%" },
];

export default function CompanyOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-1">Company Dashboard</h2>
        <p className="text-muted-foreground text-sm">Manage properties, agents, and reports</p>
      </div>
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
              <span className="text-xs font-medium text-primary">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
