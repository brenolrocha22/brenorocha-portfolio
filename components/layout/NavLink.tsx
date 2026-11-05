"use client";

import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/lib/site";
import { cn } from "@/lib/utils";

type NavLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
  /** Extra classes applied when the link points to the current page. */
  activeClassName?: string;
};

/** Link that exposes `aria-current="page"` (and an optional visual state) on its own route. */
export function NavLink({ href, className, activeClassName, ...props }: NavLinkProps) {
  const active = isActivePath(usePathname(), href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(className, active && activeClassName)}
      {...props}
    />
  );
}
