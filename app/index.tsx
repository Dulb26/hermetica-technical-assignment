import { SnackbarProvider } from "notistack";
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./core/store";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <SnackbarProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </SnackbarProvider>
  </React.StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}
