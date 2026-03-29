"use client";

import { BarChart3 } from "lucide-react";

export default function AgentReports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border bg-card">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <BarChart3 className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-heading font-semibold text-lg text-foreground mb-2">Reports</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          View performance reports, lead conversion, and listing analytics.
        </p>
      </div>
    </div>
  );
}
