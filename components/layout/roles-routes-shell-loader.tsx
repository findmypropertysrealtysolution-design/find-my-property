import type { ReactNode } from "react";
import { cookies } from "next/headers";
import RolesRoutesShell from "@/components/layout/roles-routes-shell";
import type { UserRole } from "@/end-points/types";
import { FMP_ROLE_COOKIE } from "@/lib/fmp-cookie";

/**
 * Async server segment: reads `fmp-role` inside the Suspense boundary from the parent layout
 * so the route shell can stream (Cache Components / PPR).
 */
export default async function RolesRoutesShellLoader({
  children,
}: {
  children: ReactNode;
}) {
  const role = (await cookies()).get(FMP_ROLE_COOKIE)?.value as UserRole | undefined;
  return <RolesRoutesShell role={role}>{children}</RolesRoutesShell>;
}
