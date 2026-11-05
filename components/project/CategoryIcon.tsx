import { AppWindow, BrainCircuit, Bot, Database, Workflow, type LucideIcon } from "lucide-react";
import type { ProjectCategory } from "@/lib/content/schemas";

const icons: Record<ProjectCategory, LucideIcon> = {
  ia: Bot,
  dados: Database,
  ml: BrainCircuit,
  web: AppWindow,
  automacao: Workflow,
};

export function CategoryIcon({ category, className }: { category: ProjectCategory; className?: string }) {
  const Icon = icons[category];
  return <Icon aria-hidden="true" className={className} />;
}
