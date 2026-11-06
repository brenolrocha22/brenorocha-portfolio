"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, m } from "motion/react";
import { Mail, Menu, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { useActiveSection } from "@/lib/active-section";
import { SPRING_SOFT } from "@/lib/motion";
import { navSections, sectionLabel, sections } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SectionLink } from "./SectionLink";

const FOCUSABLE = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

type SiteNavProps = { email: string; linkedin: string; github: string };

/** Desktop: anchor links with a sliding active pill. Below 1024 px: current section name + menu sheet. */
export function SiteNav({ email, linkedin, github }: SiteNavProps) {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
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
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
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

  const currentLabel = active && active !== "inicio" ? sectionLabel(active) : "";

  return (
    <>
      <nav aria-label="Principal" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {navSections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id} className="relative">
                {isActive ? (
                  <m.span
                    layoutId="nav-active"
                    transition={SPRING_SOFT}
                    aria-hidden="true"
                    className="absolute inset-x-0 inset-y-1.5 rounded-sm bg-accent-ink/12"
                  />
                ) : null}
                <SectionLink
                  section={section.id}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative inline-flex min-h-11 items-center gap-1.5 px-3 text-small transition-colors duration-(--duration-fast)",
                    isActive ? "font-semibold" : "hover:underline hover:decoration-1 hover:underline-offset-[6px]",
                  )}
                >
                  {section.label}
                </SectionLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <SectionLink
        section="contato"
        aria-current={active === "contato" ? "location" : undefined}
        className="on-dark hidden h-10 items-center rounded-sm bg-accent-ink px-5 text-small font-medium text-accent transition-colors duration-(--duration-fast) hover:text-accent-hover lg:inline-flex"
      >
        Contato
      </SectionLink>

      {/* Mobile/tablet: name of the current section (crossfade) + menu. */}
      <div className="flex items-center gap-1 lg:hidden">
        <span aria-hidden="true" className="relative block h-6 w-28 overflow-hidden text-right">
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={currentLabel}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 font-mono text-mono-xs leading-6 uppercase"
            >
              {currentLabel}
            </m.span>
          </AnimatePresence>
        </span>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(true)}
          className="inline-flex size-11 items-center justify-center rounded-sm transition-colors duration-(--duration-fast) hover:bg-accent-hover"
        >
          <Menu aria-hidden="true" className="size-6" />
          <span className="sr-only">Abrir menu</span>
        </button>
      </div>

      <div
        id={panelId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        hidden={!open}
        onKeyDown={handleKeyDown}
        className="on-dark fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background text-foreground lg:hidden"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <span className="font-serif text-[1.625rem] leading-none">Breno Rocha</span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => close(true)}
            className="inline-flex size-11 items-center justify-center rounded-md transition-colors duration-(--duration-fast) hover:bg-surface-2"
          >
            <X aria-hidden="true" className="size-6" />
            <span className="sr-only">Fechar menu</span>
          </button>
        </div>

        <nav aria-label="Principal (menu)" className="flex flex-1 flex-col gap-8 px-5 py-6">
          <ul className="flex flex-col">
            {sections.map((section) => (
              <li key={section.id}>
                <SectionLink
                  section={section.id}
                  onClick={() => close(false)}
                  aria-current={active === section.id ? "location" : undefined}
                  className={cn(
                    "flex min-h-12 items-baseline gap-3 font-serif text-h1 transition-colors duration-(--duration-fast)",
                    active === section.id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {section.label}
                </SectionLink>
              </li>
            ))}
          </ul>
          <ul aria-label="Canais de contato" className="mt-auto grid gap-2 border-t border-border pt-6 text-small">
            <li>
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-3 break-all">
                <Mail aria-hidden="true" className="size-5 shrink-0 text-accent" />
                {email}
              </a>
            </li>
            <li>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3">
                <LinkedinIcon className="size-5 text-accent" />
                LinkedIn<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3">
                <GithubIcon className="size-5 text-accent" />
                GitHub<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
