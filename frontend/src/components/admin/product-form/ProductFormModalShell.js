import React from 'react';

/**
 * The modal chrome shared by the Create and Edit product modals: backdrop,
 * header, scrollable body, and footer slot. Keeps the two modals to just their
 * data wiring.
 */
function ProductFormModalShell({ title, subtitle, onClose, children, footer, zClass = 'z-50' }) {
  return (
    <div className={`fixed inset-0 ${zClass} flex items-center justify-center p-4`}>
      <div className="fixed inset-0 bg-bronze/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur shadow-2xl border border-bronze/20 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col z-50 overflow-hidden">
        {/* Header */}
        <div className="flex bg-champagne/10 items-center justify-between px-8 py-5 border-b border-bronze/10">
          <div>
            <h3 className="text-sm font-editorial font-black uppercase tracking-[0.4em] text-bronze">{title}</h3>
            {subtitle && <p className="text-[10px] uppercase font-bold tracking-widest text-bronze/40 mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-bronze/40 hover:text-bronze bg-white p-2 rounded-full shadow-sm border border-bronze/10 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {/* Footer */}
        <div className="bg-champagne/10 px-8 py-5 border-t border-bronze/10">
          {footer}
        </div>
      </div>
    </div>
  );
}

export default ProductFormModalShell;
