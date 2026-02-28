import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFilterContext } from '../../context/filter_context';
import { Filters, Sort, GridView, ListView } from '../../components';
import { Loading, Error } from '../../components';
import { useProductsContext } from '../../context/products_context';

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
    featured_products // Use for hero image
  } = useProductsContext();

  const location = useLocation();

  useEffect(() => {
    document.title = 'Angel Archive | Collections';
  }, []);

  // Parse query params to set initial filters (e.g. ?category=Women&subCategory=Sarees&collection=New+Arrivals)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');
    const collection = searchParams.get('collection');

    if (category && filters.category !== category) {
      setFilterValue('category', category);
    }
    if (subCategory && filters.subCategory !== subCategory) {
      setFilterValue('subCategory', subCategory);
    }
    if (collection && filters.collection !== collection) {
      setFilterValue('collection', collection);
    }
  }, [location.search, setFilterValue, filters.category, filters.subCategory, filters.collection]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  // Dynamic Hero Image Logic
  const heroImage = (products && products.length > 0) ? products[0].image :
    (featured_products && featured_products.length > 0) ? featured_products[0].image :
      "https://images.unsplash.com/photo-1583391733975-203ea0223027?q=80&w=2670&auto=format&fit=crop";

  return (
    <main className="bg-champagne font-body min-h-screen pt-32">
      {/* Header Section */}
      <section className="px-12 lg:px-24 py-16 text-center">
        <h2 className="text-[12vw] font-editorial font-black text-bronze uppercase leading-none tracking-tighter">
          PRODUCTS
        </h2>
        <div className="mt-8 flex justify-center items-center gap-4">
          <div className="h-px w-12 bg-gold/40"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-gold">Curated Archival Drop
            2024</span>
          <div className="h-px w-12 bg-gold/40"></div>
        </div>
      </section>

      {/* Heritage in Motion Section - Dynamic Image */}
      <section className="relative w-full h-[70vh] bg-chocolate overflow-hidden flex items-center justify-center mb-12">
        <div className="absolute inset-0 w-full h-full">
          <img alt="Collection Hero"
            className="w-full h-full object-cover opacity-60"
            src={heroImage} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-chocolate/10 to-chocolate/60"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <h2
            className="text-5xl lg:text-7xl font-editorial font-black text-champagne uppercase tracking-tighter mb-8">
            HERITAGE IN MOTION
          </h2>
          <div className="flex items-center justify-center">
            <button
              className="size-20 rounded-full border border-champagne/30 flex items-center justify-center text-champagne hover:bg-champagne hover:text-chocolate transition-all duration-500 group">
              <span
                className="material-symbols-outlined text-4xl fill-1 group-hover:scale-90 transition-transform">pause</span>
            </button>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <span className="text-[9px] font-bold tracking-[0.5em] text-champagne/40">AN ARCHIVAL STUDY OF FORM</span>
        </div>
      </section>

      <div className="px-8 lg:px-24 py-20">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Sidebar Filters */}
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
