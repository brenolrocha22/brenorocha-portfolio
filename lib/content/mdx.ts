import type { ReactElement } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/mdx-components";

// Only module that knows about next-mdx-remote: switching to @next/mdx changes this file only.

export type CompiledMdx = {
  content: ReactElement;
  frontmatter: Record<string, unknown>;
};

export async function compileProjectMdx(source: string): Promise<CompiledMdx> {
  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source,
    components: mdxComponents,
    // Own, versioned content: JS expressions stay blocked (next-mdx-remote default).
    options: { parseFrontmatter: true },
  });
  return { content, frontmatter };
}
