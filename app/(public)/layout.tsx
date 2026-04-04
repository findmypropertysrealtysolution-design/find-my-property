"use client";

import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/auth-context";
import { getNavItemsForRole, getDashboardTitleForRole } from "@/config/roleNav";

export default function BrowseLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    const items = getNavItemsForRole(user.role);
    const title = getDashboardTitleForRole(user.role);
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar items={items} />
          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader title={title} />
            <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
