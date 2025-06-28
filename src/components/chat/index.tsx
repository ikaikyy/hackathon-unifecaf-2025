import { marked } from "marked";
import { Avatar } from "primereact/avatar";
import { InputTextarea } from "primereact/inputtextarea";

import { useAzureOpenAI } from "@/hooks/useAzureOpenAI";
import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");

  const { messages, createChatCompletion } = useAzureOpenAI();

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-2 overflow-y-auto">
        {messages.map((message, index) => {
          if (!["user", "assistant"].includes(message.role)) return null;

          message.content = marked.parse(message.content?.toString() || "", {
            async: false,
          });

          return (
            <div
              key={index}
              className="p-2 bg-gray-100 rounded flex flex-row gap-2"
            >
              {message.role === "user" && (
                <div
                  className="w-full text-right"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              )}
              <div className="flex items-start justify-center">
                <Avatar
                  label={message.role === "user" ? "U" : "AI"}
                  className={`${
                    message.role === "user" ? "bg-blue-500" : "bg-green-500"
                  } text-white`}
                />
              </div>
              {message.role === "assistant" && (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <InputTextarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-inputtext p-component resize-none"
          rows={5}
          placeholder="Digite sua mensagem..."
        ></InputTextarea>
        <button
          className="p-button p-component p-button-outlined"
          onClick={async () => {
            setMessage("");

            await createChatCompletion({
              role: "user",
              content: message,
            });
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
