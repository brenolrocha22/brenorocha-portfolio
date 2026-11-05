/**
 * Design tokens for next/og images (D22 navy + light-blue palette). ImageResponse
 * cannot read CSS variables, so the values mirror styles/tokens.css.
 */
export const ogColors = {
  bg: "#060b18",
  surface: "#0c1428",
  surface2: "#121d38",
  border: "#1c2a4a",
  text: "#eaf2fb",
  muted: "#a3b4cc",
  accent: "#a9d2f5",
  accentInk: "#071022",
  gridLine: "rgba(169,210,245,0.06)",
  accentLine: "rgba(169,210,245,0.4)",
  /** Blue veil over the photo (Satori has no CSS filters/blend modes: approximates the duotone). */
  photoTint: "rgba(14,44,104,0.5)",
  glow: "radial-gradient(ellipse 70% 70% at 80% 50%, rgba(80,140,220,0.22), transparent 70%)",
} as const;

/** Technical 1px grid (design-refresh §3) as inline styles for next/og. */
export const ogGridBackground = {
  backgroundImage: `linear-gradient(to right, ${ogColors.gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${ogColors.gridLine} 1px, transparent 1px)`,
  backgroundSize: "48px 48px",
} as const;

export const ogSize = { width: 1200, height: 630 } as const;
