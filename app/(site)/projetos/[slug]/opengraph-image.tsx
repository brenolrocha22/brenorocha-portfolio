import { ImageResponse } from "next/og";
import { categoryLabels, projectCategoriesOf } from "@/lib/content/categories";
import { getProject, getProjectSlugs } from "@/lib/content/projects";
import { ogColors, ogSize } from "@/lib/seo/og";

export const alt = "Estudo de caso de projeto de Breno Rocha";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  const title = project?.title ?? "Projeto";
  const eyebrow = project
    ? projectCategoriesOf(project)
        .map((category) => categoryLabels[category])
        .join(" · ")
    : "Projetos";
  const stack = project?.stack.slice(0, 5).join(" · ") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: ogColors.bg,
          color: ogColors.text,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: ogColors.accent, letterSpacing: 2 }}>
          {eyebrow.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.08, maxWidth: 1050 }}>{title}</div>
          {project?.highlight ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "10px 18px",
                borderRadius: 8,
                background: ogColors.surface,
                border: `1px solid ${ogColors.border}`,
                fontSize: 30,
              }}
            >
              {project.highlight}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: ogColors.muted }}>
          <div style={{ display: "flex" }}>{stack}</div>
          <div style={{ display: "flex" }}>Breno Rocha · Tech &amp; Data</div>
        </div>
      </div>
    ),
    size,
  );
}
