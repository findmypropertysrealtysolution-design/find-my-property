"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { companyNav } from "@/config/roleNav";
import { RequireAuth, RequireCompletedProfile } from "@/components/auth/route-guards";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RequireCompletedProfile>
        <DashboardShell items={companyNav} title="Company Dashboard">
          {children}
        </DashboardShell>
      </RequireCompletedProfile>
    </RequireAuth>
  );
}
