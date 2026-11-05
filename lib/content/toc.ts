export type TocItem = { id: string; title: string };

export function slugifyHeading(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Table of contents from level-2 headings ("## Título") of the MDX body. */
export function extractToc(source: string): TocItem[] {
  const body = source.replace(/^---[\s\S]*?\n---/, "");
  return [...body.matchAll(/^##\s+(.+?)\s*$/gm)].flatMap((match) => {
    const title = match[1];
    return title ? [{ id: slugifyHeading(title), title }] : [];
  });
}
