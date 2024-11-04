import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <ErrorBoundary>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => root.unmount());
}
