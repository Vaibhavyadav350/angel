import React from 'react';
import { formatPrice } from '../../utils/helpers';

function OrderItemsList({ orderItems }) {
  return (
    <div className="space-y-4">
      {orderItems.map((item, index) => {
        const { name, price, quantity, image, color, size } = item;
        return (
          <div key={index} className="flex items-start gap-4">
            <img
              src={image}
              alt={name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm font-bold text-bronze">{name}</p>
                {color && (
                  <div
                    className="w-4 h-4 rounded-full border border-bronze/20"
                    style={{ backgroundColor: color }}
                  />
                )}
                {size && (
                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-bronze/20 text-bronze/60 rounded">
                    {size}
                  </span>
                )}
              </div>
              <p className="text-sm text-gold mt-1">{formatPrice(price)}</p>
              <p className="text-xs text-bronze/50 mt-0.5">Qty: {quantity}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderItemsList;
