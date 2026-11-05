import { cn } from "@/lib/utils";

const variants = {
  /** Brand mark in the header/footer. */
  mark: "size-9 rounded-md border-border-strong font-mono text-small font-medium",
  /** Portrait fallback (design system §3.9): 160px mobile, 240px desktop. */
  portrait:
    "size-40 rounded-full border-border-strong font-sans text-h1 font-semibold ring-1 ring-accent/40 ring-offset-4 ring-offset-background lg:size-60 lg:text-display",
} as const;

type MonogramProps = {
  className?: string;
  variant?: keyof typeof variants;
};

/** "BR" monogram (decorative; pair with visible or sr-only text, or an aria-label on a wrapper). */
export function Monogram({ className, variant = "mark" }: MonogramProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center border bg-surface-2 text-foreground",
        variants[variant],
        className,
      )}
    >
      BR
    </span>
  );
}
