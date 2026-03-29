import {
  LayoutDashboard,
  Search,
  Heart,
  Bell,
  UserCircle,
  Building2,
  Users,
  BarChart3,
  CheckSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/contexts/AuthContext";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const tenantNav: NavItem[] = [
  { title: "Overview", url: "/tenant", icon: LayoutDashboard },
  { title: "My Listings", url: "/tenant/listings", icon: Building2 },
  { title: "Browse", url: "/properties", icon: Search },
  { title: "Favorites", url: "/tenant/favorites", icon: Heart },
  { title: "Alerts", url: "/tenant/alerts", icon: Bell },
  { title: "Profile", url: "/tenant/profile", icon: UserCircle },
];

const agentNav: NavItem[] = [
  { title: "Overview", url: "/agent", icon: LayoutDashboard },
  { title: "My Listings", url: "/agent/listings", icon: Building2 },
  { title: "Leads", url: "/agent/leads", icon: Users },
  { title: "Reports", url: "/agent/reports", icon: BarChart3 },
  { title: "Profile", url: "/agent/profile", icon: UserCircle },
];

const companyNav: NavItem[] = [
  { title: "Overview", url: "/company", icon: LayoutDashboard },
  { title: "Properties", url: "/company/properties", icon: Building2 },
  { title: "Agents", url: "/company/agents", icon: Users },
  { title: "Reports", url: "/company/reports", icon: BarChart3 },
  { title: "Profile", url: "/company/profile", icon: UserCircle },
];

const adminNav: NavItem[] = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Property Approval", url: "/admin/approvals", icon: CheckSquare },
  { title: "Agent Management", url: "/admin/agents", icon: Users },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const dashboardTitles: Record<Exclude<UserRole, "admin">, string> = {
  tenant: "Tenant Dashboard",
  agent: "Agent Dashboard",
  company: "Company Dashboard",
};

export function getNavItemsForRole(role: UserRole | undefined): NavItem[] {
  switch (role) {
    case "tenant":
      return tenantNav;
    case "agent":
      return agentNav;
    case "company":
      return companyNav;
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

export { tenantNav, agentNav, companyNav, adminNav };
