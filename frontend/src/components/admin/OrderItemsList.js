import React from 'react';
import { formatPrice } from '../../utils/helpers';

function OrderItemsList({ orderItems }) {
  return (
    <div className="space-y-6">
      {orderItems.map((item, index) => {
        const { name, price, quantity, image, color, size } = item;
        return (
          <div key={index} className="flex gap-6 group">
            <div className="size-24 lg:size-32 shrink-0 rounded-2xl overflow-hidden border border-bronze/10 shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <p className="text-base font-bold text-bronze uppercase tracking-wide group-hover:text-gold transition-colors">{name}</p>
                <p className="font-editorial font-bold text-lg text-bronze">{formatPrice(price * quantity)}</p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {color && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">Color:</span>
                    <div
                      className="w-4 h-4 rounded-full border border-bronze/20 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                )}
                {size && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-bronze/40">
                    Size: <span className="text-bronze">{size}</span>
                  </span>
                )}
              </div>

              <div className="pt-2 text-xs font-bold text-bronze/60">
                {quantity} x {formatPrice(price)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderItemsList;
