import * as React from "react";
import { Toaster } from "react-hot-toast";
import { Router } from "./routes";

const App: React.FC = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1F2937",
            color: "white",
          },
          success: {
            iconTheme: {
              primary: "rgb(34 197 94)",
              secondary: "white",
            },
          },
          error: {
            iconTheme: {
              primary: "rgb(239 68 68)",
              secondary: "white",
            },
          },
        }}
      />
      <Router />
    </>
  );
};

export default App;
