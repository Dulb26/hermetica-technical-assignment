import * as React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { BaseLayout, MainLayout } from "./components";
import Dashboard from "./routes/dashboard";

const App: React.FC = () => {
  return (
    <Router>
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
