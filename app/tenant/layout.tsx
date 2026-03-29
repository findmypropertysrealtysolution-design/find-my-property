"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { tenantNav } from "@/config/roleNav";
import { RequireAuth, RequireCompletedProfile } from "@/components/auth/route-guards";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RequireCompletedProfile>
        <DashboardShell items={tenantNav} title="Tenant Dashboard">
          {children}
        </DashboardShell>
      </RequireCompletedProfile>
    </RequireAuth>
  );
}
