import { z } from "zod";
import profileData from "@/content/profile.json";
import { profileSchema, type Profile } from "./schemas";

export type { Profile };

function loadProfile(): Profile {
  const result = profileSchema.safeParse(profileData);
  if (!result.success) {
    throw new Error(`Conteúdo inválido em content/profile.json:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

// Parsed once at module load: invalid content fails the build.
const profile = loadProfile();

export function getProfile(): Profile {
  return profile;
}
