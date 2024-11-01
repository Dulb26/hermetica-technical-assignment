import { createElement } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { BaseLayout, MainLayout, RootError } from "../components";

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
      { path: "dashboard", lazy: () => import("./dashboard") },
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
