import {
  LayoutDashboard,
  Search,
  Heart,
  Bell,
  UserCircle,
  Building2,
  LayoutList,
  Users,
  BarChart3,
  CheckSquare,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/contexts/auth-context";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const tenantNav: NavItem[] = [
  { title: "Overview", url: "/tenant", icon: LayoutDashboard },
  { title: "My Listings", url: "/tenant/listings", icon: Building2 },
  { title: "Browse", url: "/tenant/properties", icon: Search },
  { title: "Favorites", url: "/tenant/favorites", icon: Heart },
  { title: "Alerts", url: "/tenant/alerts", icon: Bell },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

const agentNav: NavItem[] = [
  { title: "Overview", url: "/agent", icon: LayoutDashboard },
  { title: "My Listings", url: "/agent/listings", icon: Building2 },
  { title: "Browse", url: "/agent/properties", icon: Search },
  { title: "Favorites", url: "/agent/favorites", icon: Heart },
  { title: "Leads", url: "/agent/leads", icon: Users },
  { title: "Reports", url: "/agent/reports", icon: BarChart3 },
  { title: "Profile", url: "/agent/profile", icon: UserCircle },
];

const adminNav: NavItem[] = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Property Approval", url: "/admin/approvals", icon: CheckSquare },
  { title: "Agent Management", url: "/admin/agents", icon: Users },
  { title: "My Listings", url: "/admin/listings", icon: Building2 },
  { title: "All properties", url: "/admin/properties", icon: LayoutList },
  { title: "Favorites", url: "/admin/favorites", icon: Heart },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Profile", url: "/admin/profile", icon: UserCircle },
];

const dashboardTitles: Record<Exclude<UserRole, "admin">, string> = {
  tenant: "Tenant Dashboard",
  agent: "Agent Dashboard",
};

export function getNavItemsForRole(role: UserRole | undefined): NavItem[] {
  switch (role) {
    case "tenant":
      return tenantNav;
    case "agent":
      return agentNav;
    case "admin":
      return agentNav; // admin on shared pages (e.g. property detail) sees agent-style nav
    default:
      return tenantNav;
  }
}

export function getDashboardTitleForRole(role: UserRole | undefined): string {
  if (!role || role === "admin") return "Dashboard";
  return dashboardTitles[role];
}

export { tenantNav, agentNav, adminNav };
