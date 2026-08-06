import React from 'react';

/**
 * One table for every admin list.
 *
 * Each admin page used to hand-roll its own <table>, and each one forgot a
 * different state — Coupons had no loading, no empty and no error branch, so a
 * store with no coupons rendered bare headers and a failed request looked
 * identical to success. Routing every list through here means a page cannot
 * silently omit a state again.
 *
 * columns: [{ key, header, align?, width?, render?(row, index) }]
 */
const DataTable = ({
  columns = [],
  rows = [],
  loading = false,
  error = null,
  emptyMessage = 'Nothing here yet',
  emptyHint = '',
  onRetry,
  rowKey = (row, i) => row?._id || row?.id || i,
}) => {
  const alignOf = (col) => (col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left');

  const Shell = ({ children }) => (
    <div className="bg-white border border-bronze/10 rounded-lg overflow-hidden">{children}</div>
  );

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-bronze/10 border-t-gold rounded-full animate-spin" />
        </div>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-14 gap-3 text-center px-6">
          <p className="text-sm font-editorial text-red-500">Could not load this list</p>
          <p className="text-[11px] text-bronze/50">{typeof error === 'string' ? error : 'Please try again.'}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-1 px-5 py-2 bg-bronze text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-bronze/90 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </Shell>
    );
  }

  const list = Array.isArray(rows) ? rows : [];

  if (list.length === 0) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
          <p className="text-lg font-editorial text-bronze/50">{emptyMessage}</p>
          {emptyHint && <p className="text-[11px] text-bronze/40 max-w-md">{emptyHint}</p>}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-bronze/5 bg-champagne/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={`p-4 text-[10px] font-black uppercase tracking-widest text-bronze/40 ${alignOf(col)}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((row, index) => (
              <tr key={rowKey(row, index)} className="border-b border-bronze/5 hover:bg-champagne/20 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`p-4 ${alignOf(col)}`}>
                    {col.render ? col.render(row, index) : row?.[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
};

export default DataTable;
