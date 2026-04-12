"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { RequireAuth, RequireCompletedProfile } from "@/components/auth/route-guards";

export default function RolesRoutesTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  /** SEO/marketing URLs: guests can view; authed users get dashboard shell (sidebar) in `RolesRoutesShell`. */
  const isPublicMarketplace =
    pathname === "/browse" || pathname.startsWith("/property/");

  if (isPublicMarketplace) {
    return <div className="min-h-0">{children}</div>;
  }

  return (
    <RequireAuth>
      <RequireCompletedProfile>
        <div className="min-h-0">{children}</div>
      </RequireCompletedProfile>
    </RequireAuth>
  );
}
