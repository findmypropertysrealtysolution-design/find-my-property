"use client";

import { Building2 } from "lucide-react";

export default function CompanyProperties() {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <Building2 className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-heading font-semibold text-lg text-foreground mb-2">Company Properties</h2>
        <p className="text-muted-foreground text-sm max-w-sm">View and manage all properties listed under your company.</p>
      </div>
    </div>
  );
}
