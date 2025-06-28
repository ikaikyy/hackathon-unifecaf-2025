import contents from "@/content.json" with { type: "json" };

import { marked } from "marked";

export type Content = {
  header: string;
  source: string;
};

function useContent() {
  async function loadContent(source: string): Promise<Content> {
    source = "/content/" + source + ".md";

    const content: Content = contents.find((content: Content) => {
      return source === content.source;
    });

    if (!content) console.warn(`Content not found for source: ${source}`);

    const contentResponse = await fetch(content.source);

    content.source = await contentResponse.text();
    content.source = await marked.parse(content.source);

    return content;
  }

  return {
    contents,
    loadContent,
  };
}

export { useContent };
