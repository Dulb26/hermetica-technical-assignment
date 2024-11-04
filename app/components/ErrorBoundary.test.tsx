import { cleanup, render, screen } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

describe("ErrorBoundary", () => {
  const ThrowError = () => {
    throw new Error("Test error");
  };

  const consoleError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = consoleError;
  });

  afterEach(() => {
    cleanup();
  });

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Test content")).toBeDefined();
  });

  it("renders error message when there is an error", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong.")).toBeDefined();
  });

  it("calls componentDidCatch when an error occurs", () => {
    const error = new Error("Test error");
    const errorInfo = { componentStack: "Test stack" };
    const component = new ErrorBoundary({ children: null });

    component.setState = vi.fn();
    component.componentDidCatch(error, errorInfo);

    expect(component.setState).toHaveBeenCalledWith({ hasError: true });
  });

  it("resets error state when receiving new children", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(screen.queryByText("Something went wrong.")).toBeDefined();

    rerender(
      <ErrorBoundary>
        <div>New content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("New content")).toBeDefined();
  });
});
