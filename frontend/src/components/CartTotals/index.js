import React from 'react';
import { useCartContext } from '../../context/cart_context';
import { useUserContext } from '../../context/user_context';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const CartTotals = () => {
  const { currentUser } = useUserContext();
  const { total_amount, shipping_fee } = useCartContext();

  return (
    <div className="flex justify-end pt-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Totals */}
        <div className="space-y-4 pb-6 border-b border-bronze/10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/50">Subtotal</span>
            <span className="font-editorial text-base text-bronze">{formatPrice(total_amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-bronze/50">Shipping</span>
            <span className="font-editorial text-base text-bronze">{formatPrice(shipping_fee)}</span>
          </div>
        </div>

        {/* Order Total */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gold">Order Total</span>
          <span className="font-editorial font-bold text-xl text-bronze">
            {formatPrice(total_amount + shipping_fee)}
          </span>
        </div>

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
