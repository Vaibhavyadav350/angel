import React from 'react';
import { useFilterContext } from '../../context/filter_context';

/**
 * The listing toolbar: what you are looking at, and how it is arranged.
 *
 * The count, the view toggles, the sort control and the active-filter chips used
 * to sit in three separate strips stacked down the page. They are one row here,
 * because they answer a single question — "what am I seeing right now?"
 */
const Sort = ({ activeFilters = [], onClearFilter, onClearAll, onOpenMobileFilters }) => {
  const { filtered_products: products, grid_view, sort, setGridView, setListView, updateSort } = useFilterContext();

  const iconButton = (active) =>
    `w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
      active ? 'bg-bronze/10 text-gold' : 'text-bronze/30 hover:text-bronze'
    }`;

  return (
    <div className="mb-10 sticky top-16 md:top-20 z-20 bg-champagne/95 backdrop-blur-sm pt-4">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-bronze/10">
        {/* Left: mobile refine trigger + count */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 border border-bronze/20 px-4 py-2 rounded-full text-[9px] font-bold tracking-[0.2em] text-bronze uppercase hover:border-gold hover:text-gold transition-colors"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Refine
          </button>
          <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-bronze/40 whitespace-nowrap">
            {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
          </p>
        </div>

        {/* Right: view toggles + sort */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden sm:flex items-center gap-1 border-r border-bronze/10 pr-5">
            <button type="button" onClick={setGridView} aria-label="Grid view" title="Grid view" className={iconButton(grid_view)}>
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button type="button" onClick={setListView} aria-label="List view" title="List view" className={iconButton(!grid_view)}>
              <span className="material-symbols-outlined text-lg">view_list</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold hidden sm:block">
              Sort
            </label>
            <select
              name="sort"
              id="sort"
              value={sort}
              onChange={updateSort}
              className="bg-transparent border-0 border-b border-bronze/20 py-1.5 pr-6 pl-0 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze focus:outline-none focus:border-gold transition-colors cursor-pointer appearance-none"
            >
              <option value="price-lowest">Price · Low to High</option>
              <option value="price-highest">Price · High to Low</option>
              <option value="name-a">Name · A to Z</option>
              <option value="name-z">Name · Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active refinements, shown only when there are any */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-5">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => onClearFilter?.(f.key)}
              className="group flex items-center gap-2 pl-3 pr-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/70 border border-bronze/15 rounded-full hover:border-gold hover:text-gold transition-colors"
            >
              {f.label}
              <span className="text-bronze/30 group-hover:text-gold transition-colors text-[11px] leading-none">×</span>
            </button>
          ))}
          <button
            onClick={onClearAll}
            className="ml-1 text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/35 hover:text-gold transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default Sort;
