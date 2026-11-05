import { z } from "zod";
import homeData from "@/content/home.json";
import { homeSchema, type HomeContent } from "./schemas";

export type { HomeContent };

function loadHome(): HomeContent {
  const result = homeSchema.safeParse(homeData);
  if (!result.success) {
    throw new Error(`Conteúdo inválido em content/home.json:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Parsed once at module load: invalid content fails the build.
const home = loadHome();

export function getHomeContent(): HomeContent {
  return home;
}
