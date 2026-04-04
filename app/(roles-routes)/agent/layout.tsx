"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { agentNav } from "@/config/roleNav";
import { RequireAuth, RequireCompletedProfile } from "@/components/auth/route-guards";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <RequireCompletedProfile>
        <DashboardShell items={agentNav} title="Agent Dashboard">
          {children}
        </DashboardShell>
      </RequireCompletedProfile>
    </RequireAuth>
  );
}
