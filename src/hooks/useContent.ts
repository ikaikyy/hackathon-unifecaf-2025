import contents from "@/content.json" with { type: "json" };

import { marked } from "marked";

export type Content = {
  header: string;
  source: string;
  formatted?: string;
};

function useContent() {
  async function loadContent(source: string): Promise<Content> {
    const content: Content = contents.find((content: Content) => {
      return source === content.source;
    });

    if (!content) console.warn(`Content not found for source: ${source}`);

    const contentResponse = await fetch(content.source);

    content.formatted = await contentResponse.text();
    content.formatted = await marked.parse(content.formatted);

    return content;
  }

  return {
    contents,
    loadContent,
  };
}

export { useContent };
