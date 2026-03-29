"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends Omit<React.ComponentProps<typeof Link>, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  /** When true, only the exact path matches (same as React Router `end`). */
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, href, end, ...props }, ref) => {
    const pathname = usePathname();
    const hrefStr = typeof href === "string" ? href : href.pathname ?? "";

    const isActive = end
      ? pathname === hrefStr
      : pathname === hrefStr || (hrefStr !== "/" && pathname.startsWith(`${hrefStr}/`));

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
