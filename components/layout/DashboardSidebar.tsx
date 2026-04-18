"use client";

import { Building2, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { NavLink } from "@/components/layout/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LucideIcon } from "lucide-react";
import { SITE_NAME } from "@/lib/branding";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface DashboardSidebarProps {
  items: NavItem[];
}

const DashboardSidebar = ({ items }: DashboardSidebarProps) => {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent >
        {/* Logo — collapses to a centered icon tile so it fits the 3rem icon rail */}
        <div
          className={cn(
            "flex h-14 items-center border-b border-border",
            collapsed ? "justify-center px-0" : "px-4",
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 min-w-0",
              collapsed && "justify-center",
            )}
            aria-label={SITE_NAME}
          >
            <div
              className={cn(
                "rounded-lg hero-gradient flex items-center justify-center shrink-0",
                collapsed ? "w-8 h-8" : "w-9 h-9",
              )}
            >
              <Building2
                className={cn(
                  "text-primary-foreground",
                  collapsed ? "w-4 h-4" : "w-5 h-5",
                )}
              />
            </div>
            {!collapsed && (
              <span className="font-heading font-bold text-lg text-foreground truncate">
                {SITE_NAME}
              </span>
            )}
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      href={item.url}
                      end={index === 0}
                      className="hover:bg-muted/50 min-w-0"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span className="min-w-0 wrap-break-word">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
