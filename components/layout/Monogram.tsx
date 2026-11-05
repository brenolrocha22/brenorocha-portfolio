import { cn } from "@/lib/utils";

const variants = {
  /** Brand mark in the header/footer. */
  mark: "size-9 rounded-md border-border-strong font-mono text-small font-medium",
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
