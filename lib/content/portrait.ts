import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

/** Public path of Breno's photo (D20). Until the file is added, the "BR" monogram is shown. */
export const PORTRAIT_SRC = "/images/breno.jpg";

export const PORTRAIT_ALT = "Retrato de Breno Rocha, de frente, de camisa branca e gravata escura";

const portraitFile = path.join(process.cwd(), "public", PORTRAIT_SRC);

/**
 * True when public/images/breno.jpg exists. Pages using it are static, so the check
 * runs at build time: adding the file and rebuilding is enough to switch to the photo.
 */
export function hasPortraitPhoto(): boolean {
  return existsSync(portraitFile);
}

/** Photo as a data URI for next/og (Satori), or null when the file is missing. */
export async function readPortraitDataUri(): Promise<string | null> {
  if (!hasPortraitPhoto()) return null;
  const buffer = await readFile(portraitFile);
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}
