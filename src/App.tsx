import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Chat from "@/components/chat";
import Sidebar from "@/components/sidebar";
import { DataView } from "primereact/dataview";
import { Panel } from "primereact/panel";

import { useState, useMemo } from "react";
import { useContent, type Content } from "@/hooks/useContent";
import { useAzureOpenAI, type SummaryItem } from "@/hooks/useAzureOpenAI";
import { useSidebars } from "@/hooks/useSidebars";

function App() {
  const { loadContent, contents } = useContent();
  const [content, setContent] = useState<Content | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryItem[] | null>(null);

  const { createChatCompletion, summarizeContent, messages } = useAzureOpenAI();
  const { setSidebarVisible } = useSidebars();

  useMemo(async () => {
    if (!selectedContent) {
      return;
    }

    const newContent = await loadContent(selectedContent);

    setContent(newContent);
  }, [loadContent]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {" "}
      <Dropdown
        value={selectedContent ? selectedContent : null}
        options={contents.map((c) => c.source)}
        onChange={(e) => {
          setSummary(null);
          setSelectedContent(e.value);
        }}
        highlightOnSelect={false}
      />
      {content && (
        <>
          <div className="fixed right-4 top-4 flex flex-col gap-2">
            <Sidebar
              sidebarName="summary"
              className="w-128"
              buttonProps={{
                icon: "pi pi-sparkles",
                rounded: true,
              }}
              position="right"
            >
              {summary && (
                <DataView
                  value={summary}
                  itemTemplate={(item: SummaryItem, index) => (
                    <div className="col-12" key={index}>
                      <div className="flex p-4 gap-4">
                        <div className="flex justify-between items-center flex-1 gap-4">
                          <div className="flex flex-col gap-3">
                            <div className="text-2xl font-bold text-900">
                              {item.title}
                            </div>
                            <div className="flex gap-3">
                              <span className="font-semibold">
                                {item.description || "Sem descrição"}
                              </span>
                            </div>
                          </div>
                          <div className="flex align-center gap-3">
                            <Button
                              icon="pi pi-comment"
                              className="p-button-rounded"
                              onClick={async () => {
                                await createChatCompletion({
                                  role: "user",
                                  content: `Por favor, gostaria de me aprofundar mais sobre o seguinte ponto: ${item.title}. Poderia me fornecer mais informações?`,
                                });

                                setSidebarVisible("summary", false);
                                setSidebarVisible("chat", true);
                              }}
                            ></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                />
              )}
              {!summary && (
                <Panel header="Sumário">
                  <p>
                    Pressione o botão abaixo para gerar um sumário do texto
                    atual.
                  </p>
                  <div className="flex mt-4 justify-end">
                    <button
                      className="p-button p-component p-button-outlined"
                      onClick={async () => {
                        const newSummary = await summarizeContent(
                          content.source,
                        );

                        setSummary(newSummary);
                      }}
                    >
                      Gerar Sumário
                    </button>
                  </div>
                </Panel>
              )}
            </Sidebar>
            <Sidebar
              sidebarName="chat"
              className="w-128"
              buttonProps={{
                icon: "pi pi-comment",
                rounded: true,
              }}
              position="right"
            >
              <Chat />
            </Sidebar>
          </div>
          <Panel
            header={content.header}
            pt={{
              content: {
                dangerouslySetInnerHTML: { __html: content.source },
              },
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
