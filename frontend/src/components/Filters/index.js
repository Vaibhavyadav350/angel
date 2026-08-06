import React from 'react';
import { useFilterContext } from '../../context/filter_context';
import { getUniqueValues, formatPrice } from '../../utils/helpers';
import { categoryData } from '../../utils/categoryData';

const Filters = () => {
  const {
    filters: { text, collection, category, subCategory, productType, color, min_price, max_price, price },
    updateFilters,
    clearFilters,
    all_products,
  } = useFilterContext();

  const categories = ['all', 'Women', 'Men', 'Kids', 'Jewelry'];
  const colors = getUniqueValues(all_products, 'colors');
  const collections = getUniqueValues(all_products, 'collections');

  const labelBase = 'text-[10px] font-bold uppercase tracking-[0.4em] text-gold block mb-4';
  const underlineInput = 'w-full bg-transparent border-0 border-b border-bronze/20 py-3 px-0 text-[10px] font-bold tracking-widest text-bronze placeholder:text-bronze/30 uppercase focus:outline-none focus:border-gold transition-colors appearance-none';

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-10">
      {/* Search */}
      <div>
        <label className={labelBase} htmlFor="text">Search</label>
        <div className="relative">
          <input
            type="text"
            name="text"
            id="text"
            placeholder="SEARCH ARCHIVE"
            className={underlineInput}
            value={text}
            onChange={updateFilters}
          />
          <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-bronze/30 text-xl">
            search
          </span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className={labelBase}>Category</h4>
        <div className="flex flex-col gap-3">
          {categories.map((item, index) => (
            <button
              key={index}
              type="button"
              name="category"
              value={item}
              onClick={updateFilters}
              className={`text-left text-[11px] font-bold uppercase tracking-widest transition-colors ${category === item
                ? 'text-gold border-b border-gold pb-0.5'
                : 'text-bronze/60 hover:text-gold'
                }`}
            >
              {item === 'all' ? 'All' : item}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Categories (Dynamic from categoryData) */}
      {category !== 'all' && categoryData[category] && (
        <div>
          <h4 className={labelBase}>Sub-Category</h4>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              name="subCategory"
              value="all"
              onClick={updateFilters}
              className={`text-left text-[11px] font-bold uppercase tracking-widest transition-colors pl-4 ${subCategory === 'all'
                ? 'text-gold border-l-2 border-gold pl-2'
                : 'text-bronze/60 hover:text-gold border-l-2 border-transparent pl-2'
                }`}
            >
              All
            </button>
            {Object.keys(categoryData[category]).map((item, index) => (
              <button
                key={index}
                type="button"
                name="subCategory"
                value={item}
                onClick={updateFilters}
                className={`text-left text-[11px] font-bold uppercase tracking-widest transition-colors pl-4 ${subCategory === item
                  ? 'text-gold border-l-2 border-gold pl-2'
                  : 'text-bronze/60 hover:text-gold border-l-2 border-transparent pl-2'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Types (Dynamic from categoryData) */}
      {category !== 'all' && subCategory !== 'all' && categoryData[category]?.[subCategory] && (
        <div>
          <h4 className={labelBase}>Type</h4>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              name="productType"
              value="all"
              onClick={updateFilters}
              className={`text-left text-[11px] font-bold uppercase tracking-widest transition-colors pl-8 ${productType === 'all'
                ? 'text-gold border-l-2 border-gold pl-2'
                : 'text-bronze/60 hover:text-gold border-l-2 border-transparent pl-2'
                }`}
            >
              All
            </button>
            {categoryData[category][subCategory].map((item, index) => (
              <button
                key={index}
                type="button"
                name="productType"
                value={item}
                onClick={updateFilters}
                className={`text-left text-[11px] font-bold uppercase tracking-widest transition-colors pl-8 ${productType === item
                  ? 'text-gold border-l-2 border-gold pl-2'
                  : 'text-bronze/60 hover:text-gold border-l-2 border-transparent pl-2'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collections */}
      <div>
        <label className={labelBase} htmlFor="collection">Collection</label>
        <select
          name="collection"
          id="collection"
          value={collection}
          onChange={updateFilters}
          className={`${underlineInput} cursor-pointer`}
        >
          <option value="all">All</option>
          {collections.filter(c => c !== 'all').map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Colors */}
      <div>
        <h4 className={labelBase}>Palette</h4>
        <div className="flex flex-wrap gap-3">
          {colors.map((item, index) => {
            if (item === 'all') {
              return (
                <button
                  key={index}
                  name="color"
                  data-color="all"
                  onClick={updateFilters}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors px-3 py-1 border ${color === 'all'
                    ? 'border-gold text-gold'
                    : 'border-bronze/20 text-bronze/50 hover:border-gold hover:text-gold'
                    }`}
                >
                  All
                </button>
              );
            }
            return (
              <button
                key={index}
                name="color"
                data-color={item}
                style={{ background: item }}
                onClick={updateFilters}
                aria-label={`Filter by color ${item}`}
                className={`w-6 h-6 rounded-full border transition-all ring-offset-2 ring-offset-champagne ${color === item
                  ? 'ring-2 ring-gold border-gold'
                  : 'border-white/20 ring-transparent hover:ring-1 hover:ring-gold'
                  }`}
              />
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className={labelBase.replace('mb-4', '')}>Price</h4>
          <span className="text-[10px] font-bold text-bronze/60">{formatPrice(price)}</span>
        </div>
        <input
          type="range"
          name="price"
          id="price"
          min={min_price}
          max={max_price}
          value={price}
          onChange={updateFilters}
          className="w-full h-0.5 bg-bronze/10 accent-gold cursor-pointer"
        />
      </div>


      {/* Clear Filters */}
      <button
        type="button"
        onClick={clearFilters}
        className="w-full py-3 text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/40 border border-bronze/10 hover:border-bronze/30 hover:text-bronze transition-all"
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default Filters;
