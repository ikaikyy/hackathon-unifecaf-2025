import "@azure/openai/types";

import { AzureOpenAI } from "openai";
import { useContext } from "react";

import type { ChatCompletionMessageParam } from "openai/resources";

import { MessagesContext, type Message } from "@/contexts/messages";

const openAI = new AzureOpenAI({
  endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT,
  apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
  apiVersion: "2025-01-01-preview",
  dangerouslyAllowBrowser: true,
});

const openAIResourcesClient = new AzureOpenAI({
  baseURL: import.meta.env.VITE_OPENAI_RESOURCES_BASE_URL,
  apiKey: import.meta.env.VITE_AZURE_OPENAI_API_KEY,
  apiVersion: "preview",
  dangerouslyAllowBrowser: true,
});

export type SummaryItem = {
  title: string;
  description: string;
};

function useAzureOpenAI() {
  const { messages, setMessages } = useContext(MessagesContext);

  async function createResponse(input: string): Promise<string> {
    const response = await openAIResourcesClient.responses.create({
      model: "gpt-4.1-nano",
      input,
    });

    return response.output_text;
  }

  async function summarizeContent(content: string): Promise<SummaryItem[]> {
    const rawSummary = await createResponse(
      `Você é um assistente de sumarização, cujo papel é interpretar textos fornecidos e entregar uma lista de pontos principais do texto. Os textos serão acadêmicos. São textos que vão ser lidos por alunos universitários, e você deve estruturar a lista de pontos principais de forma que sejam úteis como forma navegar pelo texto e como ponto de partida para discussões aprofundadas sobre cada ponto em específico. Além disso, devem ser curtos e dar um entendimento geral sobre o que o ponto em específico está relacionado.

Não alucine.
Não escreva texto introdutórios do tipo "Aqui está sua lista de pontos principais...".
Responda apenas com a lista.

Envie a lista no seguinte formato:
- [Titulo]: [Descrição]

Aqui está o texto que você deve resumir:
${content}`,
    );

    const summary = rawSummary
      .replace(/^- /gm, "")
      .split("\n")
      .map((line) => {
        if (!line.includes(": ")) {
          return { title: line, description: "" };
        }

        return {
          title: line.split(": ")[0],
          description: line.split(": ").slice(1).join(": "),
        };
      });

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "system",
        content: `O texto atual é:
          ${content}

          A lista de pontos principais do texto é:

          ${rawSummary}
        `,
      },
    ]);

    return summary;
  }

  async function createChatCompletion(
    message: Message,
  ): Promise<ChatCompletionMessageParam> {
    setMessages((prevMessages) => [...prevMessages, message]);

    const completion = await openAI.chat.completions.create({
      model: "gpt-4o",
      messages: [...messages, message],
      store: true,
    });

    let newMessage = completion.choices[0].message;

    if (!newMessage.content) {
      newMessage = {
        ...newMessage,
        content: "Desculpe, não consegui responder sua pergunta.",
      };
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    return newMessage;
  }

  return {
    createChatCompletion,
    createResponse,
    summarizeContent,
    messages,
    setMessages,
  };
}

export { useAzureOpenAI };
