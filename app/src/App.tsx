import React from "react";
import { StoreProvider } from "../core/store";
import { Router } from "../routes";

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  );
};

export default App;
