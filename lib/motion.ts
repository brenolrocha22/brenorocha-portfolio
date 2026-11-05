// Motion constants mirroring styles/tokens.css (motion cannot read CSS vars in `transition`).
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const SPRING_LAYOUT = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 220, damping: 26 } as const;
export const REVEAL = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: EASE_OUT_EXPO },
} as const;
export const STAGGER = 0.06;
export const STAGGER_MAX = 8;

export function staggerDelay(index: number, step = STAGGER): number {
  return Math.min(index, STAGGER_MAX - 1) * step;
}
