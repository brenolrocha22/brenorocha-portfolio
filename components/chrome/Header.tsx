import { getProfile } from "@/lib/content/profile";
import { HeaderFrame } from "./HeaderFrame";
import { SectionLink } from "./SectionLink";
import { SiteNav } from "./SiteNav";

export function Header() {
  const profile = getProfile();

  return (
    <HeaderFrame>
      <div className="flex h-full items-center justify-between gap-4 pr-1.5 pl-4 md:pl-6 lg:pr-2">
        <SectionLink section="inicio" className="inline-flex min-h-11 shrink-0 items-center rounded-sm">
          <span className="font-serif text-[1.625rem] leading-none whitespace-nowrap">{profile.shortName}</span>
          <span className="sr-only"> — Início</span>
        </SectionLink>
        <div className="flex items-center gap-2">
          <SiteNav email={profile.email} linkedin={profile.linkedin} github={profile.github} />
        </div>
      </div>
    </HeaderFrame>
  );
}
