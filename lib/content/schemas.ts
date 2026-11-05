import { z } from "zod";

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use apenas letras minúsculas, números e hífens");

/** Accepts "2026", "2026-11" or "2026-11-04" (only what is actually known). */
export const isoDateSchema = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "data ISO inválida");

export const profileSchema = z.object({
  name: z.string().min(3),
  shortName: z.string().min(3),
  tagline: z.string().min(10),
  location: z.string().min(2),
  email: z.email(),
  linkedin: z.url(),
  github: z.url(),
  headline: z.string().optional(),
  availability: z.string().optional(),
});

export type Profile = z.infer<typeof profileSchema>;

export const projectCategories = ["ia", "dados", "ml", "web", "automacao"] as const;
export const projectCategorySchema = z.enum(projectCategories);
export type ProjectCategory = z.infer<typeof projectCategorySchema>;

export const projectFrontmatterSchema = z
  .object({
    title: z.string().min(3),
    slug: slugSchema,
    /** Card text and meta description. */
    summary: z.string().min(20).max(200),
    category: projectCategorySchema,
    /** Other areas the project also belongs to (used by the filter and the eyebrow). */
    extraCategories: z.array(projectCategorySchema).default([]),
    featured: z.boolean().default(false),
    /** Display order (1 = first). */
    order: z.number().int().default(100),
    /** Omitted when the project state was not confirmed. */
    status: z.enum(["concluido", "em-evolucao", "prototipo"]).optional(),
    stack: z.array(z.string().min(1)).min(1),
    /** One verifiable fact shown on the card. */
    highlight: z.string().max(80).optional(),
    /** Automated tests, as stated in the repository (omitted when there are none). */
    tests: z.string().optional(),
    github: z.object({ owner: z.string().min(1), repo: z.string().min(1) }).optional(),
    privateRepo: z.boolean().default(false),
    demoUrl: z.url().optional(),
    /** Additional demos of the same project (e.g. another version), shown after `demoUrl`. */
    extraDemos: z
      .array(z.object({ label: z.string().min(2), url: z.url() }).strict())
      .default([]),
    cover: z.object({ src: z.string().min(1), alt: z.string().min(5) }).optional(),
    metrics: z
      .array(
        z.object({
          label: z.string().min(2),
          value: z.string().min(1),
          source: z.string().optional(),
        }),
      )
      .default([]),
    publishedAt: isoDateSchema.optional(),
    updatedAt: isoDateSchema.optional(),
    /** Draft projects do not generate pages. */
    draft: z.boolean().default(false),
  })
  .strict()
  .refine((data) => data.extraDemos.length === 0 || Boolean(data.demoUrl), {
    message: "extraDemos exige um demoUrl principal",
    path: ["extraDemos"],
  })
  .refine((data) => !(data.privateRepo && data.github), {
    message: "repositório privado não pode ter link do GitHub",
    path: ["github"],
  });

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

const internalHrefSchema = z.string().regex(/^\/[a-z0-9\-/]*$/, "use um caminho interno (ex.: /projetos)");

export const homeSchema = z
  .object({
    hero: z.object({
      eyebrow: z.string().min(5),
      pitch: z.array(z.string().min(10)).min(1).max(3),
      facts: z
        .array(
          z.object({
            value: z.string().min(1),
            label: z.string().min(2),
            href: internalHrefSchema.optional(),
          }),
        )
        .length(3),
    }),
    differential: z.object({
      eyebrow: z.string().min(2),
      title: z.string().min(5),
      steps: z
        .array(
          z.object({
            title: z.string().min(2),
            text: z.string().min(10),
            href: internalHrefSchema.optional(),
            linkLabel: z.string().min(2).optional(),
          }),
        )
        .min(1),
    }),
    trajectory: z.object({
      eyebrow: z.string().min(2),
      title: z.string().min(5),
      milestones: z.array(z.object({ title: z.string().min(2), text: z.string().min(10) })).min(1),
    }),
    contact: z.object({ title: z.string().min(5), text: z.string().min(10) }),
  })
  .strict();

export type HomeContent = z.infer<typeof homeSchema>;

const titledTextSchema = z.object({ title: z.string().min(2), text: z.string().min(5) });

export const aboutSchema = z
  .object({
    eyebrow: z.string().min(2),
    title: z.string().min(5),
    subtitle: z.string().min(5),
    summary: z.string().min(20),
    narrative: z
      .array(
        titledTextSchema.extend({
          href: internalHrefSchema.optional(),
          linkLabel: z.string().min(2).optional(),
        }),
      )
      .min(1),
    howIWork: z.object({ title: z.string().min(2), steps: z.array(titledTextSchema).min(1) }),
    /** Work history from the official 2026 résumé (D17): company, role and period only as stated there. */
    experience: z
      .object({
        title: z.string().min(2),
        items: z
          .array(
            z
              .object({
                role: z.string().min(2),
                company: z.string().min(2),
                /** "06/2024 – 12/2024", "2024 – atual"... exactly as in the résumé. */
                period: z.string().min(4),
                place: z.string().min(2),
                text: z.string().min(10),
              })
              .strict(),
          )
          .min(1),
        /** One-line summary of earlier roles. */
        earlier: z.string().min(10).optional(),
      })
      .strict(),
    timeline: z.object({ title: z.string().min(2), milestones: z.array(titledTextSchema).min(1) }),
  })
  .strict();

export type AboutContent = z.infer<typeof aboutSchema>;

/**
 * Competency levels (design system §3.6). "estudando" is intentionally absent until
 * Breno confirms what he is studying (pending item 6).
 */
export const skillLevels = ["projetos", "nocoes", "profissional"] as const;
export const skillLevelSchema = z.enum(skillLevels);
export type SkillLevel = z.infer<typeof skillLevelSchema>;

const githubRepoNameSchema = z.string().regex(/^[A-Za-z0-9._-]+$/, "nome de repositório inválido");

export const skillSchema = z
  .object({
    /** Anchor id (/tecnologias#<id>). */
    id: slugSchema,
    name: z.string().min(2),
    detail: z.string().min(2).optional(),
    level: skillLevelSchema,
    /** Case-study slugs that prove the skill (must exist in content/projects). */
    projects: z.array(slugSchema).default([]),
    /** Other public repositories of the profile that prove the skill (no case study). */
    repos: z.array(githubRepoNameSchema).default([]),
  })
  .strict()
  .refine((skill) => skill.level !== "projetos" || skill.projects.length + skill.repos.length > 0, {
    message: 'nível "uso em projetos" exige ao menos um projeto ou repositório como evidência',
    path: ["projects"],
  })
  .refine((skill) => skill.level === "projetos" || skill.projects.length + skill.repos.length === 0, {
    message: 'só o nível "uso em projetos" leva links de evidência',
    path: ["projects"],
  });

export type Skill = z.infer<typeof skillSchema>;

export const technologiesSchema = z
  .object({
    intro: z.string().min(20),
    groups: z
      .array(z.object({ id: slugSchema, title: z.string().min(2), items: z.array(skillSchema).min(1) }).strict())
      .min(1),
  })
  .strict();

export type TechnologiesContent = z.infer<typeof technologiesSchema>;

export const certificationSchema = z
  .object({
    name: z.string().min(3),
    /** Omitted while not confirmed (pending item 8). */
    institution: z.string().min(2).optional(),
    /** Completion date, or start date when `endDate` or `inProgress` is set. */
    date: isoDateSchema.optional(),
    /** End of a course that ran over a period (e.g. "2026-05"). */
    endDate: isoDateSchema.optional(),
    /** Course not finished yet: `date` is the start. */
    inProgress: z.boolean().default(false),
    hours: z.number().positive().optional(),
    /** DIO validation code: builds https://www.dio.me/certificate/<code>. */
    code: z
      .string()
      .regex(/^[A-Z0-9]{6,12}$/, "código de validação inválido")
      .optional(),
  })
  .strict()
  .refine((cert) => !(cert.inProgress && (cert.endDate || cert.code)), {
    message: "curso em andamento não tem data de término nem código de validação",
    path: ["inProgress"],
  })
  .refine((cert) => !cert.endDate || Boolean(cert.date), {
    message: "endDate exige date (início)",
    path: ["endDate"],
  })
  .refine((cert) => !cert.code || cert.institution === "DIO", {
    message: "código de validação só é suportado para certificados da DIO",
    path: ["code"],
  });

export type Certification = z.infer<typeof certificationSchema>;

export const certificationsSchema = z
  .object({
    title: z.string().min(5),
    intro: z.string().min(20),
    certifications: z.array(certificationSchema).min(1),
  })
  .strict();

export const solutionsSchema = z
  .object({
    eyebrow: z.string().min(2),
    title: z.string().min(5),
    intro: z.string().min(20),
    solutions: z
      .array(
        z
          .object({
            id: slugSchema,
            title: z.string().min(5),
            problem: z.string().min(10),
            approach: z.string().min(10),
            /** Case-study slugs used as proof (must exist in content/projects). */
            projects: z.array(slugSchema).min(1),
          })
          .strict(),
      )
      .min(1),
    cta: z.object({ title: z.string().min(5), text: z.string().min(10) }).strict(),
  })
  .strict();

export type SolutionsContent = z.infer<typeof solutionsSchema>;

const contactSubjectOptionSchema = z
  .object({ value: z.enum(["vaga", "solucao", "outro"]), label: z.string().min(2) })
  .strict();

export const contactSchema = z
  .object({
    eyebrow: z.string().min(2),
    title: z.string().min(5),
    intro: z.string().min(20),
    channelsTitle: z.string().min(2),
    availability: z.string().min(5),
    subjects: z.array(contactSubjectOptionSchema).length(3),
    messages: z
      .object({
        success: z.string().min(10),
        unavailable: z.string().min(10),
        rateLimited: z.string().min(10),
        error: z.string().min(10),
        invalid: z.string().min(10),
        expired: z.string().min(10),
      })
      .strict(),
  })
  .strict();

export type ContactContent = z.infer<typeof contactSchema>;
