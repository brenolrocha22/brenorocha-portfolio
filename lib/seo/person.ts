import type { Profile } from "@/lib/content/profile";
import { getTechnicalSkillNames } from "@/lib/content/technologies";
import { absoluteUrl } from "@/lib/site";

/** Stable identifier shared by every Person/author reference (Home, /sobre, projects). */
export const personId = () => absoluteUrl("/#person");

/** schema.org Person with only the data approved for publication (CLAUDE.md). */
export function personJsonLd(profile: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(),
    name: profile.name,
    alternateName: profile.shortName,
    // Target role = first part of the headline ("Analista de Dados Júnior · também …").
    jobTitle: profile.headline?.split(" · ")[0] ?? "Analista de Dados Júnior",
    description: profile.tagline,
    url: absoluteUrl("/"),
    email: `mailto:${profile.email}`,
    sameAs: [profile.linkedin, profile.github],
    // Only skills declared in content/technologies.json (no invented competencies).
    knowsAbout: getTechnicalSkillNames(),
    knowsLanguage: ["pt-BR", "en"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Recife",
      addressRegion: "PE",
      addressCountry: "BR",
    },
  };
}
