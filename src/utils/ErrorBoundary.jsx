// ErrorBoundary.js
import React from "react";

import Card from 'react-bootstrap/Card'
import PanelWarning from '../components/Widgets/helpers/PanelWarning'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Card.Body className='p-0 overflow-y'>
        <PanelWarning warning={<>Something went wrong with the widget.<small className="small text-muted d-block">{this.state.message}</small></>}/>
      </Card.Body>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
