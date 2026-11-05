"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { goToSection } from "@/lib/active-section";
import type { SectionId } from "@/lib/site";

type SectionLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & { section: SectionId };

/**
 * Link to a one-page section. Plain `/#id` href (works without JS and from case studies);
 * on the Home it scrolls smoothly, focuses the section heading and updates the hash.
 */
export function SectionLink({ section, onClick, ...props }: SectionLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || pathname !== "/" || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    goToSection(section);
  }

  return <a href={section === "inicio" ? "/" : `/#${section}`} onClick={handleClick} {...props} />;
}
