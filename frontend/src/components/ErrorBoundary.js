import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // We would normally log the error to an error reporting service here
        console.error('[REACT ERROR BOUNDARY CAUGHT]', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen bg-champagne flex flex-col items-center justify-center p-6 text-center font-body">
                    <div className="bg-white p-12 shadow-2xl max-w-lg border-t-4 border-bronze">
                        <span className="material-symbols-outlined text-6xl text-bronze drop-shadow-md mb-6">warning</span>
                        <h2 className="text-3xl font-editorial font-black text-bronze uppercase tracking-widest mb-4">
                            Something went wrong.
                        </h2>
                        <p className="text-sm font-bold text-bronze/60 uppercase tracking-widest mb-8">
                            We've encountered an unexpected error. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-chocolate text-champagne px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-colors shadow-lg"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
