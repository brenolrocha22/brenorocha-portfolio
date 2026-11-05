/** Shared button/link classes (design system §3.3) used by project pages. */
export const primaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-accent px-5 text-small font-medium text-accent-ink transition-[background-color,box-shadow] duration-(--duration-fast) hover:bg-accent-hover hover:shadow-glow-sm";

export const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-border-strong px-5 text-small font-medium text-foreground transition-colors duration-(--duration-fast) hover:border-accent/50 hover:bg-surface-2";

export const ghostLinkClass =
  "inline-flex min-h-11 items-center gap-1 text-small font-medium text-accent underline-offset-4 hover:underline";

export const eyebrowClass = "font-mono text-mono-xs text-muted-foreground uppercase";
