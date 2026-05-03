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
  ReviewModal,
  UserReview,
  NotifyMeModal,
} from '../../components';
import { BespokeStitchingForm } from '../../components/archive';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/user_context';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { OptimizedImage } from '../../components/archive/shared';
import { motion, useScroll, useTransform } from 'framer-motion';

// Archival Add-ons options
const ADD_ONS = [
  { key: 'priority', label: 'Prioritized Archival Delivery', desc: 'Ready in 7 working days', price: 3500 },
  { key: 'hemming', label: 'Hand-Embroidered Dupatta Hemming', desc: 'Finished edge with matching zari', price: 800 },
  { key: 'petticoat', label: 'Pre-Stitched Petticoat', desc: 'Custom colour-matched', price: 600 },
  { key: 'giftbox', label: 'Archival Gift Packaging', desc: 'Heritage box + monogram tag', price: 400 },
];

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
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [openAccordion, setOpenAccordion] = useState(null);
  const { wishlist, toggleWishlistItem, currentUser } = useUserContext();

  const toggleAddOn = (key) => setSelectedAddOns(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  );
  const toggleAccordion = (id) => setOpenAccordion(prev => prev === id ? null : id);

  const { scrollYProgress } = useScroll();
  const stickyOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const stickyY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

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

  // Derived "Complete The Look" products (Smart Logic: same category, different product, shuffled)
  const relatedProducts = React.useMemo(() => {
    return products
      .filter(p => p.category === category && p.id !== id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [products, category, id]);


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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">

            {/* Left: Sticky Images */}
            <div className="lg:sticky lg:top-32 self-start">
              <ProductImages images={images} />
            </div>

            {/* Right: Product Info */}
            <section className="space-y-12 pt-4">
              {/* Name & Title */}
              <div className="space-y-4">
                {company && (
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold block">
                    {company} Collection
                  </span>
                )}
                <div className="flex justify-between items-start gap-4">
                  <h1 className="text-5xl lg:text-8xl font-editorial font-black text-bronze tracking-tighter leading-[0.85] uppercase">
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
                <div className="flex items-center gap-6 pt-2">
                  <Stars stars={stars} reviews={numberOfReviews} />
                </div>
              </div>

              {/* Price & Value Breakdown */}
              <div className="border-y border-bronze/10 py-8 space-y-5">
                <div className="flex flex-wrap items-end gap-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-bronze/50 block">Archival Investment</span>
                    <span className="text-5xl font-editorial font-bold text-bronze leading-none">
                      {formatPrice(((price * (1 - (product.discountPercent || 0) / 100)) * (1 + (product.taxPercent || 0) / 100)))}
                    </span>
                  </div>
                  {(product.discountPercent > 0) && (
                    <div className="pb-1 flex items-center gap-4">
                      <span className="text-2xl font-editorial font-medium text-bronze/40 line-through">
                        {formatPrice(price)}
                      </span>
                      <span className="px-3 py-1.5 bg-gold text-white text-xs font-black uppercase tracking-widest rounded-sm leading-none shadow-sm">
                        -{product.discountPercent}% Archival
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs font-bold uppercase tracking-[0.2em] text-bronze/60 bg-bronze/5 p-4 rounded-lg">
                  <span className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-gold">verified</span> Authenticity Verified</span>
                  <span>Incl. {product.taxPercent || 0}% Regional GST</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-bronze">
                <p className="text-base font-medium leading-relaxed text-bronze/80">
                  {description}
                </p>
              </div>

              {/* Meta Data */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-[11px] font-bold uppercase tracking-[0.2em] text-bronze/60">
                <div>
                  <span className="block text-bronze/30 mb-1">Availability</span>
                  <span className={stock > 0 ? 'text-green-700' : 'text-red-500'}>
                    {stock > 0 ? 'In Stock (Ready to Ship)' : 'Out of Stock'}
                  </span>
                </div>
                <div>
                  <span className="block text-bronze/30 mb-1">SKU</span>
                  <span>{sku}</span>
                </div>
                <div>
                  <span className="block text-bronze/30 mb-1">Category</span>
                  <span>{category}</span>
                </div>
                <div>
                  <span className="block text-bronze/30 mb-1">Type</span>
                  <span>{subCategory}</span>
                </div>
              </div>

              {/* Bespoke Stitching Form */}
              <BespokeStitchingForm onMeasurementsChange={setMeasurements} />

              {/* Add to Cart or Notify Me */}
              <div className="pt-8">
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

              {/* Archival Add-Ons Upsells */}
              <div className="border border-bronze/10 p-6 bg-white/30 space-y-5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold">
                  Archival Add-Ons
                </h3>
                {ADD_ONS.map((addon) => (
                  <label key={addon.key} className="flex items-start gap-4 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(addon.key)}
                      onChange={() => toggleAddOn(addon.key)}
                      className="mt-0.5 w-4 h-4 border-bronze/20 accent-gold"
                    />
                    <div className="flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze group-hover:text-gold transition-colors">
                        {addon.label}
                      </span>
                      <p className="text-[9px] text-bronze/50 mt-0.5">{addon.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gold whitespace-nowrap">
                      +{formatPrice(addon.price)}
                    </span>
                  </label>
                ))}
              </div>

              {/* Product Detail Accordion */}
              <div className="space-y-0 border-t border-bronze/10">
                {/* Review Modal Trigger */}
                <div className="py-6 border-b border-bronze/10">
                  <ReviewModal product={product} />
                </div>

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

              {/* Reviews Preview */}
              <section className="space-y-6 pt-12">
                <h3 className="text-2xl font-editorial font-bold text-bronze uppercase tracking-tight">
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

            </section>
          </div>
        </div>
      </section>

      {/* The Atelier Section - Cinema Style */}
      <section className="bg-chocolate py-32 px-8 lg:px-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-bronze/5 mix-blend-overlay"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em]">
                Behind The Seams
              </span>
              <h2 className="text-5xl lg:text-8xl font-editorial font-black text-champagne uppercase tracking-tighter leading-none">
                The<br />Atelier
              </h2>
              <div className="space-y-8 text-champagne/70 text-sm font-medium leading-loose max-w-md">
                <p>
                  Every {name} is a testament to the enduring legacy of Indian craftsmanship.
                  Hand-woven by master artisans in Varanasi and embellished in our Mumbai atelier,
                  every silhouette tells a story of heritage reimagined.
                </p>
                <p>
                  We prioritize ethical sourcing and verify every thread of silk ensures dignity for our artisans.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-[2px] overflow-hidden outline outline-1 outline-offset-8 outline-gold/20">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi1wnjhK4qOjfkb80VGF0IuC5E1qGaFVrrnRKRpSjPk1nnNRFqyPkRSRGISN87lzBIputOQptvoh3tCcy5qCIbij1762gia4rJHW8KOC5XKsACOQ8ki_VqYYUtr6scumc2oUsNJc-KdWgbnpegItgvJePBLEdEsVoMSZ8FEooUNCGPSeTjp6qQDLh53C_b5Ms-Szy63vHqMzXINit5Yz7cv4pH5ghB0yxXL1jojp7MOzA1-z1etBt2oepFyBtHbFPabdFTTMa5aHo"
                alt="Atelier Craftsmanship"
                className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-[3000ms]"
              />
            </div>
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
      {/* Sticky Affirmation CTA */}
      {stock > 0 && isProductValid && (
        <motion.div
          style={{ opacity: stickyOpacity, y: stickyY }}
          className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-bronze/10 p-4 lg:py-6 lg:px-12 shadow-[0_-10px_40px_-15px_rgba(122,92,65,0.2)] md:hidden flex items-center justify-between pointer-events-auto"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-bronze truncate w-32">{name}</p>
            <p className="text-[11px] font-editorial font-bold text-bronze">{formatPrice(price)}</p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
            className="px-6 py-4 bg-bronze text-champagne text-[9px] font-bold uppercase tracking-[0.3em] rounded-none hover:bg-gold transition-colors shadow-lg"
          >
            Add To Collection
          </button>
        </motion.div>
      )}
    </main>
  );
};

export default SingleProductPage;
