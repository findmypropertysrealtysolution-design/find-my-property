"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { RequireAuth, RequireCompletedProfile } from "@/components/auth/route-guards";

export default function RolesRoutesTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicProperty = pathname.startsWith("/property/");

  if (isPublicProperty) {
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
