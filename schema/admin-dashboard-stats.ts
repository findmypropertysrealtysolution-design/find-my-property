/** Response from `GET /admin/dashboard-stats` */
export interface DashboardStatBlock {
  value: number;
  /** vs previous period; positive = up, negative = down */
  changePercent: number;
}

export interface AdminDashboardStats {
  totalProperties: DashboardStatBlock;
  pendingApprovals: DashboardStatBlock;
  activeAgents: DashboardStatBlock;
  approvedThisWeek: DashboardStatBlock;
}
