"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { useAuth } from "@/contexts/auth-context";
import { getNavItemsForRole, getDashboardTitleForRole } from "@/config/roleNav";
import { UserRole } from "@/end-points/types";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function RolesRoutesShell({
  role,
  children,
}: {
  role?: UserRole;
  children: ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
    if (role != null && user && role !== user.role) {
      logout().then(() => {
        router.refresh();
      });
    } 
  }, [role, user]);

  if (isAuthenticated && user) {
    const items = getNavItemsForRole(user.role);
    const title = getDashboardTitleForRole(user.role);
    return (
      <SidebarProvider>
        <div className="h-full flex w-full bg-background">
          <DashboardSidebar items={items} />
          <div className="flex min-w-0 flex-1 flex-col">
            <DashboardHeader title={title} />
            <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="h-dvh overflow-x-hidden bg-background flex items-center justify-center">
       <Spinner className="size-8" />
       <p className="text-sm text-muted-foreground">Please wait while we load the page...</p>
    </div>
  );
}
