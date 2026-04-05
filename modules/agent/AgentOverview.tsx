"use client";

import { motion } from "framer-motion";
import { Building2, Users, Eye, TrendingUp } from "lucide-react";
import { useLeads } from "@/hooks/use-leads";
import { useMyProperties } from "@/hooks/use-properties";

const AgentOverview = () => {
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: myProperties, isLoading: listingsLoading } = useMyProperties();
  const leadCount = leads?.length ?? "—";
  const listingCount = listingsLoading ? "…" : String(myProperties?.length ?? 0);

  const stats = [
    { label: "Active Listings", value: listingCount, icon: Building2, trend: "—" },
    { label: "Total Leads", value: leadsLoading ? "…" : String(leadCount), icon: Users, trend: "—" },
    { label: "Profile Views", value: "—", icon: Eye, trend: "Not tracked" },
    { label: "Conversion", value: "—", icon: TrendingUp, trend: "Not tracked" },
  ];

  return (
  <div className="space-y-6">
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
            <span className="text-xs font-medium text-muted-foreground">{stat.trend}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>

    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="font-heading font-semibold text-foreground mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <a href="/listings" className="bg-primary/5 rounded-lg p-4 hover:bg-primary/10 transition-colors text-center">
          <Building2 className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">Add New Listing</p>
        </a>
        <a href="/leads" className="bg-primary/5 rounded-lg p-4 hover:bg-primary/10 transition-colors text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">View Leads</p>
        </a>
      </div>
    </div>
  </div>
  );
};

export default AgentOverview;
