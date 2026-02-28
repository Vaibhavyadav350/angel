import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  useEffect(() => {
    document.title = 'Angel Fashion Studio | Error';
  }, []);

  return (
    <main className="bg-warm-bg font-body min-h-screen flex items-center justify-center">
      <section className="text-center space-y-8 py-32">
        <h1 className="text-9xl font-editorial font-black text-espresso tracking-tighter">404</h1>
        <h3 className="text-2xl lg:text-3xl font-editorial font-bold text-espresso/80">
          Sorry, the page doesn't exist
        </h3>
        <Link 
          to='/' 
          className="inline-block px-8 py-4 bg-espresso text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-terracotta transition-colors"
        >
          Back home
        </Link>
      </section>
    </main>
  );
};

export default ErrorPage;
