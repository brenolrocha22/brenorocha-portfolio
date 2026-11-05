"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNavItems, isActivePath } from "@/lib/site";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {headerNavItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center px-3 text-small transition-colors duration-(--duration-fast)",
                  "text-accent-ink underline-offset-[6px] decoration-2",
                  // D22: dark ink on the light bar; active page underlined.
                  active ? "underline" : "hover:underline hover:decoration-1",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
