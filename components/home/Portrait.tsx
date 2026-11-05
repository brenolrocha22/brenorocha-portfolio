import { Monogram } from "@/components/layout/Monogram";
import { cn } from "@/lib/utils";

/**
 * Portrait with fallback (design system §3.9). No photo has been provided yet,
 * so it renders the "BR" monogram.
 */
export function Portrait({ className }: { className?: string }) {
  return (
    <div role="img" aria-label="Monograma de Breno Rocha" className={cn("shrink-0", className)}>
      <Monogram variant="portrait" />
    </div>
  );
}
