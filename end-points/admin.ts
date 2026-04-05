import type { AdminDashboardStats, DashboardStatBlock } from "@/schema/admin-dashboard-stats";
import { getStoredToken, request } from "@/end-points/http";

type RawBlock = { value: number; changePercent?: number; deltaPercent?: number };

function normalizeBlock(b: RawBlock | undefined): DashboardStatBlock {
  if (!b || typeof b.value !== "number") {
    return { value: 0, changePercent: 0 };
  }
  const changePercent =
    typeof b.changePercent === "number"
      ? b.changePercent
      : typeof b.deltaPercent === "number"
        ? b.deltaPercent
        : 0;
  return { value: b.value, changePercent };
}

export const admin = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const raw = await request<{
      totalProperties?: RawBlock;
      pendingApprovals?: RawBlock;
      activeAgents?: RawBlock;
      approvedThisWeek?: RawBlock;
    }>("/admin/dashboard-stats", {
      method: "GET",
      token: getStoredToken(),
    });

    return {
      totalProperties: normalizeBlock(raw.totalProperties),
      pendingApprovals: normalizeBlock(raw.pendingApprovals),
      activeAgents: normalizeBlock(raw.activeAgents),
      approvedThisWeek: normalizeBlock(raw.approvedThisWeek),
    };
  },
};
