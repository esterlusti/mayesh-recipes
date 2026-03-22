import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f2f0eb',
          fontFamily: "'Heebo', sans-serif",
          direction: 'rtl',
        }}>
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: '#fff',
            border: '2px solid #111',
            boxShadow: '4px 4px 0 #111',
            maxWidth: '400px',
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px', fontFamily: "'Rubik', sans-serif", fontWeight: 900 }}>
              משהו השתבש
            </h2>
            <p style={{ fontSize: '15px', color: '#555', marginBottom: '20px' }}>
              אירעה שגיאה לא צפויה. נסו לטעון מחדש.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 28px',
                fontSize: '15px',
                fontWeight: 900,
                background: '#e85d04',
                color: '#fff',
                border: '2px solid #111',
                boxShadow: '3px 3px 0 #111',
                cursor: 'pointer',
                fontFamily: "'Heebo', sans-serif",
              }}
            >
              טען מחדש
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
