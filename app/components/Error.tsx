import { useRouteError } from "react-router-dom";

export function RootError(): JSX.Element {
  const err = useRouteError() as RouteError;

  return (
    <div className="container mx-auto max-w-2xl mt-[43vh]">
      <h1 className="text-4xl font-light text-center">
        <strong className="font-normal">Error {err.status || 500}</strong>:{" "}
        {err.statusText ?? err.message}
      </h1>
    </div>
  );
}

type RouteError = Error & { status?: number; statusText?: string };
