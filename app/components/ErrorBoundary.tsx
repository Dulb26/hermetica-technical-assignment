import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ hasError: true });
  }

  public override componentDidUpdate(prevProps: Props) {
    if (prevProps.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-red-600">
          Something went wrong.
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
