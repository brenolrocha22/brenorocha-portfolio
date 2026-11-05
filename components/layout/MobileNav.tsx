"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { contactNavItem, isActivePath, navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

const linkItems = navItems.filter((item) => item.href !== contactNavItem.href);

/**
 * Full-screen mobile menu: focus trapped inside, Esc closes, focus returns to the toggle.
 * The panel is navy inside the light header bar: `.on-dark` restores the light focus outline.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;

    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className="inline-flex size-11 items-center justify-center rounded-sm text-accent-ink transition-colors duration-(--duration-fast) hover:bg-accent-hover"
      >
        <Menu aria-hidden="true" className="size-6" />
        <span className="sr-only">Abrir menu</span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        hidden={!open}
        onKeyDown={handleKeyDown}
        className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background text-foreground"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5 md:px-8">
          <Link
            href="/"
            onClick={() => close(false)}
            className="inline-flex min-h-11 items-center gap-3 rounded-md"
          >
            <span className="font-serif text-[1.625rem] leading-none">Breno Rocha</span>
            <span className="sr-only"> — Início</span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={() => close(true)}
            className="inline-flex size-11 items-center justify-center rounded-md text-foreground transition-colors duration-(--duration-fast) hover:bg-surface-2"
          >
            <X aria-hidden="true" className="size-6" />
            <span className="sr-only">Fechar menu</span>
          </button>
        </div>

        <nav aria-label="Principal (menu)" className="flex flex-1 flex-col gap-10 px-5 py-8 md:px-8">
          <ul className="flex flex-col gap-1">
            {linkItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => close(false)}
                    className={cn(
                      "flex min-h-12 items-center font-serif text-h1 font-normal decoration-2 underline-offset-8 transition-colors duration-(--duration-fast)",
                      active
                        ? "text-foreground underline decoration-accent"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={contactNavItem.href}
            aria-current={isActivePath(pathname, contactNavItem.href) ? "page" : undefined}
            onClick={() => close(false)}
            className="mt-auto inline-flex h-12 items-center justify-center rounded-sm bg-accent px-5 font-medium text-accent-ink transition-colors duration-(--duration-fast) hover:bg-accent-hover"
          >
            {contactNavItem.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
