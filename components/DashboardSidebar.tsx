"use client";

import { Building2, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { NavLink } from "@/components/NavLink";
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
  const { settings } = useSettings();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent >
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-heading font-bold text-lg text-foreground">
                {settings?.siteName || "NoBroker"}
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

      <SidebarFooter className="border-t border-border p-3">
        {user && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Logout"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
