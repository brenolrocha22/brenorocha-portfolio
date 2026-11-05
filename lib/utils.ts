import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom font-size tokens from app/globals.css (@theme). Without registering them,
 * tailwind-merge reads `text-small` as a color and drops it next to `text-muted-foreground`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "body-lg", "body", "small", "mono-xs"],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
