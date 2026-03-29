"use client";

import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import type { LucideIcon } from "lucide-react";

export interface DashboardNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export function DashboardShell({
  items,
  title,
  children,
}: {
  items: DashboardNavItem[];
  title?: string;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        <DashboardSidebar items={items} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* <DashboardHeader title={title} /> */}
          <main className="flex-1 min-w-0 p-6 bg-background overflow-x-hidden">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
