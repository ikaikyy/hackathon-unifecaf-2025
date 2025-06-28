import { createContext, useState } from "react";

export const SidebarsContext = createContext<{
  sidebars: {
    [key: string]: {
      visible: boolean;
      setVisible: (visible: boolean) => void;
    };
  };
  setSidebars: React.Dispatch<
    React.SetStateAction<{
      [key: string]: {
        visible: boolean;
        setVisible: (visible: boolean) => void;
      };
    }>
  >;
}>({ sidebars: {}, setSidebars: () => {} });

export function SidebarsProvider({ children }: { children: React.ReactNode }) {
  const [sidebars, setSidebars] = useState<{
    [key: string]: {
      visible: boolean;
      setVisible: (visible: boolean) => void;
    };
  }>({
    // Initialize with any default sidebars if needed
    summary: {
      visible: false,
      setVisible: (visible: boolean) => {
        setSidebars((prev) => ({
          ...prev,
          summary: { ...prev.summary, visible },
        }));
      },
    },
    chat: {
      visible: false,
      setVisible: (visible: boolean) => {
        setSidebars((prev) => ({
          ...prev,
          chat: { ...prev.chat, visible },
        }));
      },
    },
  });

  return (
    <SidebarsContext.Provider value={{ sidebars, setSidebars }}>
      {children}
    </SidebarsContext.Provider>
  );
}
