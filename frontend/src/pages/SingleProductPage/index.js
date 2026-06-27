import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useProductsContext } from '../../context/products_context';
import { single_product_url as url } from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';
import {
  Loading,
  ProductImages,
  AddToCart,
  Stars,
  UserReview,
  NotifyMeModal,
} from '../../components';

import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { OptimizedImage } from '../../components/archive/shared';



// Accordion data builder
const buildAccordionSections = (name, description, careInstructions) => [
  { id: 'craft', title: 'THE CRAFT', content: `Every piece of "${name}" is a testament to the enduring legacy of Indian craftsmanship. Hand-woven by master artisans in Varanasi and embellished in our Mumbai atelier, every silhouette tells a story of heritage reimagined. ${description}` },
  { id: 'fabric', title: 'FABRIC & MATERIALITY', content: careInstructions ? careInstructions : 'Pure hand-woven silk with 22K gold zari thread embroidery. Fabric weight: ~120gsm. Fully lined in pure silk. Dry clean only. Country of Origin: India.' },
  { id: 'size', title: 'SIZE & STITCHING GUIDE', content: 'Standard sizes: XS (Bust 32"), S (34"), M (36"), L (38"), XL (40"), 2XL (42"), 3XL (44"). Custom stitching adds 15–21 days to delivery.' },
  { id: 'shipping', title: 'SHIPPING & RETURNS', content: 'Complimentary domestic shipping on all orders. International shipping from ₹1,200. Delivery: 5–7 days standard, 1–2 days priority. 30-day free exchanges on unworn items. Custom-stitched orders are non-returnable.' },
];

const SingleProductPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const {
    single_product_loading: loading,
    single_product_error: error,
    single_product: product,
    fetchSingleProduct,
    products,
  } = useProductsContext();

  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [_measurements, setMeasurements] = useState({});  // eslint-disable-line no-unused-vars
  const [openAccordion, setOpenAccordion] = useState(null);
  const { wishlist, toggleWishlistItem, currentUser } = useUserContext();

  const toggleAccordion = (id) => setOpenAccordion(prev => prev === id ? null : id);

  useEffect(() => {
    fetchSingleProduct(`${url}${id}`);
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [id]);

  const {
    name = '',
    price = 0,
    description = '',
    stock = 0,
    rating: stars = 0,
    numberOfReviews = 0,
    reviews = [],
    _id: sku = '',
    company = '', // Used as Collection
    images = [],
    category = '',
    subCategory = '',
    careInstructions = '',
    badgeText = '',
    leadTimeDays = 0,
    composition = '',
  } = product || {};

  useEffect(() => {
    if (name && id) {
      document.title = `Angel Fashion Studio | ${name}`;

      // Update Recently Viewed in LocalStorage
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updatedList = [id, ...recentlyViewed.filter(itemId => itemId !== id)].slice(0, 8);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedList));
    }
  }, [name, id]);

  // Engineered "Complete The Look" Recommendation Logic
  const relatedProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Cross-sell: Find Jewellery for complementary styling
    const jewellery = products.filter(p => p.category?.toLowerCase() === 'jewellery' && p.id !== id);
    
    // Up-sell/Similar: Find items in the exact same subcategory
    const similar = products.filter(p => p.category === category && p.subCategory === subCategory && p.id !== id);
    
    let recommendations = [];
    
    if (category?.toLowerCase() !== 'jewellery') {
       // If clothing: 1 similar item + up to 2 jewellery pieces
       const shuffledSimilar = similar.sort(() => Math.random() - 0.5);
       const shuffledJewels = jewellery.sort(() => Math.random() - 0.5);
       
       if (shuffledSimilar.length > 0) recommendations.push(shuffledSimilar[0]);
       recommendations = [...recommendations, ...shuffledJewels.slice(0, 2)];
       
       // Fill remaining slots with more similar items if needed
       if (recommendations.length < 3) {
         const needed = 3 - recommendations.length;
         recommendations = [...recommendations, ...shuffledSimilar.slice(1, 1 + needed)];
       }
    } else {
       // If jewellery: Suggest other jewellery
       recommendations = jewellery.sort(() => Math.random() - 0.5).slice(0, 3);
    }
    
    // Ultimate fallback: Anything in the same category
    if (recommendations.length < 3) {
       const needed = 3 - recommendations.length;
       const fallback = products
         .filter(p => p.category === category && p.id !== id && !recommendations.find(r => r.id === p.id))
         .sort(() => Math.random() - 0.5)
         .slice(0, needed);
       recommendations = [...recommendations, ...fallback];
    }
    
    return recommendations.slice(0, 3);
  }, [products, category, subCategory, id]);


  if (loading) return <Loading />;

  const isProductValid = product && product._id && product.name;

  if (error || !isProductValid) {
    return (
      <main className="bg-champagne font-body min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 py-32 px-8">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block">
            Archive Collections
          </span>
          <h2 className="text-5xl lg:text-7xl font-editorial font-black text-bronze tracking-tighter uppercase leading-none">
            Artifact<br />Not Found
          </h2>
          <div className="h-px w-12 bg-gold mx-auto" />
          <Link
            to="/products"
            className="inline-flex items-center gap-4 px-10 py-5 bg-bronze text-champagne font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-chocolate transition-all duration-500"
          >
            Back to Collections
            <span className="material-symbols-outlined text-sm">east</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-champagne font-body min-h-screen">
      {/* Minimal Header for Luxury Feel */}
      <section className="pt-32 pb-12 px-8 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={() => history.goBack()}
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 hover:text-gold transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">west</span>
              Back
            </button>
            <span className="text-bronze/20">—</span>
            <Link
              to="/products"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50 hover:text-gold transition-colors"
            >
              {category} / {subCategory}
            </Link>
          </div>
        </div>
      </section>


      <section className="pb-32 px-8 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          {/* Product Layout: Sticky Images Left, Info Right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-20">

            {/* Left: Sticky Images */}
            <div className="lg:sticky lg:top-32 self-start lg:col-span-2">
              <ProductImages images={images} />
            </div>

            {/* Right: Product Info */}
            <section className="space-y-10 pt-4 lg:col-span-3">
              {/* Name & Title */}
              <div className="space-y-4">
                <div className="space-y-1">
                  {badgeText && (
                    <span className="inline-block px-2 py-1 bg-gold/20 text-gold text-[8px] lg:text-[9px] font-black uppercase tracking-widest rounded-sm mb-2">
                      {badgeText}
                    </span>
                  )}
                  {company && (
                    <span className="text-[9px] lg:text-[11px] font-bold uppercase tracking-[0.4em] text-gold block">
                      {company} Collection
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-start gap-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-editorial font-black text-bronze tracking-tight leading-normal lg:leading-[1.2] uppercase">
                    {name}
                  </h1>
                  <button
                    onClick={async () => {
                      if (!currentUser) return toast.info('Please login to save favorites');
                      const res = await toggleWishlistItem(id);
                      if (!res.success) toast.error(res.message);
                    }}
                    className="p-4 bg-white border border-bronze/10 rounded-full text-bronze hover:border-gold hover:text-gold transition-all duration-300 shadow-sm"
                  >
                    {wishlist.some(item => (item._id || item) === id) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  </button>
                </div>
                <div className="flex items-center gap-6 pt-1 lg:pt-2">
                  <Stars stars={stars} reviews={numberOfReviews} />
                </div>
              </div>

              {/* Price & Value Breakdown */}
              <div className="border-y border-bronze/10 py-8 space-y-5">
                <div className="flex flex-wrap items-end gap-6">
                  <div className="space-y-1">
                    <span className="text-[9px] lg:text-xs font-bold uppercase tracking-[0.2em] text-bronze/50 block">Archival Investment</span>
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-bronze leading-none">
                      {formatPrice(price * (1 - (product.discountPercent || 0) / 100))}
                    </span>
                  </div>
                  {product.discountPercent > 0 && (
                    <div className="pb-1 flex items-center gap-2 lg:gap-4">
                      <span className="text-xl lg:text-2xl font-editorial font-medium text-bronze/40 line-through">
                        {formatPrice(price)}
                      </span>
                      <span className="px-2 lg:px-3 py-1 lg:py-1.5 bg-gold text-white text-[9px] lg:text-xs font-black uppercase tracking-widest rounded-sm leading-none shadow-sm">
                        -{product.discountPercent}% Off
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between text-[9px] lg:text-xs font-bold uppercase tracking-[0.2em] text-bronze/60 bg-bronze/5 p-3 lg:p-4 rounded-lg">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[11px] lg:text-sm text-gold">verified</span> Authenticity Verified</span>
                  <span>Incl. 10% GST</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-bronze">
                <p className="text-sm lg:text-base font-medium leading-relaxed text-bronze/80">
                  {description}
                </p>
              </div>

              {/* Meta Data */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 lg:gap-y-5 gap-x-4 lg:gap-x-8 text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-bronze/60 bg-bronze/5 p-4 rounded-lg">
                <div>
                  <span className="block text-bronze/40 mb-1">Availability</span>
                  <span className={stock > 0 ? 'text-green-700' : 'text-red-500'}>
                    {stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div>
                  <span className="block text-bronze/40 mb-1">Lead Time</span>
                  <span>{leadTimeDays > 0 ? `Ships in ${leadTimeDays} Days` : 'Ready to Ship'}</span>
                </div>
                <div>
                  <span className="block text-bronze/40 mb-1">Composition</span>
                  <span>{composition || 'Premium Blend'}</span>
                </div>
                <div>
                  <span className="block text-bronze/40 mb-1">SKU</span>
                  <span className="truncate">{sku.substring(0, 8)}...</span>
                </div>
                <div>
                  <span className="block text-bronze/40 mb-1">Category</span>
                  <span>{category}</span>
                </div>
                <div>
                  <span className="block text-bronze/40 mb-1">Type</span>
                  <span>{subCategory}</span>
                </div>
              </div>



              {/* Add to Cart or Notify Me */}
              <div className="pt-2">
                {stock > 0 ? (
                  <AddToCart product={product} />
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Archival Availability: Out of Stock</p>
                      <p className="text-[9px] text-red-500/60 font-bold mt-1">This heritage piece is temporarily unavailable.</p>
                    </div>
                    <button
                      onClick={() => setIsNotifyModalOpen(true)}
                      className="w-full py-5 bg-bronze text-champagne text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gold transition-all duration-500 active:scale-[0.98]"
                    >
                      Back to Archive Alert
                    </button>
                  </div>
                )}
              </div>

              {isNotifyModalOpen && (
                <NotifyMeModal productId={id} productName={name} onClose={() => setIsNotifyModalOpen(false)} />
              )}



            </section>
          </div>

          {/* 2-Column Info: Accordions (Left) & Reviews (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-20 pt-10 border-t border-bronze/10">
            {/* Product Detail Accordion */}
            <div className="space-y-0 lg:pr-8">
              {/* Accordion Sections */}
              {buildAccordionSections(name, description, careInstructions).map((section) => (
                <div key={section.id} className="border-b border-bronze/10">
                  <button
                    onClick={() => toggleAccordion(section.id)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-bronze group-hover:text-gold transition-colors">
                      {section.title}
                    </span>
                    <span className={`material-symbols-outlined text-gold text-base transition-transform duration-300 ${openAccordion === section.id ? 'rotate-45' : 'rotate-0'}`}>
                      add
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === section.id ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm text-bronze/70 leading-relaxed font-medium">{section.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews Preview (Hidden on mobile) */}
            <section className="space-y-8 lg:pl-8 border-t lg:border-t-0 lg:border-l border-bronze/10 pt-10 lg:pt-0 hidden md:block">
              <h3 className="text-3xl font-editorial font-bold text-bronze uppercase tracking-tight">
                Client Diaries
              </h3>
              {reviews.length < 1 && (
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-bronze/40">
                  No reviews yet — be the first to review this heritage piece.
                </p>
              )}
              <div className="space-y-8">
                {reviews.map((review, index) => (
                  <UserReview key={index} {...review} />
                ))}
              </div>
            </section>
          </div>

        </div>
      </section>



      {/* "Complete The Look" - Dynamic */}
      {relatedProducts.length > 0 && (
        <section className="py-32 px-8 lg:px-24 bg-champagne">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-24">
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block mb-6">
                Curated For You
              </span>
              <h2 className="text-5xl lg:text-7xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none">
                Complete<br />The Look
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <Link to={`/products/${p.id}`} key={p.id} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden mb-8">
                    <OptimizedImage
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-editorial font-bold text-bronze uppercase mb-2">{p.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-bronze/50 group-hover:text-gold transition-colors">View Artifact</span>
                      <span className="text-lg font-editorial text-bronze">{formatPrice(p.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
};

export default SingleProductPage;
