import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useFilterContext } from '../../context/filter_context';
import { Filters, Sort, GridView, ListView } from '../../components';
import { Loading, Error } from '../../components';
import { useProductsContext } from '../../context/products_context';

const CATEGORY_PILLS = [
  { label: 'ALL', category: 'all', url: '/products' },
  { label: 'WOMEN', category: 'Women', url: '/products?category=Women' },
  { label: 'BRIDAL LEHENGAS', category: 'Women', subCategory: 'Lehengas', url: '/products?category=Women&subCategory=Lehengas' },
  { label: 'SILK SAREES', category: 'Women', subCategory: 'Sarees', url: '/products?category=Women&subCategory=Sarees' },
  { label: 'ANARKALI', category: 'Women', subCategory: 'Salwar Kameez', url: '/products?category=Women&subCategory=Salwar+Kameez' },
  { label: 'MEN', category: 'Men', url: '/products?category=Men' },
  { label: 'SHERWANIS', category: 'Men', subCategory: 'Sherwanis', url: '/products?category=Men&subCategory=Sherwanis' },
  { label: 'JEWELLERY', category: 'Jewelry', url: '/products?category=Jewelry' },
  { label: 'KIDS', category: 'Kids', url: '/products?category=Kids' },
];

const ProductsPage = () => {
  const {
    filtered_products: products,
    grid_view,
    setFilterValue,
    clearFilters,
    filters
  } = useFilterContext();

  const {
    products_loading: loading,
    products_error: error,
    featured_products
  } = useProductsContext();

  const location = useLocation();

  useEffect(() => {
    document.title = 'Angel Archive | Collections';
  }, []);

  // Parse query params to set initial filters, ensuring one-way sync to prevent overriding sidebar interactions
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    if (!location.search) {
      clearFilters();
      return;
    }

    const category = searchParams.get('category') || 'all';
    const subCategory = searchParams.get('subCategory') || 'all';
    const collection = searchParams.get('collection') || 'all';

    setFilterValue('category', category);
    
    // Small timeout ensures the category cascade-reset (which sets subCategory to 'all') 
    // completes before we apply the specific subCategory from the URL.
    setTimeout(() => {
      if (subCategory !== 'all') setFilterValue('subCategory', subCategory);
      if (collection !== 'all') setFilterValue('collection', collection);
    }, 10);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  const heroImage = (products && products.length > 0) ? products[0].image :
    (featured_products && featured_products.length > 0) ? featured_products[0].image :
      'https://images.unsplash.com/photo-1583391733975-203ea0223027?q=80&w=2670&auto=format&fit=crop';

  // Active filter tags
  const activeFilters = [
    filters.category !== 'all' && { key: 'category', label: `CATEGORY: ${filters.category}` },
    filters.subCategory && filters.subCategory !== 'all' && { key: 'subCategory', label: `TYPE: ${filters.subCategory}` },
    filters.collection && filters.collection !== 'all' && { key: 'collection', label: `COLLECTION: ${filters.collection}` },
    filters.color !== 'all' && { key: 'color', label: `PALETTE: ${filters.color}` },
    filters.shipping && { key: 'shipping', label: 'FREE SHIPPING' },
  ].filter(Boolean);

  return (
    <main className="bg-champagne font-body min-h-screen">
      {/* Header Section */}
      <section className="pt-8 pb-6 px-12 lg:px-24 text-center">
        <h2 className="text-[12vw] font-editorial font-black text-bronze uppercase leading-none tracking-tighter">
          PRODUCTS
        </h2>
        <div className="mt-6 flex justify-center items-center gap-4">
          <div className="h-px w-12 bg-gold/40" />
          <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold">
            Curated Archival Drop 2025
          </span>
          <div className="h-px w-12 bg-gold/40" />
        </div>

        {/* Breadcrumb */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/50">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span>Collections</span>
          {filters.category !== 'all' && (
            <>
              <span>/</span>
              <span className="text-bronze">{filters.category}</span>
            </>
          )}
        </div>
      </section>

      {/* Category Pill Navigation */}
      <section className="px-8 lg:px-24 py-4 border-y border-bronze/10 overflow-x-auto">
        <div className="flex gap-3 whitespace-nowrap min-w-max mx-auto justify-center">
          {CATEGORY_PILLS.map((pill) => {
            const isActive = (pill.category === 'all' && filters.category === 'all') ||
              (pill.subCategory
                ? filters.category === pill.category && filters.subCategory === pill.subCategory
                : !pill.subCategory && filters.category === pill.category && (!pill.category || filters.subCategory === 'all'));
            return (
              <Link
                key={pill.label}
                to={pill.url}
                className={`px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] border transition-all duration-300 ${isActive
                  ? 'bg-gold border-gold text-chocolate shadow-md'
                  : 'border-bronze/20 text-bronze/60 hover:border-gold hover:text-gold'
                  }`}
              >
                {pill.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative w-full h-[60vh] bg-chocolate overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="Collection Hero"
            className="w-full h-full object-cover opacity-60"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-chocolate/20 to-chocolate/80" />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="text-[10px] font-bold tracking-[0.8em] text-gold mb-4 uppercase">Established 1994</p>
          <h2 className="text-6xl lg:text-9xl font-editorial font-black text-champagne uppercase tracking-tighter mb-4 leading-none">
            {filters.category !== 'all' ? filters.category : filters.collection !== 'all' ? filters.collection : 'THE ARCHIVE'}
          </h2>
          <div className="h-px w-24 bg-gold/40 mx-auto mb-8" />
        </div>
        <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-champagne/10 pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase">Authenticity Checked</span>
            <span className="text-[8px] font-medium tracking-[0.2em] text-champagne/40 uppercase">Hand-loomed Heritage Silks</span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.5em] text-champagne/40 uppercase">
            {products.length} Artifacts
          </span>
        </div>
      </section>

      {/* Visual Categorization Directory (Only visible when no specific filter or just 'all' is selected) */}
      {filters.category === 'all' && filters.collection === 'all' && !filters.subCategory && (
        <section className="px-8 lg:px-24 py-24 bg-bronze/5">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-end mb-16">
              <div>
                <h3 className="text-3xl lg:text-5xl font-editorial font-bold text-bronze uppercase tracking-tighter leading-none mb-4">
                  Explore the<br />Categorical Narrative
                </h3>
                <div className="h-1 w-20 bg-gold" />
              </div>
              <p className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase hidden lg:block">
                Curated by House of Angel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Sarees', img: '/assets/landing/hero-saree.jpg', url: '/products?category=Women&subCategory=Sarees', count: 'Heritage Drapes' },
                { label: 'Lehengas', img: '/assets/landing/hero-lehenga.jpg', url: '/products?category=Women&subCategory=Lehengas', count: 'Bridal Archive' },
                { label: 'Menswear', img: '/assets/landing/hero-men.jpg', url: '/products?category=Men', count: 'Royal Heritage' },
              ].map((cat) => (
                <Link key={cat.label} to={cat.url} className="group relative aspect-[4/5] overflow-hidden rounded-sm hover-lift">
                  <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate/90 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-[8px] font-black text-gold tracking-[0.3em] uppercase mb-1">{cat.count}</p>
                    <h4 className="text-2xl font-editorial font-bold text-champagne uppercase tracking-tight">{cat.label}</h4>
                    <div className="mt-4 flex items-center gap-2 text-[8px] font-bold text-champagne tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      EXPLORE COLLECTION <span className="material-symbols-outlined text-xs">east</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Active Filter Tags */}
      {activeFilters.length > 0 && (
        <div className="px-8 lg:px-24 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/40">
              Active Filters:
            </span>
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterValue(f.key, f.key === 'shipping' ? false : 'all')}
                className="flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.25em] text-bronze bg-bronze/10 border border-bronze/20 hover:border-gold hover:text-gold transition-all"
              >
                {f.label}
                <span className="text-gold font-black ml-1">×</span>
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="text-[9px] font-bold uppercase tracking-[0.25em] text-bronze/40 hover:text-gold transition-colors"
            >
              Clear All ×
            </button>
          </div>
        </div>
      )}

      {/* Filter + Product Grid */}
      <div className="px-8 lg:px-24 pb-20">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Sidebar */}
          <Filters />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <Sort />
            {products.length < 1 ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-editorial font-bold text-bronze uppercase">
                    No artifacts found
                  </h3>
                  <p className="text-sm text-bronze/50 uppercase tracking-widest">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold hover:text-bronze transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : grid_view ? (
              <GridView products={products} />
            ) : (
              <ListView products={products} />
            )}

            {/* Load More hint */}
            {products.length > 0 && (
              <div className="mt-20 text-center space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40">
                  Showing {products.length} archival pieces
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
