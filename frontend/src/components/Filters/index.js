import React from 'react';
import { useFilterContext } from '../../context/filter_context';
import { getUniqueValues, formatPrice } from '../../utils/helpers';
import { categoryData, colorSwatch, isPaleColor, categoryLabel } from '../../utils/categoryData';

/**
 * Refinement sidebar — the one place on the listing page where the shopper
 * changes what they are looking at.
 *
 * Styled to the same language as the product detail page: gold hairline rules,
 * wide-tracked micro-labels, and a single accent colour. The previous version
 * mixed bordered pill buttons, boxed selects and underlined links, which read as
 * a utility panel bolted onto a luxury page.
 */

const Section = ({ title, children }) => (
  <div className="pt-7 border-t border-bronze/10 first:pt-0 first:border-t-0">
    <h4 className="text-[9px] font-bold uppercase tracking-[0.45em] text-gold mb-5">{title}</h4>
    {children}
  </div>
);

/** One row in a drill-down list. `depth` indents sub-levels. */
const FilterLink = ({ active, depth = 0, children, ...props }) => (
  <button
    type="button"
    {...props}
    className={`w-full text-left text-[11px] font-medium tracking-[0.12em] uppercase py-1.5 transition-colors duration-200 ${
      active ? 'text-gold' : 'text-bronze/55 hover:text-bronze'
    }`}
    style={{ paddingLeft: depth * 12 }}
  >
    <span className={`inline-flex items-center gap-2 ${active ? 'font-bold' : ''}`}>
      <span
        className={`h-px transition-all duration-300 ${active ? 'w-4 bg-gold' : 'w-0 bg-transparent'}`}
        aria-hidden="true"
      />
      {children}
    </span>
  </button>
);

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

  const subCategories = category !== 'all' && categoryData[category] ? Object.keys(categoryData[category]) : [];
  const productTypes =
    category !== 'all' && subCategory !== 'all' ? categoryData[category]?.[subCategory] || [] : [];

  return (
    <aside className="w-full lg:w-60 shrink-0 space-y-7">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          name="text"
          id="text"
          placeholder="Search the archive"
          className="w-full bg-transparent border-0 border-b border-bronze/20 py-2.5 pr-7 pl-0 text-[11px] font-medium tracking-[0.12em] text-bronze placeholder:text-bronze/30 focus:outline-none focus:border-gold transition-colors"
          value={text}
          onChange={updateFilters}
        />
        <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-bronze/25 text-lg pointer-events-none">
          search
        </span>
      </div>

      {/* Category drill-down. Sub-category and type reveal as you go deeper, so
          the panel never shows more than the shopper needs at that moment. */}
      <Section title="Category">
        <div className="flex flex-col">
          {categories.map((item) => (
            <React.Fragment key={item}>
              <FilterLink name="category" value={item} onClick={updateFilters} active={category === item}>
                {item === 'all' ? 'All Categories' : categoryLabel(item)}
              </FilterLink>

              {category === item && subCategories.length > 0 && (
                <div className="flex flex-col mb-1">
                  {subCategories.map((sub) => (
                    <React.Fragment key={sub}>
                      <FilterLink name="subCategory" value={sub} onClick={updateFilters} active={subCategory === sub} depth={1}>
                        {sub}
                      </FilterLink>

                      {subCategory === sub && productTypes.length > 0 && (
                        <div className="flex flex-col">
                          {productTypes.map((type) => (
                            <FilterLink
                              key={type}
                              name="productType"
                              value={type}
                              onClick={updateFilters}
                              active={productType === type}
                              depth={2}
                            >
                              {type}
                            </FilterLink>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Section>

      {/* Collections */}
      {collections.length > 1 && (
        <Section title="Collection">
          <div className="flex flex-col">
            <FilterLink name="collection" value="all" onClick={updateFilters} active={collection === 'all'}>
              All
            </FilterLink>
            {collections
              .filter((c) => c !== 'all')
              .map((item) => (
                <FilterLink key={item} name="collection" value={item} onClick={updateFilters} active={collection === item}>
                  {item}
                </FilterLink>
              ))}
          </div>
        </Section>
      )}

      {/* Palette */}
      <Section title="Palette">
        <button
          type="button"
          name="color"
          data-color="all"
          onClick={updateFilters}
          className={`mb-3 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors ${
            color === 'all' ? 'text-gold font-bold' : 'text-bronze/45 hover:text-bronze'
          }`}
        >
          All colours
        </button>
        <div className="flex flex-wrap gap-2.5">
          {colors
            .filter((c) => c !== 'all')
            .map((item) => (
              <button
                key={item}
                type="button"
                name="color"
                data-color={item}
                onClick={updateFilters}
                title={item}
                aria-label={`Filter by colour ${item}`}
                style={{ background: colorSwatch(item) }}
                className={`w-7 h-7 rounded-full border transition-all ring-offset-2 ring-offset-champagne ${
                  color === item
                    ? 'ring-2 ring-gold border-gold'
                    : `ring-transparent hover:ring-1 hover:ring-gold ${
                        isPaleColor(item) ? 'border-bronze/30' : 'border-transparent'
                      }`
                }`}
              />
            ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[10px] font-medium tracking-[0.15em] text-bronze/40 uppercase">Up to</span>
          <span className="text-sm font-editorial font-bold text-bronze">{formatPrice(price)}</span>
        </div>
        <input
          type="range"
          name="price"
          onChange={updateFilters}
          min={min_price}
          max={max_price}
          value={price}
          aria-label="Maximum price"
          className="w-full h-px bg-bronze/20 accent-gold cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-[9px] font-medium tracking-[0.15em] text-bronze/30">
          <span>{formatPrice(min_price)}</span>
          <span>{formatPrice(max_price)}</span>
        </div>
      </Section>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full mt-2 py-3 text-[9px] font-bold uppercase tracking-[0.35em] text-bronze/50 border border-bronze/15 hover:border-gold hover:text-gold transition-colors"
      >
        Reset
      </button>
    </aside>
  );
};

export default Filters;
