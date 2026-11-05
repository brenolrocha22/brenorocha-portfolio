import { contactNavItem } from "@/lib/site";
import { getProfile } from "@/lib/content/profile";
import { DesktopNav } from "./DesktopNav";
import { HeaderFrame } from "./HeaderFrame";
import { MobileNav } from "./MobileNav";
import { NavLink } from "./NavLink";

export function Header() {
  const profile = getProfile();

  return (
    <HeaderFrame>
      <div className="flex h-full items-center justify-between gap-4 pr-1.5 pl-4 md:pl-6 lg:pr-2">
        <NavLink href="/" className="inline-flex min-h-11 shrink-0 items-center rounded-sm">
          {/* D22: name in serif on the light bar (visible at every width). */}
          <span className="font-serif text-[1.625rem] leading-none whitespace-nowrap">{profile.shortName}</span>
          <span className="sr-only"> — Início</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <DesktopNav />
          <NavLink
            href={contactNavItem.href}
            className="hidden h-10 items-center rounded-sm bg-accent-ink px-5 text-small font-medium text-accent transition-colors duration-(--duration-fast) hover:text-accent-hover lg:inline-flex"
            activeClassName="underline decoration-2 underline-offset-4"
          >
            {contactNavItem.label}
          </NavLink>
          <MobileNav />
        </div>
      </div>
    </HeaderFrame>
  );
}
