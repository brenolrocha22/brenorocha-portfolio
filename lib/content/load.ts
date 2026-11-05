import { z } from "zod";

/** Validates a JSON content file; invalid content throws (and fails the build). */
export function parseContent<T extends z.ZodType>(schema: T, data: unknown, file: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Conteúdo inválido em ${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
