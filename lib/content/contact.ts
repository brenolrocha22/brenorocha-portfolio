import contactData from "@/content/contact.json";
import { parseContent } from "./load";
import { contactSchema, type ContactContent } from "./schemas";

export type { ContactContent };

// Parsed once at module load: invalid content fails the build.
const content = parseContent(contactSchema, contactData, "content/contact.json");

export function getContactContent(): ContactContent {
  return content;
}
