import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toolbar } from "./Toolbar";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Toolbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export function BaseLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl p-6 pt-16">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
