"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { ArrowDown, Check, Copy, Mail, MessageCircle, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { useActiveSection } from "@/lib/active-section";
import { SectionLink } from "./SectionLink";
import { SPRING_SOFT } from "@/lib/motion";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

type ContactFabProps = { email: string; linkedin: string; github: string };

const CALL_KEY = "fab-call-done";
const itemClass =
  "flex min-h-11 w-full items-center gap-3 rounded-sm px-3 text-left text-small text-foreground transition-colors duration-(--duration-fast) hover:bg-surface-2";

/**
 * Floating contact button (mobile and desktop): shown after leaving the hero, hidden while
 * #contato is on screen.
 */
export function ContactFab({ email, linkedin, github }: ContactFabProps) {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const [calling, setCalling] = useState(false);
  const { copy, feedback, copied } = useCopy("E-mail copiado.");
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const onHome = usePathname() === "/";
  const pastHero = !onHome || (active !== null && active !== "inicio");
  // Hidden over the hero at every width (it already lists the channels and, on mobile, the
  // FAB would cover the carousel) and over #contato.
  const visible = active !== "contato" && pastHero;

  // One "call" per session, 8 s after load, if the visitor has not interacted yet.
  useEffect(() => {
    let done = false;
    try {
      done = sessionStorage.getItem(CALL_KEY) === "1";
    } catch {}
    if (done) return;
    const stop = () => window.clearTimeout(timer);
    const timer = window.setTimeout(() => {
      setCalling(true);
      try {
        sessionStorage.setItem(CALL_KEY, "1");
      } catch {}
    }, 8000);
    window.addEventListener("pointerdown", stop, { once: true });
    window.addEventListener("keydown", stop, { once: true });
    return () => {
      stop();
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    function onPointer(event: PointerEvent) {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  function closePanel() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex flex-col items-end"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          closePanel();
        }
      }}
    >
      <AnimatePresence>
        {open && visible ? (
          <m.div
            ref={panelRef}
            id={panelId}
            role="group"
            aria-label="Canais de contato"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            style={{ transformOrigin: "bottom right" }}
            className="mb-3 w-72 rounded-lg border border-border-strong bg-surface p-2 shadow-card"
          >
            <ul className="grid gap-0.5">
              <li>
                <button type="button" className={itemClass} onClick={() => copy(email)}>
                  {copied ? (
                    <Check aria-hidden="true" className="size-4 text-success" />
                  ) : (
                    <Copy aria-hidden="true" className="size-4 text-accent" />
                  )}
                  Copiar e-mail
                </button>
              </li>
              <li>
                <a href={`mailto:${email}`} className={itemClass}>
                  <Mail aria-hidden="true" className="size-4 text-accent" />
                  Escrever e-mail
                </a>
              </li>
              <li>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className={itemClass}>
                  <LinkedinIcon className="size-4 text-accent" />
                  LinkedIn<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li>
                <a href={github} target="_blank" rel="noopener noreferrer" className={itemClass}>
                  <GithubIcon className="size-4 text-accent" />
                  GitHub<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
              <li className="mt-1 border-t border-border pt-1">
                <SectionLink section="contato" className={itemClass} onClick={() => setOpen(false)}>
                  <ArrowDown aria-hidden="true" className="size-4 text-accent" />
                  Ir para o contato
                </SectionLink>
              </li>
            </ul>
          </m.div>
        ) : null}
      </AnimatePresence>

      <span role="status" aria-live="polite" className="sr-only">
        {feedback}
      </span>

      <AnimatePresence>
        {visible ? (
          <m.div
            key="fab"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1, transition: SPRING_SOFT }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
            className="relative"
          >
            {calling ? (
              <span
                aria-hidden="true"
                onAnimationEnd={() => setCalling(false)}
                className="fab-call pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
              />
            ) : null}
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((value) => !value)}
              className={cn(
                "on-accent relative inline-flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-accent px-4 font-medium text-accent-ink shadow-card transition-colors duration-(--duration-fast) hover:bg-accent-hover",
              )}
            >
              {open ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <MessageCircle aria-hidden="true" className="size-5" />
              )}
              <span className="max-[399px]:sr-only">Contato</span>
            </button>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
