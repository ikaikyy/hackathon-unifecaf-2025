import contents from "@/content.json" with { type: "json" };

import { marked } from "marked";

export type Content = {
  header: string;
  source: string;
};

function useContent() {
  async function loadContent(source: string): Promise<Content> {
    const content: Content = contents.find((content: Content) => {
      return source === content.source;
    });

    if (!content) console.warn(`Content not found for source: ${source}`);

    const contentClone = { ...content };

    const contentResponse = await fetch(contentClone.source);

    contentClone.source = await contentResponse.text();
    contentClone.source = await marked.parse(contentClone.source);

    return contentClone;
  }

  return {
    contents,
    loadContent,
  };
}

export { useContent };
