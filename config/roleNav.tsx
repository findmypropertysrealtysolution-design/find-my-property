import {
  LayoutDashboard,
  Search,
  UserCircle,
  Building2,
  LayoutList,
  Users,
  BarChart3,
  CheckSquare,
  ClipboardList,
  Sparkles,
  Activity,
  Settings as SettingsIcon,
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
  { title: "Browse", url: "/browse", icon: Search },
  { title: "My Requests", url: "/my-requests", icon: ClipboardList },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

const agentNav: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Listings", url: "/listings", icon: Building2 },
  { title: "Browse", url: "/browse", icon: Search },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "My Requests", url: "/my-requests", icon: ClipboardList },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Profile", url: "/profile", icon: UserCircle },
];

const adminNav: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Property Approval", url: "/approvals", icon: CheckSquare },
  { title: "Agent Management", url: "/agents", icon: Users },
  { title: "Service Requests", url: "/admin/service-requests", icon: Sparkles },
  { title: "Activity Log", url: "/admin/activity", icon: Activity },
  { title: "Browse", url: "/browse", icon: Search },
  { title: "My Listings", url: "/listings", icon: Building2 },
  { title: "All properties", url: "/properties", icon: LayoutList },
  { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
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
