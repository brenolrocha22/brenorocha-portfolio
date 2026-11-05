import { skillLevelMeta } from "@/lib/content/technologies";
import type { SkillLevel } from "@/lib/content/schemas";
import { cn } from "@/lib/utils";

/** Level marker + text (design system §3.6): never color alone, no percentage bars. */
export function SkillLevelBadge({ level, className }: { level: SkillLevel; className?: string }) {
  const meta = skillLevelMeta[level];
  return (
    <span className={cn("inline-flex items-center gap-2 font-mono text-mono-xs uppercase", className)}>
      <span aria-hidden="true" className={cn("tracking-widest", meta.className)}>
        {meta.marker}
      </span>
      <span className="text-muted-foreground">{meta.label}</span>
    </span>
  );
}
