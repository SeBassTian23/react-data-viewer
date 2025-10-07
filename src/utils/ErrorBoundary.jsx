// ErrorBoundary.js
import React from "react";

import Card from 'react-bootstrap/Card'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Card.Body className='p-0 overflow-y d-flex justify-content-center align-items-center'>
        <span className="text-danger">Something went wrong with the widget.</span>
      </Card.Body>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
