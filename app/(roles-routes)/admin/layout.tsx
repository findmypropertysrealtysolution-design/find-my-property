"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { adminNav } from "@/config/roleNav";
import { RequireAuth, RequireCompletedProfile } from "@/components/auth/route-guards";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RequireCompletedProfile>
        <DashboardShell items={adminNav} title="Admin Dashboard">
          {children}
        </DashboardShell>
      </RequireCompletedProfile>
    </RequireAuth>
  );
}
