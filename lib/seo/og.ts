/**
 * Design tokens for next/og images (docs/design/design-system.md §2). ImageResponse
 * cannot read CSS variables, so the values mirror styles/tokens.css.
 */
export const ogColors = {
  bg: "#0b0d0e",
  surface: "#131618",
  surface2: "#1a1e21",
  border: "#262b2f",
  text: "#e8e6e1",
  muted: "#9ba1a6",
  accent: "#e0a458",
  gridLine: "rgba(232,230,225,0.06)",
  accentLine: "rgba(224,164,88,0.4)",
} as const;

/** Technical 1px grid (design-refresh §3) as inline styles for next/og. */
export const ogGridBackground = {
  backgroundImage: `linear-gradient(to right, ${ogColors.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${ogColors.gridLine} 1px, transparent 1px)`,
  backgroundSize: "48px 48px",
} as const;

export const ogSize = { width: 1200, height: 630 } as const;
