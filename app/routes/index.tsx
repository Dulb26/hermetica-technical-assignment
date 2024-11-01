import { createElement, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { BaseLayout, MainLayout, RootError } from "../components";

const Dashboard = lazy(() =>
  import("./dashboard").then((module) => ({
    default: module.default as React.ComponentType,
  })),
);

/**
 * Application routes
 */
export const router = createBrowserRouter([
  {
    path: "",
    element: <BaseLayout />,
    errorElement: <RootError />,
    children: [],
  },
  {
    path: "",
    element: <MainLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        lazy: async () => ({
          Component: Dashboard,
        }),
      },
    ],
  },
]);

export function Router(): JSX.Element {
  return createElement(RouterProvider, { router });
}

// Clean up on module reload (HMR)
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
