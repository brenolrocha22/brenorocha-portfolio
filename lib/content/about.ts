import aboutData from "@/content/about.json";
import { parseContent } from "./load";
import { aboutSchema, type AboutContent } from "./schemas";

export type { AboutContent };

// Parsed once at module load: invalid content fails the build.
const about = parseContent(aboutSchema, aboutData, "content/about.json");

export function getAboutContent(): AboutContent {
  return about;
}
