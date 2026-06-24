import { Component } from 'react';

/**
 * ErrorBoundary — Catches render errors in child components.
 * Prevents one bad component from crashing the entire app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ChronoLog ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            color: '#f87171',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
          <p style={{ fontWeight: 700, marginBottom: 4, color: '#fca5a5' }}>
            {this.props.title || 'This section failed to render'}
          </p>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 18px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: '8px',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
              fontWeight: 600,
            }}
          >
            ↺ Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

