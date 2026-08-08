import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useFilterContext } from '../../context/filter_context';
import { Filters, Sort, GridView, ListView } from '../../components';
import { Loading, Error } from '../../components';
import { useProductsContext } from '../../context/products_context';
import { normalizeFilterValue, categoryData, categoryLabel } from '../../utils/categoryData';
import { collectionTheme } from '../../utils/collectionTheme';

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
    all_products,
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

  // Ground tint, accent and imagery for whatever is being browsed. Every route
  // funnels into this one page, so without this Jewellery looked identical to
  // Menswear.
  const { category, subCategory, productType, collection, fabric } = filters;
  const theme = useMemo(
    () => collectionTheme({ category, subCategory, productType, collection, fabric }),
    [category, subCategory, productType, collection, fabric]
  );

  // The way into the department, shown in the masthead. Without these the header
  // was a title and one line floating in a tall band — decoration paying no rent.
  const quickLinks = useMemo(() => {
    if (!category || category === 'all') return [];
    const subs = categoryData[category];
    if (!subs) return [];
    // Once inside a sub-category, offer its product types instead.
    if (subCategory && subCategory !== 'all') {
      return (subs[subCategory] || []).map((t) => ({
        label: t,
        to: `/products?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}&productType=${encodeURIComponent(t)}`,
        active: productType === t,
      }));
    }
    return Object.keys(subs).map((sub) => ({
      label: sub,
      to: `/products?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(sub)}`,
      active: false,
    }));
  }, [category, subCategory, productType]);

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
    if (filters.category && filters.category !== 'all') return categoryLabel(filters.category);
    return 'The Archive';
  }, [filters.category, filters.subCategory, filters.productType, filters.collection, filters.fabric]);

  const breadcrumb = useMemo(
    () =>
      [
        filters.category !== 'all' && categoryLabel(filters.category),
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

  // An empty section used to be one small caption stranded in a tall empty
  // column, which read as a broken page rather than a curated one. Rather than
  // apologise into a void, offer the shopper something real to look at: pieces
  // from the same department where possible, otherwise from the catalogue at
  // large. Nothing is fabricated — these are ordinary products, clearly labelled
  // as a different thing from what was asked for.
  const suggestions = useMemo(() => {
    if (products.length > 0) return [];
    const pool = all_products || [];
    const inStock = pool.filter((p) => (p.stock ?? 0) > 0);
    const sameDepartment =
      filters.category && filters.category !== 'all'
        ? inStock.filter((p) => p.category === filters.category)
        : [];
    return (sameDepartment.length >= 4 ? sameDepartment : inStock).slice(0, 4);
  }, [products.length, all_products, filters.category]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <main className="bg-champagne font-body min-h-screen">
      {/* ---------------------------------------------------------------- */}
      {/* Header — a banded, per-context masthead. Compact by design: the       */}
      {/* 60vh hero this replaced pushed the products a screen and a half down. */}
      {/* ---------------------------------------------------------------- */}
      <header className="relative" style={{ backgroundColor: theme.tint }}>
        {/* Ground.
            A department with a commissioned embroidery banner shows it full width
            — those images are drawn with a deliberately empty left half for the
            headline, so they are the ground rather than something hidden behind a
            texture. Everything else falls back to the generated layers: a vertical
            gradient, a jaali lattice, and a photograph bled off the right.   */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(180deg, ${theme.tint}88 0%, transparent 45%, ${theme.accent}14 100%)` }}
        />


        {/* The banner itself. Desktop only: the artwork is 1.75:1 and the band is
            far wider than it is tall, so on a phone `cover` crops to the middle —
            straight through the ornament — and the headline would land on top of
            the embroidery instead of beside it. */}
        {theme.banner && (
          <div
            aria-hidden="true"
            /* -bottom-[420px] is the whole trick. The artwork is not confined to
               the masthead any more — it runs on behind the toolbar and the first
               rows of product, dying out slowly over 420px of extra height.

               A fade inside the band could never work: however soft it was, the
               ornament still had to finish somewhere, and the eye finds that
               place instantly. Carrying it past the boundary means there is no
               boundary to find. The page reads as one piece of embroidered
               ground that the products happen to be laid on. */
            className="pointer-events-none absolute inset-x-0 top-0 -bottom-[420px] hidden md:block"
            style={{
              backgroundImage: `url(${theme.banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'right center',
              // The artwork is a cooler, greyer cream than the page's champagne
              // (#E3D0BC against #F7E7CE). Sepia warms it into the same golden
              // beige family, so the two stop reading as two different papers.
              filter: 'sepia(0.32) saturate(1.18)',
              // Per banner, not one number for all four. The embroidery artwork
              // is a quiet textile texture and reads as nothing at 55%; the
              // Jewellery banner is a busy product photograph and needs holding
              // back at exactly that. Falls back to the cautious value.
              opacity: theme.bannerOpacity ?? 0.55,
              // Dissolve the artwork itself rather than covering it. A veil of
              // champagne over dense gold thread only tints the thread — the
              // ornament stays readable right up to the cut, which is exactly
              // what kept showing as an edge. Masking discards those pixels, so
              // what remains at the bottom is the band's own champagne, which is
              // the page colour to the byte.
              // Measured across the taller box: full strength through the band,
              // then a long quiet decay across the overhang.
              maskImage:
                'linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,0.28) 78%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,0.28) 78%, transparent 100%)',
            }}
          />
        )}

        {/* A cloth page borrows the home page's circle, which is a tight square
            crop — stretched across 60% of the band it turns to mush. So the
            photograph only bleeds for departments and collections; cloth gets a
            soft pool of its own colour behind the circle instead. */}
        {theme.image && !theme.round && !theme.banner && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-3/5 hidden md:block"
            style={{
              backgroundImage: `url(${theme.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 25%',
              opacity: 0.5,
              mixBlendMode: 'multiply',
              filter: 'sepia(0.2) saturate(1.2) contrast(1.05)',
              // Soft radial gradient mask so the photograph edges fade into the champagne background color
              maskImage:
                'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 75%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 75%)',
            }}
          />
        )}

        {theme.round && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 hidden lg:block"
            style={{
              background: `radial-gradient(closest-side at 62% 50%, ${theme.accent}26, ${theme.accent}0A 55%, transparent 78%)`,
            }}
          />
        )}

        {/* Contrast wash. Guarantees readability of the headline while letting the photo bleed through on the right */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute ${theme.banner ? 'inset-x-0 top-0 -bottom-[420px]' : 'inset-0'}`}
          style={{
            background: theme.banner
              ? `linear-gradient(90deg, ${theme.tint}E6 0%, ${theme.tint}99 34%, transparent 62%)`
              : `linear-gradient(90deg, ${theme.tint}F2 0%, ${theme.tint}B3 28%, ${theme.tint}44 55%, transparent 78%)`,
          }}
        />

        {/* Concentric arcs, sweeping in from the top right. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block overflow-hidden">
          <span
            className="absolute -top-28 -right-20 w-[420px] h-[420px] rounded-full border-2"
            style={{ borderColor: theme.accent, opacity: theme.banner ? 0.25 : 0.4 }}
          />
          <span
            className="absolute -top-44 -right-40 w-[600px] h-[600px] rounded-full border-2"
            style={{ borderColor: theme.accent, opacity: theme.banner ? 0.18 : 0.28 }}
          />
        </div>

        {/* The band used to end on a hard horizontal line, because its tint was
            near-champagne but not champagne. The tints now match, and this fades
            the last 100px into the page as well, so the masthead resolves into
            the grid instead of stopping against it. */}
        <div className="container mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-16 pt-20 sm:pt-24 lg:pt-28 pb-8 lg:pb-10 relative z-10">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-bold uppercase tracking-[0.25em] text-bronze/45 mb-4 lg:mb-5">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-bronze/25">/</span>
            <Link to="/products" className="hover:text-gold transition-colors">Collections</Link>
            {breadcrumb.map((crumb) => (
              <React.Fragment key={crumb}>
                <span className="text-bronze/25">/</span>
                <span className="text-bronze">{crumb}</span>
              </React.Fragment>
            ))}
          </nav>

          <div className="flex items-center justify-between gap-10">
            <div className="min-w-0">
              {/* Bronze rather than the gold accent: at 9px over a photographic
                  banner gold measures about 2.1:1 against every ground tint, and
                  small text needs 4.5:1. Bronze is the same brand palette and
                  measures 5.2:1. Gold stays on the rule below, which is
                  decoration and carries no reading load. */}
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.5em] block mb-2.5 text-bronze/75">
                {theme.eyebrow}
              </span>
              {/* Scales down as the name gets longer, so "Jodhpuri Jaket Sets"
                  does not set the height of the whole band. */}
              <h1
                className={`font-editorial font-black text-bronze uppercase tracking-tighter leading-[0.95] ${
                  collectionTitle.length > 18
                    ? 'text-2xl sm:text-3xl lg:text-4xl'
                    : 'text-3xl sm:text-4xl lg:text-5xl'
                }`}
              >
                {collectionTitle}
              </h1>
              <div className="h-[3px] w-14 mt-4" style={{ backgroundColor: theme.accent }} />
              {theme.line && (
                <p className="text-[12px] sm:text-[13px] font-medium text-bronze/60 mt-4 max-w-md leading-relaxed">
                  {theme.line}
                </p>
              )}

              {/* Quick links.
                  The count varies from 2 to 8 depending on where you are, so the
                  row cannot be laid out for one case. Two behaviours instead of a
                  fixed grid:

                  Phone — one line that scrolls sideways, bleeding to the screen
                  edge so it is obvious more exists. Wrapping 8 chips at 390px
                  produces four stacked lines and pushes the products off screen,
                  which is the opposite of what a compact masthead is for.

                  Tablet and up — wrap, but inside a capped width. The cap is what
                  does the thinking: 3 chips stay on one line, 7 or 8 break evenly
                  onto two, and nothing ever runs far enough right to crowd the
                  mounted print. No counting, no breakpoint per department. */}
              {quickLinks.length > 0 && (
                <div className="mt-6 -mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto sm:overflow-visible quicklinks">
                  <div className="flex gap-2 flex-nowrap sm:flex-wrap sm:max-w-xl">
                  {quickLinks.map((q) => (
                    <Link
                      key={q.label}
                      to={q.to}
                      /* Chocolate on gold, not white — the same pairing the
                         product badges use, and the only readable one now that
                         the accent is the house gold rather than a dark maroon. */
                      className={`shrink-0 px-4 py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border transition-colors ${
                        q.active ? 'text-chocolate' : 'bg-white/45 text-bronze/70 hover:text-bronze'
                      }`}
                      style={
                        q.active
                          ? { backgroundColor: theme.accent, borderColor: theme.accent }
                          : { borderColor: `${theme.accent}44` }
                      }
                    >
                      {q.label}
                    </Link>
                  ))}
                  </div>
                </div>
              )}
            </div>

            {theme.image && (
              <div className="hidden lg:block shrink-0">
                {theme.round ? (
                  /* Cloth: the same circle the shopper clicked on the home page,
                     so the page they land on is visibly the one they chose. Kept
                     small — it is a swatch, not a campaign image. */
                  <div className="relative w-[170px] xl:w-[190px]">
                    <span
                      aria-hidden="true"
                      className="absolute -inset-3 rounded-full border"
                      style={{ borderColor: `${theme.accent}33` }}
                    />
                    <div
                      className="relative aspect-square rounded-full overflow-hidden shadow-[0_18px_40px_-18px_rgba(61,43,31,0.55)]"
                      style={{ boxShadow: `0 0 0 1px ${theme.accent}40 inset` }}
                    >
                      <img
                        src={theme.image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/45 pointer-events-none" />
                    </div>
                  </div>
                ) : (
                  /* Over a banner the photograph is mounted: a cream mat, a fine
                     accent rule and a real shadow, so it reads as a print laid on
                     the embroidered silk rather than a second image fighting the
                     first. The mat is what does the work — without it the photo
                     and the ornament sit in the same plane and both lose.
                     On a plain ground there is nothing to sit on, so it stays the
                     lighter framed panel it was. */
                  <div className="relative">
                    {/* The same ring that circles the cloth swatch, scaled up so
                        the print sits inside an orbit rather than floating. Drawn
                        before the mount in the DOM so the mount paints over it. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] xl:w-[340px] aspect-square rounded-full border pointer-events-none"
                      style={{ borderColor: `${theme.accent}2E` }}
                    />
                  <div
                    className={`relative w-[210px] xl:w-[240px] rounded-xl ${
                      theme.banner
                        ? 'p-2.5 bg-[#FBF6EE] shadow-[0_30px_60px_-22px_rgba(61,43,31,0.55),0_0_70px_28px_rgba(253,250,246,0.5)] ring-1 ring-white/70'
                        : 'ring-1 ring-white/40 shadow-[0_18px_45px_-20px_rgba(61,43,31,0.5)]'
                    }`}
                  >
                    <div className={`relative aspect-[4/5] overflow-hidden ${theme.banner ? 'rounded-lg' : 'rounded-xl'}`}>
                      <img
                        src={theme.image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      {!theme.banner && (
                        /* Thin inner rule — the framed-print detail that makes the
                           panel read as an object rather than a cropped photo. */
                        <span className="absolute inset-2 border border-white/25 rounded-lg pointer-events-none" />
                      )}
                    </div>
                    {theme.banner && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-[5px] rounded-[10px] border pointer-events-none"
                        style={{ borderColor: `${theme.accent}33` }}
                      />
                    )}
                  </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <style>{`
          .quicklinks::-webkit-scrollbar { display: none; }
          .quicklinks { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Filters + grid                                                    */}
      {/* ---------------------------------------------------------------- */}
      {/* z-10 puts the grid above the artwork overhanging from the masthead, so
          the ornament reads as ground the products sit on rather than a layer
          over them. */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-16 pb-20 lg:pb-28">
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
              <div className="py-10 lg:py-14">
                <div className="text-center max-w-md mx-auto space-y-5">
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

                {suggestions.length > 0 && (
                  <div className="mt-14 lg:mt-20">
                    <div className="flex items-center gap-5 mb-8">
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/45 whitespace-nowrap">
                        In the meantime
                      </span>
                      <span className="h-px flex-1 bg-bronze/12" />
                    </div>
                    <GridView products={suggestions} />
                  </div>
                )}
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
