import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useFilterContext } from '../../context/filter_context';
import { Filters, Sort, GridView, ListView } from '../../components';
import { Loading, Error } from '../../components';
import { useProductsContext } from '../../context/products_context';
import { normalizeFilterValue } from '../../utils/categoryData';

/**
 * Collection listing.
 *
 * The page previously carried five separate ways to change what you were looking
 * at — a pill bar, the sidebar, active-filter chips, the sort bar, and a
 * three-card "explore" block — plus two full-bleed titles (a 12vw PRODUCTS
 * wordmark and a 60vh hero repeating the category name). Products began roughly
 * one and a half screens down.
 *
 * It is now one refinement surface (the sidebar), one status/sort toolbar, and a
 * compact editorial header, so the products themselves lead.
 */
const ProductsPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    filtered_products: products,
    grid_view,
    setFilterValue,
    clearFilters,
    setInitialFilters,
    filters,
  } = useFilterContext();

  const { products_loading: loading, products_error: error } = useProductsContext();

  const location = useLocation();
  const history = useHistory();
  const resultsRef = useRef(null);
  const lastProcessedSearch = useRef(null);
  const applyingUrlFilters = useRef(false);

  useEffect(() => {
    document.title = 'Angel Archive | Collections';
  }, []);

  // Two-way sync between URL query params and filter state.
  // When the URL changes (mega-menu, back button) we derive filters from it;
  // when the sidebar changes filters we write them back to the URL.
  useEffect(() => {
    if (location.search !== lastProcessedSearch.current) {
      lastProcessedSearch.current = location.search;
      applyingUrlFilters.current = true;

      if (!location.search) {
        clearFilters();
      } else {
        const searchParams = new URLSearchParams(location.search);
        setInitialFilters({
          category: normalizeFilterValue('category', searchParams.get('category')),
          subCategory: normalizeFilterValue('subCategory', searchParams.get('subCategory')),
          productType: normalizeFilterValue('productType', searchParams.get('productType')),
          collection: normalizeFilterValue('collection', searchParams.get('collection')),
          fabric: normalizeFilterValue('fabric', searchParams.get('fabric')),
        });
      }

      // Release the guard after the synchronous dispatch has flushed so the
      // filter -> URL branch below doesn't fight the URL -> filter branch.
      setTimeout(() => {
        applyingUrlFilters.current = false;
      }, 0);
      return;
    }

    if (applyingUrlFilters.current) return;

    const params = new URLSearchParams(location.search);
    const matchesUrl =
      (filters.category || 'all') === (normalizeFilterValue('category', params.get('category')) || 'all') &&
      (filters.subCategory || 'all') === (normalizeFilterValue('subCategory', params.get('subCategory')) || 'all') &&
      (filters.productType || 'all') === (normalizeFilterValue('productType', params.get('productType')) || 'all') &&
      (filters.collection || 'all') === (normalizeFilterValue('collection', params.get('collection')) || 'all') &&
      (filters.fabric || 'all') === (normalizeFilterValue('fabric', params.get('fabric')) || 'all');

    if (matchesUrl) return;

    const newParams = new URLSearchParams();
    if (filters.category && filters.category !== 'all') newParams.set('category', filters.category);
    if (filters.subCategory && filters.subCategory !== 'all') newParams.set('subCategory', filters.subCategory);
    if (filters.productType && filters.productType !== 'all') newParams.set('productType', filters.productType);
    if (filters.collection && filters.collection !== 'all') newParams.set('collection', filters.collection);
    if (filters.fabric && filters.fabric !== 'all') newParams.set('fabric', filters.fabric);

    const nextSearch = newParams.toString();
    const nextLocationSearch = nextSearch ? `?${nextSearch}` : '';
    if (nextLocationSearch !== location.search) {
      // `replace`, not `push`: refining a filter is not a new page in the
      // shopper's history, and it must not scroll them back to the top.
      history.replace({ pathname: location.pathname, search: nextLocationSearch });
    }
  }, [
    location.search,
    location.pathname,
    filters.category,
    filters.subCategory,
    filters.productType,
    filters.collection,
    filters.fabric,
    clearFilters,
    setInitialFilters,
    history,
  ]);

  // Keep the grid in view when a refinement shortens the list.
  const filterSignature = [
    filters.category, filters.subCategory, filters.productType, filters.collection, filters.fabric,
  ].join('|');
  const lastSignature = useRef(filterSignature);

  useEffect(() => {
    if (lastSignature.current === filterSignature) return;
    lastSignature.current = filterSignature;

    const el = resultsRef.current;
    if (!el) return;
    // Sit just under the sticky toolbar rather than at the very top of the page.
    const target = el.getBoundingClientRect().top + window.scrollY - 110;
    if (window.scrollY > target) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.max(0, target), behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [filterSignature]);

  // The most specific thing the shopper has chosen, used as the page title.
  const collectionTitle = useMemo(() => {
    if (filters.productType && filters.productType !== 'all') return filters.productType;
    if (filters.subCategory && filters.subCategory !== 'all') return filters.subCategory;
    if (filters.fabric && filters.fabric !== 'all') return filters.fabric;
    if (filters.collection && filters.collection !== 'all') return filters.collection;
    if (filters.category && filters.category !== 'all') return filters.category;
    return 'The Archive';
  }, [filters.category, filters.subCategory, filters.productType, filters.collection, filters.fabric]);

  const breadcrumb = useMemo(
    () =>
      [
        filters.category !== 'all' && filters.category,
        filters.subCategory && filters.subCategory !== 'all' && filters.subCategory,
        filters.productType && filters.productType !== 'all' && filters.productType,
      ].filter(Boolean),
    [filters.category, filters.subCategory, filters.productType]
  );

  const activeFilters = useMemo(
    () =>
      [
        filters.category !== 'all' && { key: 'category', label: filters.category },
        filters.subCategory && filters.subCategory !== 'all' && { key: 'subCategory', label: filters.subCategory },
        filters.productType && filters.productType !== 'all' && { key: 'productType', label: filters.productType },
        filters.collection && filters.collection !== 'all' && { key: 'collection', label: filters.collection },
        filters.fabric && filters.fabric !== 'all' && { key: 'fabric', label: filters.fabric },
        filters.color !== 'all' && { key: 'color', label: filters.color },
      ].filter(Boolean),
    [filters.category, filters.subCategory, filters.productType, filters.collection, filters.color, filters.fabric]
  );

  // Arrived from the menu without narrowing anything: the section is simply
  // unstocked, which deserves "arriving soon" rather than "fix your filters".
  const isBrowsingEmptySection = useMemo(() => {
    const cameFromNavigation =
      filters.category !== 'all' ||
      (filters.subCategory && filters.subCategory !== 'all') ||
      (filters.productType && filters.productType !== 'all') ||
      (filters.collection && filters.collection !== 'all') ||
      (filters.fabric && filters.fabric !== 'all');
    const refinedItThemselves =
      Boolean(filters.text) ||
      filters.color !== 'all' ||
      (filters.max_price > 0 && filters.price < filters.max_price);
    return cameFromNavigation && !refinedItThemselves;
  }, [filters]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <main className="bg-champagne font-body min-h-screen">
      {/* ---------------------------------------------------------------- */}
      {/* Header — editorial, not a billboard. Replaces the 12vw wordmark   */}
      {/* and the 60vh hero that repeated the same word underneath it.      */}
      {/* ---------------------------------------------------------------- */}
      <header className="pt-24 sm:pt-28 lg:pt-36 pb-8 lg:pb-10 px-5 sm:px-8 lg:px-16">
        <div className="container mx-auto max-w-[1500px]">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-bold uppercase tracking-[0.25em] text-bronze/40 mb-6 lg:mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-bronze/20">/</span>
            <Link to="/products" className="hover:text-gold transition-colors">Collections</Link>
            {breadcrumb.map((crumb) => (
              <React.Fragment key={crumb}>
                <span className="text-bronze/20">/</span>
                <span className="text-bronze">{crumb}</span>
              </React.Fragment>
            ))}
          </nav>

          <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold block mb-4">
            Curated Archive
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none">
            {collectionTitle}
          </h1>
          <div className="h-px w-16 bg-gold mt-6" />
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Filters + grid                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="px-5 sm:px-8 lg:px-16 pb-20 lg:pb-28">
        <div className="container mx-auto max-w-[1500px] flex flex-col lg:flex-row gap-8 lg:gap-14">
          {/* Sidebar — the single refinement surface */}
          <div
            className={`fixed inset-0 z-50 lg:static lg:z-auto transition-transform duration-500 ease-in-out ${
              isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
            }`}
          >
            <div
              className={`fixed inset-0 bg-chocolate/40 lg:hidden transition-opacity duration-300 ${
                isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setIsMobileFilterOpen(false)}
            />

            <div className="absolute lg:static bottom-0 left-0 w-full lg:w-auto h-[85vh] lg:h-auto bg-champagne lg:bg-transparent rounded-t-[2rem] lg:rounded-none p-8 lg:p-0 overflow-y-auto lg:overflow-visible shadow-2xl lg:shadow-none">
              <div className="flex justify-between items-center lg:hidden mb-8 border-b border-bronze/10 pb-4">
                <h3 className="text-lg font-editorial font-bold text-bronze uppercase tracking-widest">Refine</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-bronze/5 text-bronze hover:bg-bronze hover:text-champagne transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {/* Sticky so a long grid never leaves the shopper scrolling back up. */}
              <div className="lg:sticky lg:top-28 lg:pr-10 lg:border-r lg:border-bronze/10">
                <Filters />
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0" ref={resultsRef}>
            <Sort
              activeFilters={activeFilters}
              onClearFilter={(key) => setFilterValue(key, 'all')}
              onClearAll={clearFilters}
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
            />

            {products.length < 1 ? (
              <div className="flex items-center justify-center min-h-[45vh]">
                <div className="text-center max-w-md space-y-5">
                  <div className="h-px w-12 bg-gold mx-auto" />
                  <h3 className="text-2xl lg:text-3xl font-editorial font-bold text-bronze uppercase tracking-tight">
                    {isBrowsingEmptySection ? 'New pieces arriving soon' : 'Nothing matches'}
                  </h3>
                  <p className="text-[11px] font-medium tracking-[0.15em] text-bronze/50 uppercase leading-relaxed">
                    {isBrowsingEmptySection
                      ? 'This collection is being curated — please check back shortly'
                      : 'Try widening your search or clearing a filter'}
                  </p>
                  <Link
                    to="/products"
                    onClick={clearFilters}
                    className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-gold hover:text-bronze transition-colors border-b border-gold/40 pb-1"
                  >
                    {isBrowsingEmptySection ? 'Browse the full collection' : 'Clear all filters'}
                  </Link>
                </div>
              </div>
            ) : grid_view ? (
              <GridView products={products} />
            ) : (
              <ListView products={products} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
