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
} as const;

export const ogSize = { width: 1200, height: 630 } as const;
