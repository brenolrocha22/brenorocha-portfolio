/** Shared button/link/title classes (design system §3.3, redesign D22). */
export const primaryButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-accent px-6 text-small font-medium text-accent-ink transition-[background-color,box-shadow] duration-(--duration-fast) hover:bg-accent-hover hover:shadow-glow-sm";

export const secondaryButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-border-strong px-6 text-small font-medium text-foreground transition-colors duration-(--duration-fast) hover:border-accent/60 hover:bg-surface-2";

export const ghostLinkClass =
  "inline-flex min-h-11 items-center gap-1 text-small font-medium text-accent underline-offset-4 hover:underline";

export const eyebrowClass = "font-mono text-mono-xs text-muted-foreground uppercase";

/** D22: page H1s and section H2s in Instrument Serif, large, normal weight. */
export const pageTitleClass = "font-serif text-title font-normal text-balance";
export const sectionTitleClass = "font-serif text-section font-normal text-balance";
/** Smaller serif H2 for blocks inside inner pages. */
export const blockTitleClass = "font-serif text-h1 font-normal text-balance";
