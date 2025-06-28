import "./main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { PrimeReactProvider } from "primereact/api";
import { SidebarsProvider } from "./contexts/sidebars";
import { MessagesProvider } from "./contexts/messages";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrimeReactProvider>
      <SidebarsProvider>
        <MessagesProvider>
          <App />
        </MessagesProvider>
      </SidebarsProvider>
    </PrimeReactProvider>
  </StrictMode>,
);
