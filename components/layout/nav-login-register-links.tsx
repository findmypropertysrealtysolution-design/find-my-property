"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { buildLoginAndRegisterHrefs } from "@/lib/auth-redirect";

type Props = {
  onNavigate?: () => void;
  className?: string;
};

/**
 * Login / Sign Up links with `?from=` so post-auth returns to the current page.
 * Must render under a React `Suspense` boundary (see `Navbar`).
 */
export function NavLoginRegisterLinks({ onNavigate, className }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loginHref, registerHref } = buildLoginAndRegisterHrefs(pathname, searchParams);

  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <Button variant="outline" size="sm" className="flex-1 md:flex-initial" asChild>
        <Link href={loginHref} onClick={onNavigate}>
          Log In
        </Link>
      </Button>
      <Button size="sm" className="flex-1 md:flex-initial" asChild>
        <Link href={registerHref} onClick={onNavigate}>
          Sign Up
        </Link>
      </Button>
    </div>
  );
}
