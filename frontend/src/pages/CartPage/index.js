import React from 'react';
import { useCartContext } from '../../context/cart_context';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { OptimizedImage } from '../../components/archive/shared';
import { colorSwatch } from '../../utils/categoryData';

const CartPage = () => {
  const { cart, total_amount, shipping_fee, removeItem, toggleAmount, clearCart } = useCartContext();

  if (cart.length < 1) {
    return (
      <main className="bg-champagne font-body min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 py-32 px-8">
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.6em] block">
            Archive Collection
          </span>
          <h2 className="text-5xl lg:text-7xl font-editorial font-black text-bronze tracking-tighter uppercase leading-none">
            Your cart<br />is empty
          </h2>
          <div className="h-px w-12 bg-gold mx-auto" />
          <Link
            to="/products"
            className="inline-flex items-center gap-4 px-10 py-5 bg-bronze text-champagne font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-chocolate transition-all duration-500"
          >
            Explore Collections
            <span className="material-symbols-outlined text-sm">east</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 lg:pt-32 pb-40 lg:pb-32 bg-champagne min-h-screen">

      {/* ── Mobile sticky checkout bar ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-4 bg-champagne border-t border-bronze/10"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl px-5 py-3 border border-bronze/10 shadow-sm">
            <p className="text-[8px] font-bold uppercase tracking-[0.35em] text-bronze/40">Total</p>
            <p className="text-lg font-editorial font-black text-bronze">{formatPrice(total_amount + shipping_fee)}</p>
          </div>
          <Link
            to="/checkout"
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-chocolate text-champagne font-bold text-[10px] uppercase tracking-[0.35em] rounded-2xl hover:bg-bronze transition-all duration-300 shadow-xl"
          >
            Proceed to Checkout
            <span className="material-symbols-outlined text-sm">east</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-24">
        {/* ── Header — same editorial style on all screen sizes ── */}
        <div className="mb-10 lg:mb-24 text-center lg:text-left">
          <h1 className="text-5xl lg:text-9xl font-editorial font-black text-bronze uppercase tracking-tighter leading-none">
            THE<br />ARCHIVE <span className="text-gold italic font-light">CART</span>
          </h1>
          <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-6 mt-5 lg:mt-8">
            <span className="text-[9px] font-bold tracking-[0.5em] text-gold uppercase">EST. 2024 // BRIDAL &amp; MENSWEAR</span>
            <div className="hidden lg:block h-px w-24 bg-gold/30"></div>
            <span className="text-[9px] font-bold tracking-[0.5em] text-bronze/40 uppercase">{cart.length} {cart.length === 1 ? 'Item' : 'Items'} in your collection</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* ── Cart Items ── */}
          <div className="w-full lg:w-2/3 space-y-8 lg:space-y-12">
            {/* Desktop column headers */}
            <div className="hidden lg:grid grid-cols-[3fr,1fr,1fr,1fr] gap-6 pb-6 border-b border-bronze/10 text-[9px] font-bold uppercase tracking-[0.4em] text-bronze/30">
              <div className="text-left">Artifact</div>
              <div className="text-center">Valuation</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Subtotal</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-bronze/10">
              {cart.map((item) => {
                const { id, image, name, color, price, amount, size } = item;
                return (
                  <div key={id} className="py-7 lg:py-12">
                    {/* Mobile layout: image left, info right */}
                    <div className="flex gap-5 lg:hidden">
                      <div className="w-28 h-32 shrink-0 overflow-hidden bg-white border border-champagne/20 shadow-sm">
                        <OptimizedImage
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 className="text-xl font-editorial font-bold text-bronze uppercase leading-tight">{name}</h3>
                          <p className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase flex items-center gap-2">
                            <span className="size-2 rounded-full border border-bronze/20" style={{ background: colorSwatch(color) }}></span>
                            {color}
                          </p>
                          {size && <p className="text-[9px] font-bold tracking-[0.2em] text-bronze/40 uppercase">Size: {size}</p>}
                          <button
                            type="button"
                            className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.25em] text-red-800/50 hover:text-red-800 transition-colors pt-1"
                            onClick={() => removeItem(id)}
                          >
                            <span className="material-symbols-outlined text-sm">delete</span> Remove
                          </button>
                        </div>
                        {/* Mobile: qty + price row at bottom */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="inline-flex items-center gap-4 px-4 py-1.5 border border-bronze/20 rounded-full">
                            <button
                              type="button"
                              className="material-symbols-outlined text-base text-bronze hover:text-gold transition-colors"
                              onClick={() => toggleAmount(id, 'dec')}
                            >
                              remove
                            </button>
                            <span className="text-sm font-bold w-4 text-center text-bronze">{amount}</span>
                            <button
                              type="button"
                              className="material-symbols-outlined text-base text-bronze hover:text-gold transition-colors"
                              onClick={() => toggleAmount(id, 'inc')}
                            >
                              add
                            </button>
                          </div>
                          <span className="text-xl font-editorial font-bold text-bronze">{formatPrice(price * amount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout: 4-column grid */}
                    <div className="hidden lg:grid grid-cols-[3fr,1fr,1fr,1fr] gap-8 items-center">
                      <div className="flex gap-8 items-center">
                        <div className="size-40 shrink-0 overflow-hidden bg-white border border-champagne/20 shadow-sm relative group">
                          <OptimizedImage
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-editorial font-bold text-bronze uppercase leading-none">{name}</h3>
                          <div className="space-y-1">
                            <p className="text-[9px] font-bold tracking-[0.2em] text-gold uppercase flex items-center gap-2">
                              <span className="size-2 rounded-full border border-bronze/20" style={{ background: colorSwatch(color) }}></span>
                              {color}
                            </p>
                            {size && <p className="text-[9px] font-bold tracking-[0.2em] text-bronze/40 uppercase">Size: {size}</p>}
                          </div>
                          <button
                            type="button"
                            className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-red-800/60 hover:text-red-800 transition-colors pt-4"
                            onClick={() => removeItem(id)}
                          >
                            <span className="material-symbols-outlined text-sm">delete</span> Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-center text-lg font-editorial text-bronze/60">{formatPrice(price)}</div>
                      <div className="flex justify-center items-center">
                        <div className="inline-flex items-center gap-6 px-5 py-2 border border-bronze/20 rounded-full">
                          <button type="button" className="material-symbols-outlined text-base text-bronze hover:text-gold transition-colors" onClick={() => toggleAmount(id, 'dec')}>remove</button>
                          <span className="text-sm font-bold w-4 text-center text-bronze">{amount}</span>
                          <button type="button" className="material-symbols-outlined text-base text-bronze hover:text-gold transition-colors" onClick={() => toggleAmount(id, 'inc')}>add</button>
                        </div>
                      </div>
                      <div className="text-right text-xl font-editorial font-bold text-bronze">{formatPrice(price * amount)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-bronze/10">
              <Link to="/products" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/60 hover:text-gold transition-all">
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-2 transition-transform">west</span>
                Continue Curating
              </Link>
              <button onClick={clearCart} className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 hover:text-bronze transition-colors">
                Clear Collection
              </button>
            </div>
          </div>

          {/* ── Order Summary — desktop only; mobile uses sticky bottom bar ── */}
          <div className="hidden lg:block w-full lg:w-1/3">
            <div className="sticky top-32 bg-white/40 backdrop-blur-md p-10 rounded-[2px] border border-bronze/10">
              <h4 className="text-2xl font-editorial font-bold text-bronze uppercase mb-8 pb-4 border-b border-bronze/10">
                Acquisition Summary
              </h4>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50">Subtotal</span>
                  <span className="text-lg font-editorial text-bronze">{formatPrice(total_amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/50">Shipping</span>
                  <span className="text-lg font-editorial text-bronze">{shipping_fee === 0 ? 'Free' : formatPrice(shipping_fee)}</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-bronze/10">
                  <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold">Order Total</span>
                  <span className="text-3xl font-editorial font-black text-bronze">{formatPrice(total_amount + shipping_fee)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center py-6 bg-chocolate text-champagne font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-bronze transition-all duration-500 shadow-xl mb-6"
              >
                Proceed to Checkout
              </Link>

              <div className="flex flex-col gap-4 pt-6 border-t border-bronze/5">
                <div className="flex gap-4 items-center">
                  <span className="material-symbols-outlined text-gold text-lg">verified_user</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/60 leading-tight">Authenticity Guaranteed</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="material-symbols-outlined text-gold text-lg">local_shipping</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-bronze/60 leading-tight">Global Priority Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
