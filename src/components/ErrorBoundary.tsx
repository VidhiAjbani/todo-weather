import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.setState({ message: error.message });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card">
          <h2>Something went wrong.</h2>
          <p className="error">{this.state.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}