import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import RolesRoutesShellLoader from "@/components/layout/roles-routes-shell-loader";

export default function RolesRoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-background">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <RolesRoutesShellLoader>{children}</RolesRoutesShellLoader>
    </Suspense>
  );
}
