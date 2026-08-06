import React from 'react';

/**
 * Destructive-action confirmation.
 *
 * Admin pages were inconsistent — some used `window.confirm`, and Coupons deleted
 * on a single click with no confirmation and no feedback at all. One component so
 * every destructive action asks the same way and reads the same.
 */
const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = true,
  busy = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-bronze/20 backdrop-blur-sm flex items-center justify-center p-4 z-[80]">
      <div className="bg-white w-full max-w-sm rounded-xl p-7 border border-bronze/10 shadow-2xl">
        <h2 className="text-lg font-editorial font-black text-bronze uppercase tracking-widest mb-3">{title}</h2>
        {message && <p className="text-[12px] text-bronze/60 leading-relaxed mb-6">{message}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 px-5 py-3 border border-bronze/10 text-[10px] font-bold uppercase tracking-widest text-bronze/50 hover:bg-champagne/20 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 px-5 py-3 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 ${
              destructive ? 'bg-red-500 hover:bg-red-600' : 'bg-bronze hover:bg-bronze/90'
            }`}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
