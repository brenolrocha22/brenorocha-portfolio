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

export const projectTypes = ["ia", "dados", "ml", "web", "automacao", "planilhas"] as const;
export type ProjectType = (typeof projectTypes)[number];
export const projectLanguages = ["python", "typescript", "javascript", "sql", "excel-dax"] as const;
export type ProjectLanguage = (typeof projectLanguages)[number];
export const projectStorages = ["sqlite", "chromadb", "arquivos"] as const;
export type ProjectStorage = (typeof projectStorages)[number];
export const projectBadges = ["demo", "testes", "docker"] as const;
export type ProjectBadge = (typeof projectBadges)[number];

const projectImageSchema = z
  .object({
    /** Public path, e.g. /projects/<slug>/cover.webp. */
    src: z.string().regex(/^\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.(webp|png|jpg)$/),
    alt: z.string().min(10),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .strict();

export const projectCoverSchema = z.union([
  projectImageSchema
    .extend({
      fit: z.enum(["cover", "contain"]).default("cover"),
      /** "paper": light mat behind white-background charts. */
      mat: z.literal("paper").optional(),
    })
    .strict(),
  z.object({ typographic: z.literal(true), lines: z.array(z.string().min(2)).min(1).max(3) }).strict(),
]);

export const projectFrontmatterSchema = z
  .object({
    title: z.string().min(3),
    /** Shorter title used on the card (defaults to `title`). */
    cardTitle: z.string().min(3).optional(),
    slug: slugSchema,
    /** Meta description and case-study intro. */
    summary: z.string().min(20).max(200),
    /** One line shown on the card: the problem. */
    problem: z.string().min(10).max(140),
    /** One line shown on the card: a number with its source in the repository. */
    proof: z.string().min(5).max(90),
    /** First item = main type (badge colour). */
    types: z.array(z.enum(projectTypes)).min(1),
    languages: z.array(z.enum(projectLanguages)).min(1),
    storage: z.array(z.enum(projectStorages)).default([]),
    docker: z.boolean().default(false),
    /** Display order with the default/data focus and with ?foco=dev (1 = first). */
    order: z.number().int(),
    orderDev: z.number().int(),
    /** Omitted when the project state was not confirmed. */
    status: z.enum(["concluido", "em-evolucao", "prototipo"]).optional(),
    stack: z.array(z.string().min(1)).min(1),
    /** Automated tests, as stated in the repository (omitted when there are none). */
    tests: z.string().optional(),
    testsCount: z.number().int().positive().optional(),
    /** Public repository. Empty while the repository is private ("Código em breve"). */
    repoUrl: z.string().regex(/^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/).optional(),
    demoUrl: z.url().optional(),
    /** Additional demos of the same project (e.g. another version), shown after `demoUrl`. */
    extraDemos: z
      .array(z.object({ label: z.string().min(2), url: z.url() }).strict())
      .default([]),
    cover: projectCoverSchema,
    gallery: z.array(projectImageSchema.extend({ caption: z.string().min(5) }).strict()).default([]),
    /** true = has a /projetos/<slug> case study (MDX body). */
    caseStudy: z.boolean(),
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
    /** Draft projects are not rendered. */
    draft: z.boolean().default(false),
  })
  .strict()
  .refine((data) => data.extraDemos.length === 0 || Boolean(data.demoUrl), {
    message: "extraDemos exige um demoUrl principal",
    path: ["extraDemos"],
  });

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

const focusCopySchema = z
  .object({
    /** Main role line (e.g. "Analista de Dados Júnior"). */
    role: z.string().min(5),
    /** Secondary role line ("também …"). */
    alsoRole: z.string().min(5),
    lead: z.string().min(20).max(140),
    /** Stack chips: ids from content/technologies.json (link to #tecnologias). */
    chips: z.array(z.string().min(2)).length(6),
  })
  .strict();

const sectionCopySchema = z
  .object({ label: z.string().min(2), title: z.string().min(5), subtitle: z.string().min(10).optional() })
  .strict();

export const homeSchema = z
  .object({
    hero: z
      .object({
        eyebrow: z.string().min(5),
        scrollHint: z.string().min(5),
        /** Hero carousel: real prints, each one linking to its story/project. */
        slides: z
          .array(
            z
              .object({
                src: z.string().regex(/^\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/),
                width: z.number().int().positive(),
                height: z.number().int().positive(),
                alt: z.string().min(10),
                caption: z.string().min(5).max(60),
                href: z.string().regex(/^(#[a-z0-9-]+|\/[a-z0-9\-/]*)$/),
              })
              .strict(),
          )
          .min(1)
          .max(5),
        ctaPrimary: z.object({ label: z.string().min(3), section: z.enum(["dados", "projetos"]) }).strict(),
        ctaSecondary: z.object({ label: z.string().min(3), section: z.enum(["dados", "projetos"]) }).strict(),
        dados: focusCopySchema,
        dev: focusCopySchema,
      })
      .strict(),
    sections: z
      .object({
        dados: sectionCopySchema,
        projetos: sectionCopySchema,
        trajetoria: sectionCopySchema,
        certificados: sectionCopySchema,
        tecnologias: sectionCopySchema,
        contato: sectionCopySchema,
      })
      .strict(),
  })
  .strict();

export type HomeContent = z.infer<typeof homeSchema>;

/** Trajectory (#trajetoria): work and study tracks from the official 2026 résumé (D17) and certificates. */
export const aboutSchema = z
  .object({
    timeline: z
      .array(
        z
          .object({
            period: z.string().min(4),
            track: z.enum(["trabalho", "estudo", "projetos"]),
            text: z.string().min(10),
            /** Marks the start of the study track (2022). */
            highlight: z.boolean().default(false),
          })
          .strict(),
      )
      .min(1),
    transfer: z
      .object({
        title: z.string().min(5),
        items: z
          .array(
            z
              .object({
                icon: z.enum(["target", "funnel", "message", "languages"]),
                title: z.string().min(2),
                text: z.string().min(10),
              })
              .strict(),
          )
          .length(4),
      })
      .strict(),
    education: z.string().min(10),
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

export const certificationLevels = ["validado", "com-certificado", "andamento", "outro"] as const;

export const certificationSchema = z
  .object({
    name: z.string().min(3),
    institution: z.string().min(2).optional(),
    /** Completion date, or start date when `endDate` or `inProgress` is set ("2026", "2026-11" or "2026-11-04"). */
    date: isoDateSchema.optional(),
    /** End of a course that ran over a period (e.g. "2026-05"). */
    endDate: isoDateSchema.optional(),
    /** Course not finished yet: `date` is the start. */
    inProgress: z.boolean().default(false),
    hours: z.number().positive().optional(),
    /** Public validation code (DIO or e-certificado.com). */
    code: z
      .string()
      .regex(/^[A-Z0-9]{6,24}$/, "código de validação inválido")
      .optional(),
    verifyProvider: z.enum(["dio", "e-certificado"]).optional(),
    level: z.enum(certificationLevels),
    /** Thumbnail in public/certificates (checked: no personal data besides the name). */
    thumb: z
      .object({ src: z.string().regex(/^\/certificates\/[a-z0-9-]+\.webp$/), width: z.number(), height: z.number() })
      .strict()
      .optional(),
    topics: z.string().min(5).optional(),
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
  .refine((cert) => Boolean(cert.code) === Boolean(cert.verifyProvider), {
    message: "code e verifyProvider andam juntos",
    path: ["code"],
  })
  .refine((cert) => (cert.level === "validado") === Boolean(cert.code), {
    message: 'nível "validado" exige código público (e só ele)',
    path: ["level"],
  });

export type Certification = z.infer<typeof certificationSchema>;

export const certificationsSchema = z
  .object({ certifications: z.array(certificationSchema).min(1) })
  .strict();

const storyImageSchema = z
  .object({
    label: z.string().min(2),
    src: z.string().regex(/^\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.webp$/),
    alt: z.string().min(10),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    mat: z.literal("paper").optional(),
  })
  .strict();

export const dataStoriesSchema = z
  .object({
    stories: z
      .array(
        z
          .object({
            id: slugSchema,
            title: z.string().min(5),
            tools: z.array(z.string().min(2)).min(1),
            /** Number of published dashboards shown in this story (feeds the proof bar). */
            dashboards: z.number().int().nonnegative(),
            question: z.string().min(10),
            shown: z.array(z.string().min(10)).min(1).max(3),
            reading: z.string().min(10).optional(),
            /** Badge such as "Dados fictícios" (when the source says so). */
            note: z.string().min(5).optional(),
            images: z.array(storyImageSchema).min(1),
            /** Project that backs the story (case study and repository links). */
            project: slugSchema,
            /** "Como calculei": real excerpts copied from the public repository. */
            code: z
              .array(
                z
                  .object({
                    title: z.string().min(5),
                    language: z.enum(["python", "sql"]),
                    href: z.url(),
                    code: z.string().min(20),
                  })
                  .strict(),
              )
              .default([]),
            codeNote: z.string().min(10).optional(),
            compact: z.boolean().default(false),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export type DataStoriesContent = z.infer<typeof dataStoriesSchema>;

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
