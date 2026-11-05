import dataStoriesData from "@/content/data-stories.json";
import { parseContent } from "./load";
import { dataStoriesSchema, type DataStoriesContent } from "./schemas";

export type DataStory = DataStoriesContent["stories"][number];

// Parsed once at module load: invalid content fails the build.
const content = parseContent(dataStoriesSchema, dataStoriesData, "content/data-stories.json");

export function getDataStories(): DataStory[] {
  return content.stories;
}
