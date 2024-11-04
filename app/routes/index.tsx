import { createElement, lazy } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useRouteError,
} from "react-router-dom";
import { BaseLayout, MainLayout } from "../components";

const Dashboard = lazy(() =>
  import("./dashboard").then((module) => ({
    default: module.default as React.ComponentType,
  })),
);

const RootError = () => {
  const error = useRouteError();
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Oops!</h1>
      <p className="mt-2">{error?.toString?.() ?? "Something went wrong"}</p>
    </div>
  );
};

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
