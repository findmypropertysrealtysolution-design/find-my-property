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

/** Flat routes under app/(roles-routes); see segment page.tsx files. */
const tenantNav: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Listings", url: "/listings", icon: Building2 },
  { title: "Browse", url: "/", icon: Search },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Alerts", url: "/alerts", icon: Bell },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

const agentNav: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Listings", url: "/listings", icon: Building2 },
  { title: "Browse", url: "/", icon: Search },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

const adminNav: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Property Approval", url: "/approvals", icon: CheckSquare },
  { title: "Agent Management", url: "/agents", icon: Users },
  { title: "My Listings", url: "/listings", icon: Building2 },
  { title: "All properties", url: "/properties", icon: LayoutList },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

const dashboardTitles: Record<UserRole, string> = {
  tenant: "Tenant Dashboard",
  agent: "Agent Dashboard",
  admin: "Admin Dashboard",
};

export function getNavItemsForRole(role: UserRole | undefined): NavItem[] {
  switch (role) {
    case "tenant":
      return tenantNav;
    case "agent":
      return agentNav;
    case "admin":
      return adminNav;
    default:
      return tenantNav;
  }
}

export function getDashboardTitleForRole(role: UserRole | undefined): string {
  if (!role) return "Dashboard";
  return dashboardTitles[role];
}

export { tenantNav, agentNav, adminNav };
