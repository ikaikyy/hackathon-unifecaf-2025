import { useContext } from "react";

import { SidebarsContext } from "@/contexts/sidebars";

function useSidebars() {
  const context = useContext(SidebarsContext);

  function registerSidebar(name: string, visible = false) {
    if (context.sidebars[name]) {
      return;
    }

    context.setSidebars((prev) => ({
      ...prev,
      [name]: {
        visible,
        setVisible: (visible: boolean) => {
          context.sidebars[name].visible = visible;
        },
      },
    }));
  }

  function getSidebarVisible(name: string): boolean {
    if (!context.sidebars[name]) {
      throw new Error(`Sidebar with name "${name}" does not exist.`);
    }

    return context.sidebars[name].visible;
  }

  function setSidebarVisible(name: string, visible: boolean) {
    if (!context.sidebars[name]) {
      throw new Error(`Sidebar with name "${name}" does not exist.`);
    }

    context.setSidebars((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        visible,
      },
    }));
  }

  if (!context) {
    throw new Error("useSidebars must be used within a SidebarsProvider");
  }

  return {
    sidebars: context,
    registerSidebar,
    getSidebarVisible,
    setSidebarVisible,
  };
}

export { useSidebars };
