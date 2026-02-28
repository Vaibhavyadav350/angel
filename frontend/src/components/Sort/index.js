import React from 'react';
import { useFilterContext } from '../../context/filter_context';

const Sort = () => {
  const {
    filtered_products: products,
    grid_view,
    sort,
    setGridView,
    setListView,
    updateSort,
  } = useFilterContext();

  return (
    <div className="flex justify-between items-end mb-12 pb-6 border-b border-bronze/10">
      {/* Result count */}
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/40">
        Showing {products.length} {products.length === 1 ? 'artifact' : 'artifacts'}
      </p>

      {/* Right: view toggles + sort */}
      <div className="flex items-center gap-8">
        {/* Grid / List toggles */}
        <div className="flex items-center gap-3 border-r border-bronze/10 pr-8">
          <button
            type="button"
            onClick={setGridView}
            aria-label="Grid view"
            title="Grid view"
            className={`transition-colors ${grid_view ? 'text-gold' : 'text-bronze/30 hover:text-bronze'
              }`}
          >
            <span className="material-symbols-outlined text-xl">grid_view</span>
          </button>
          <button
            type="button"
            onClick={setListView}
            aria-label="List view"
            title="List view"
            className={`transition-colors ${!grid_view ? 'text-gold' : 'text-bronze/30 hover:text-bronze'
              }`}
          >
            <span className="material-symbols-outlined text-xl">view_list</span>
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold hidden sm:block">
            Sort
          </span>
          <select
            name="sort"
            id="sort"
            value={sort}
            onChange={updateSort}
            className="bg-transparent border-0 border-b border-bronze/20 py-1 pr-6 pl-0 text-[10px] font-bold tracking-widest uppercase text-bronze focus:outline-none focus:border-gold transition-colors cursor-pointer appearance-none"
          >
            <option value="price-lowest">Price: Low</option>
            <option value="price-highest">Price: High</option>
            <option value="name-a">Name: A–Z</option>
            <option value="name-z">Name: Z–A</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sort;
