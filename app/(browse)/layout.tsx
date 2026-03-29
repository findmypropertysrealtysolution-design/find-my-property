"use client";

import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { getNavItemsForRole, getDashboardTitleForRole } from "@/config/roleNav";

/**
 * Shared chrome for /properties and /property/* — mirrors the old AuthenticatedLayout vs public shell,
 * composed here as a Next.js layout instead of wrapping inside page views.
 */
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
