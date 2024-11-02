import * as React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { BaseLayout, MainLayout } from "./components";
import Dashboard from "./routes/dashboard";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <Router>
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
      <Routes>
        <Route element={<BaseLayout />}>
          {/* Add any base layout routes here */}
        </Route>
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
