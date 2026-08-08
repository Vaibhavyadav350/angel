import React, { useState, useEffect, useRef } from 'react';
import { useFilterContext } from '../../context/filter_context';

/**
 * The listing toolbar: what you are looking at, and how it is arranged.
 *
 * Mobile  — one single frosted pill: [Refine | count | Sort ▾]
 *           Sort taps open a slide-up bottom sheet.
 *
 * Desktop — two separate pills on one row: [count] … [grid/list | Sort ▾]
 *           Sort taps open a small dropdown.
 */

const SORT_OPTIONS = [
  { value: 'price-lowest', label: 'Price · Low to High', short: 'Price ↑' },
  { value: 'price-highest', label: 'Price · High to Low', short: 'Price ↓' },
  { value: 'name-a', label: 'Name · A to Z', short: 'Name A–Z' },
  { value: 'name-z', label: 'Name · Z to A', short: 'Name Z–A' },
];

/* ─── Desktop dropdown ─────────────────────────────────────────────────── */
const DesktopSortDropdown = ({ sort, updateSort }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = SORT_OPTIONS.find((o) => o.value === sort) || SORT_OPTIONS[0];

  useEffect(() => {
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none group"
      >
        <span className="text-gold tracking-[0.4em]">Sort</span>
        <span className="text-bronze/60 group-hover:text-bronze transition-colors">{selected.label}</span>
        <span
          className="material-symbols-outlined text-[14px] text-bronze/40 group-hover:text-gold"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease, color 0.2s ease' }}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown panel */}
      <div
        className="absolute right-0 top-full mt-3 w-56 rounded-2xl overflow-hidden z-50"
        style={{
          background: 'rgba(253,246,235,0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(196,160,100,0.18)',
          boxShadow: '0 24px 64px rgba(61,43,31,0.14), 0 4px 16px rgba(61,43,31,0.06)',
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
          pointerEvents: open ? 'auto' : 'none',
          transformOrigin: 'top right',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}
      >
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(196,160,100,0.5), transparent)' }} />
        <div className="py-2">
          {SORT_OPTIONS.map((option) => {
            const isActive = option.value === sort;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => { updateSort({ target: { value: option.value } }); setOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-150 ${
                  isActive ? 'text-gold bg-gold/5' : 'text-bronze/55 hover:text-bronze hover:bg-bronze/5'
                }`}
              >
                <span>{option.label}</span>
                {isActive && <span className="material-symbols-outlined text-[13px] text-gold">check</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


/* ─── Mobile bottom sheet ──────────────────────────────────────────────── */
const MobileSortSheet = ({ sort, updateSort, open, onClose }) => {

  // Prevent body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(61,43,31,0.35)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{
          background: 'rgba(253,246,235,0.98)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(196,160,100,0.15)',
          boxShadow: '0 -24px 64px rgba(61,43,31,0.12)',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-bronze/20" />
        </div>

        {/* Gold accent line */}
        <div className="mx-6 mb-4" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(196,160,100,0.4), transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-gold">Sort By</span>
          <button onClick={onClose} className="text-bronze/40 hover:text-bronze transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Options */}
        <div className="pb-8">
          {SORT_OPTIONS.map((option) => {
            const isActive = option.value === sort;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => { updateSort({ target: { value: option.value } }); onClose(); }}
                className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all duration-150 ${
                  isActive ? 'bg-gold/6' : 'hover:bg-bronze/5'
                }`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-gold' : 'text-bronze/60'}`}>
                  {option.label}
                </span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-150 ${
                  isActive ? 'border-gold bg-gold' : 'border-bronze/20'
                }`}>
                  {isActive && <span className="material-symbols-outlined text-[11px] text-white">check</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

/* ─── Main component ───────────────────────────────────────────────────── */
const Sort = ({ activeFilters = [], onClearFilter, onClearAll, onOpenMobileFilters }) => {
  const { filtered_products: products, grid_view, sort, setGridView, setListView, updateSort } = useFilterContext();
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  const iconButton = (active) =>
    `w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
      active ? 'bg-bronze/10 text-gold' : 'text-bronze/30 hover:text-bronze'
    }`;

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="mb-6 sticky top-16 md:top-20 z-20 pt-4 pointer-events-none">

        {/* ── Mobile: single unified pill ── */}
        <div
          className="sm:hidden flex items-center bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm pointer-events-auto overflow-hidden"
          style={{ boxShadow: '0 4px 24px rgba(61,43,31,0.08)' }}
        >
          {/* Refine */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="flex items-center gap-1.5 pl-4 pr-3 py-3 text-[9px] font-bold tracking-[0.2em] text-bronze uppercase border-r border-bronze/15 hover:text-gold transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[15px]">tune</span>
            Refine
            {activeFilters.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-gold text-white text-[8px] flex items-center justify-center font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Count */}
          <span className="flex-1 text-center text-[9px] font-bold uppercase tracking-[0.25em] text-bronze/45 px-2 whitespace-nowrap">
            {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
          </span>

          {/* Sort trigger */}
          <button
            type="button"
            onClick={() => setSortSheetOpen(true)}
            className="flex items-center gap-1 pl-3 pr-4 py-3 text-[9px] font-bold uppercase tracking-[0.18em] border-l border-bronze/15 hover:text-gold transition-colors shrink-0"
          >
            <span className="text-gold tracking-[0.25em]">Sort</span>
            <span className="material-symbols-outlined text-[14px] text-bronze/40">expand_more</span>
          </button>
        </div>

        {/* ── Desktop: two separate pills ── */}
        <div className="hidden sm:flex items-center justify-between gap-4 pb-5">
          {/* Left pill: count */}
          <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/50 shadow-sm pointer-events-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/50 whitespace-nowrap">
              {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
            </p>
          </div>

          {/* Right pill: grid/list + sort */}
          <div className="flex items-center gap-4 bg-white/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/50 shadow-sm pointer-events-auto">
            <div className="flex items-center gap-1 pr-4 border-r border-bronze/20">
              <button type="button" onClick={setGridView} aria-label="Grid view" className={iconButton(grid_view)}>
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
              <button type="button" onClick={setListView} aria-label="List view" className={iconButton(!grid_view)}>
                <span className="material-symbols-outlined text-lg">view_list</span>
              </button>
            </div>
            <DesktopSortDropdown sort={sort} updateSort={updateSort} />
          </div>
        </div>

        {/* ── Active filter chips (desktop only, mobile shows badge on Refine) ── */}
        {activeFilters.length > 0 && (
          <div className="hidden sm:flex flex-wrap items-center gap-2 pt-1 pointer-events-auto">
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => onClearFilter?.(f.key)}
                className="group flex items-center gap-2 pl-3 pr-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/70 border border-bronze/20 rounded-full bg-white/40 backdrop-blur-md shadow-sm hover:border-gold hover:text-gold transition-colors"
              >
                {f.label}
                <span className="text-bronze/40 group-hover:text-gold transition-colors text-[11px] leading-none">×</span>
              </button>
            ))}
            <button
              onClick={onClearAll}
              className="ml-1 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/50 border border-transparent rounded-full bg-white/20 backdrop-blur-md shadow-sm hover:bg-white/40 hover:text-gold transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile sort bottom sheet (rendered outside sticky container) ── */}
      <MobileSortSheet
        sort={sort}
        updateSort={updateSort}
        open={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
      />
    </>
  );
};

export default Sort;
