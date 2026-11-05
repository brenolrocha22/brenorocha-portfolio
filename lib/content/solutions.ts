import solutionsData from "@/content/solutions.json";
import { parseContent } from "./load";
import { resolveProjectRefs, type ProjectRef } from "./project-refs";
import { solutionsSchema, type SolutionsContent } from "./schemas";

const FILE = "content/solutions.json";

export type SolutionView = Omit<SolutionsContent["solutions"][number], "projects"> & {
  projects: ProjectRef[];
};
export type SolutionsView = Omit<SolutionsContent, "solutions"> & { solutions: SolutionView[] };

// Parsed once at module load: invalid content fails the build.
const content = parseContent(solutionsSchema, solutionsData, FILE);

export async function getSolutions(): Promise<SolutionsView> {
  const solutions = await Promise.all(
    content.solutions.map(async (solution) => ({
      ...solution,
      projects: await resolveProjectRefs(solution.projects, FILE),
    })),
  );
  return { ...content, solutions };
}
