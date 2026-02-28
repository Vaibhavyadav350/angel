import React from 'react';
import { useCartContext } from '../../context/cart_context';
import { Link } from 'react-router-dom';
import CartItem from '../CartItem/';
import CartTotals from '../CartTotals/';

const CartContent = () => {
  const { cart, clearCart } = useCartContext();

  if (!cart || cart.length < 1) return null;

  return (
    <div>
      {/* Column Headers */}
      <div className="hidden lg:grid grid-cols-[auto,1fr,auto,auto,auto] gap-6 pb-4 border-b border-bronze/10 text-[9px] font-bold uppercase tracking-[0.4em] text-bronze/30">
        <div className="w-20">Item</div>
        <div>Details</div>
        <div>Unit Price</div>
        <div>Quantity</div>
        <div className="text-right">Total</div>
      </div>

      {/* Cart Items */}
      <div>
        {cart.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-8">
        <Link
          to="/products"
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/60 hover:text-gold transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">west</span>
          Continue Shopping
        </Link>
        <button
          type="button"
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 hover:text-bronze transition-colors"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      {/* Totals */}
      <CartTotals />
    </div>
  );
};

export default CartContent;
