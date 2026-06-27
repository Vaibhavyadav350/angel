import React from 'react';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';
import { useSettingsContext } from '../../context/settings_context';
import { formatPrice } from '../../utils/helpers';
import { computeOrderSummary } from '../../utils/pricing';
import { Link } from 'react-router-dom';

const CartTotals = () => {
  const { currentUser } = useUserContext();
  const { cart } = useCartContext();
  const { settings } = useSettingsContext();

  // Cart preview uses Standard delivery; Express and coupons are applied at checkout.
  const summary = computeOrderSummary(cart, { method: 'standard', config: settings });

  return (
    <div className="flex justify-end pt-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Itemised totals */}
        <div className="space-y-4 pb-6 border-b border-bronze/10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/50">Item Total</span>
            <span className="font-editorial text-base text-bronze">{formatPrice(summary.itemTotal)}</span>
          </div>
          {summary.productDiscount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-600">Product Discount</span>
              <span className="font-editorial text-base text-emerald-600">−{formatPrice(summary.productDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/50">Shipping (Standard)</span>
            <span className="font-editorial text-base text-bronze">{formatPrice(summary.delivery)}</span>
          </div>
        </div>

        {/* Order Total */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold">Order Total</span>
          <span className="font-editorial font-bold text-xl text-bronze">
            {formatPrice(summary.toPay)}
          </span>
        </div>
        <p className="text-[9px] text-bronze/40 text-right -mt-4">Includes GST of {formatPrice(summary.gst)} · Express available at checkout</p>

        {/* CTA */}
        {currentUser ? (
          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-4 bg-bronze text-champagne py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-chocolate transition-all duration-500"
          >
            Proceed to Checkout
            <span className="material-symbols-outlined text-sm">east</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-4 bg-bronze text-champagne py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-chocolate transition-all duration-500"
          >
            Login to Checkout
            <span className="material-symbols-outlined text-sm">east</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartTotals;
