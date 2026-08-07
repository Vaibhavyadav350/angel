import React from 'react';

/**
 * App-level error boundary.
 *
 * The previous version latched: once `hasError` became true it rendered the
 * fallback forever, wherever the customer navigated next. A single throw on one
 * page therefore made the whole site look dead — the URL changed on every click
 * but the view never did, and only a manual reload recovered it.
 *
 * Three changes:
 *  - it resets when the URL changes, so navigating away recovers by itself;
 *  - the error is logged, so the next one can be diagnosed rather than swallowed;
 *  - the fallback offers a way out instead of a bare sentence.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, pathname: window.location.pathname };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  static getDerivedStateFromProps(_props, state) {
    const pathname = window.location.pathname;
    if (pathname === state.pathname) return null;
    // Moved to a different page: clear the error so one broken route cannot
    // hold the rest of the site hostage.
    return { pathname, hasError: false };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info && info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-champagne font-body flex items-center justify-center px-6">
        <div className="text-center max-w-md space-y-5">
          <div className="h-px w-12 bg-gold mx-auto" />
          <h1 className="font-editorial text-2xl sm:text-3xl font-black text-bronze uppercase tracking-tight">
            Something went wrong
          </h1>
          <p className="text-[11px] font-medium tracking-[0.15em] text-bronze/50 uppercase leading-relaxed">
            This page could not be displayed. Try again, or return to the collection.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href="/"
              className="px-6 py-3 bg-bronze text-champagne text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-chocolate transition-colors"
            >
              Home
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-bronze/20 text-bronze text-[10px] font-bold uppercase tracking-[0.3em] hover:border-gold hover:text-gold transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
