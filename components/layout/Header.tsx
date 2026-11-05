import { contactNavItem } from "@/lib/site";
import { getProfile } from "@/lib/content/profile";
import { Container } from "./Container";
import { DesktopNav } from "./DesktopNav";
import { HeaderFrame } from "./HeaderFrame";
import { MobileNav } from "./MobileNav";
import { Monogram } from "./Monogram";
import { NavLink } from "./NavLink";

export function Header() {
  const profile = getProfile();

  return (
    <HeaderFrame>
      <Container className="flex h-full items-center justify-between gap-4">
        <NavLink href="/" className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-md">
          <Monogram />
          {/* D14: name visible at every width (fits 360px next to the menu button). */}
          <span className="font-medium whitespace-nowrap">{profile.shortName}</span>
          <span className="sr-only"> — Início</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <DesktopNav />
          <NavLink
            href={contactNavItem.href}
            className="hidden h-11 items-center rounded-md bg-accent px-5 text-small font-medium text-accent-ink transition-colors duration-150 hover:bg-accent-hover lg:inline-flex"
            activeClassName="underline decoration-2 underline-offset-4"
          >
            {contactNavItem.label}
          </NavLink>
          <MobileNav />
        </div>
      </Container>
    </HeaderFrame>
  );
}
