import React from 'react';
import { formatPrice } from '../../utils/helpers';
import AmountButtons from '../AmountButtons/';
import { useCartContext } from '../../context/cart_context';

const CartItem = ({ id, image, name, color, price, amount, size, mrp, discountPercent }) => {
  const { removeItem, toggleAmount } = useCartContext();

  const increase = () => toggleAmount(id, 'inc');
  const decrease = () => toggleAmount(id, 'dec');

  return (
    <div className="grid grid-cols-[auto,1fr,auto,auto,auto] gap-6 items-center py-8 border-b border-bronze/10">
      {/* Image */}
      <div className="w-20 h-24 flex-shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Name & Details */}
      <div className="space-y-2 min-w-0">
        <h5 className="text-base font-editorial font-bold text-bronze capitalize truncate">{name}</h5>
        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.3em] text-bronze/40">
          {color && (
            <span className="flex items-center gap-2">
              Color
              <span
                className="inline-block w-3 h-3 rounded-full border border-bronze/20"
                style={{ background: color }}
              />
            </span>
          )}
          {size && <span>Size: {size}</span>}
        </div>
        {/* Mobile price */}
        <p className="text-sm font-editorial text-bronze lg:hidden">{formatPrice(price)}</p>
      </div>

      {/* Unit Price — hidden on small */}
      <div className="hidden lg:block">
        <p className="font-editorial text-base text-bronze">{formatPrice(price)}</p>
        {discountPercent > 0 && mrp > price && (
          <p className="text-[10px] text-bronze/40 line-through">{formatPrice(mrp)}</p>
        )}
      </div>

      {/* Amount */}
      <div className="flex items-center gap-2">
        <AmountButtons amount={amount} increase={increase} decrease={decrease} />
      </div>

      {/* Subtotal + Remove */}
      <div className="flex flex-col items-end gap-2">
        <p className="font-editorial font-bold text-bronze">{formatPrice(price * amount)}</p>
        <button
          type="button"
          onClick={() => removeItem(id)}
          aria-label={`Remove ${name}`}
          className="text-bronze/30 hover:text-bronze transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
