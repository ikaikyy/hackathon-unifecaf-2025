import { Sidebar, type SidebarProps } from "primereact/sidebar";
import { Button, type ButtonProps } from "primereact/button";

import { useSidebars } from "@/hooks/useSidebars";

type Props = SidebarProps & {
  buttonProps?: ButtonProps & {
    label?: string;
    icon?: string;
  };
  sidebarName: string;
};

export default function CustomSidebar(props: Props) {
  const { registerSidebar, getSidebarVisible, setSidebarVisible } =
    useSidebars();

  registerSidebar(props.sidebarName, props.visible);

  return (
    <div>
      <Sidebar
        {...props}
        visible={getSidebarVisible(props.sidebarName)}
        onHide={() => setSidebarVisible(props.sidebarName, false)}
      >
        {props.children}
      </Sidebar>
      <Button
        icon={props.buttonProps?.icon}
        onClick={() => setSidebarVisible(props.sidebarName, true)}
        {...props.buttonProps}
      >
        {props.buttonProps?.label}
      </Button>
    </div>
  );
}
