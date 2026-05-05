import React, { useState, useEffect } from 'react';

import { FaCheck } from 'react-icons/fa';
import { useCartContext } from '../../context/cart_context';
import AmountButtons from '../AmountButtons/';
import { toast } from 'react-toastify';

const AddToCart = ({ product }) => {
  const { addToCart } = useCartContext();

  const { _id: id, stock: globalStock = 0, colors = [], sizes = [], variants = [] } = product || {};

  // Track selections
  const [mainColor, setMainColor] = useState(null);
  const [mainSize, setMainSize] = useState(null);
  const [amount, setAmount] = useState(1);
  const [expressDelivery, setExpressDelivery] = useState(false);

  // Derived available options based on selections
  const [availableColors, setAvailableColors] = useState(colors);
  const [availableSizes, setAvailableSizes] = useState(sizes);

  // Max stock for currently selected permutation
  const [availableStockLimit, setAvailableStockLimit] = useState(globalStock);

  useEffect(() => {
    // If we only have 1 color/size, auto-select them
    if (colors?.length === 1) setMainColor(colors[0]);
    if (sizes?.length === 1) setMainSize(sizes[0]);
  }, [colors, sizes]);

  useEffect(() => {
    if (variants && variants.length > 0) {
      // Logic to grey out/disable options out of stock based on the other selection
      if (mainSize) {
        // Find all colors available for THIS size
        const validColors = variants.filter(v => v.size === mainSize && v.stock > 0).map(v => v.color);
        setAvailableColors(validColors);
        // If current color is no longer valid for this size, reset it
        if (mainColor && !validColors.includes(mainColor)) setMainColor(null);
      } else {
        // If no size, show all colors that have at least some stock somewhere
        const validColors = [...new Set(variants.filter(v => v.stock > 0).map(v => v.color))];
        setAvailableColors(validColors.length > 0 ? validColors : colors);
      }

      if (mainColor) {
        // Find all sizes available for THIS color
        const validSizes = variants.filter(v => v.color === mainColor && v.stock > 0).map(v => v.size);
        setAvailableSizes(validSizes);
        // If current size is no longer valid, reset it
        if (mainSize && !validSizes.includes(mainSize)) setMainSize(null);
      } else {
        const validSizes = [...new Set(variants.filter(v => v.stock > 0).map(v => v.size))];
        setAvailableSizes(validSizes.length > 0 ? validSizes : sizes);
      }

      // Calculate stock limit
      if (mainSize && mainColor) {
        const matchingVariant = variants.find(v => v.size === mainSize && v.color === mainColor);
        const limit = matchingVariant ? matchingVariant.stock : 0;
        setAvailableStockLimit(limit);
        if (amount > limit) setAmount(limit === 0 ? 1 : limit);
      } else {
        setAvailableStockLimit(globalStock); // fallback if selections not complete
      }
    }
    // eslint-disable-next-line
  }, [mainSize, mainColor, variants, colors, sizes, globalStock]);

  if (!product || !product._id) {
    return null;
  }

  const increase = () => {
    setAmount((oldAmount) => {
      let tempAmount = oldAmount + 1;
      if (tempAmount > availableStockLimit) {
        tempAmount = availableStockLimit;
      }
      return tempAmount;
    });
  };

  const decrease = () => {
    setAmount((oldAmount) => {
      let tempAmount = oldAmount - 1;
      if (tempAmount < 1) tempAmount = 1;
      return tempAmount;
    });
  };

  const handleAcquire = (e) => {
    e.preventDefault();
    // Hardware API: Haptic feedback for tactile affirmation (Philosophy 15)
    if (navigator.vibrate) navigator.vibrate([15, 30, 15]);

    if (colors?.length > 0 && !mainColor) {
      toast.error('Please select a color finish to proceed.', { position: 'top-center' });
      return;
    }
    if (sizes?.length > 0 && !mainSize) {
      toast.error('Please select a size silhouette to proceed.', { position: 'top-center' });
      return;
    }
    if (availableStockLimit === 0) {
      toast.error('This specific variant is currently out of stock.', { position: 'top-center' });
      return;
    }

    addToCart(id, mainColor || 'default', mainSize || 'default', amount, product, expressDelivery);
    setTimeout(() => {
      window.location.href = '/cart';
    }, 100);
  };

  return (
    <div className="space-y-10">

      {/* Colors Section */}
      {colors && colors.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 block flex justify-between">
            <span>Select Finish {mainColor && <span className="text-bronze">- {mainColor}</span>}</span>
          </span>
          <div className="flex flex-wrap gap-4">
            {colors.map((color, index) => {
              const isAvailable = variants?.length > 0 ? availableColors.includes(color) : true;
              return (
                <button
                  key={index}
                  disabled={!isAvailable}
                  className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 
                      ${mainColor === color ? 'border-gold shadow-lg scale-110' : 'border-transparent'}
                      ${!isAvailable ? 'opacity-20 cursor-not-allowed bg-diagonal-stripes' : 'hover:scale-110 hover:shadow-md cursor-pointer'}
                    `}
                  style={{ background: color, backgroundSize: '10px 10px' }}
                  onClick={() => setMainColor(color)}
                  title={!isAvailable ? 'Out of Stock in selected Size' : ''}
                >
                  {mainColor === color && <FaCheck className={color === '#ffffff' || color === 'white' ? 'text-bronze' : 'text-white'} size={12} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes Section */}
      {sizes && sizes.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 block flex justify-between">
            <span>Select Silhouette {mainSize && <span className="text-bronze">- {mainSize}</span>}</span>
            {mainSize && mainColor && variants?.length > 0 && (
              <span className={`text-[9px] ${availableStockLimit > 0 ? (availableStockLimit <= 3 ? 'text-red-500' : 'text-green-600') : 'text-red-500'}`}>
                {availableStockLimit > 0
                  ? (availableStockLimit <= 3 ? `Only ${availableStockLimit} Left In Stock` : 'In Stock')
                  : 'Out of Stock'}
              </span>
            )}
          </span>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size, index) => {
              const isAvailable = variants?.length > 0 ? availableSizes.includes(size) : true;
              return (
                <button
                  key={index}
                  disabled={!isAvailable}
                  onClick={() => setMainSize(size)}
                  className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 border
                    ${mainSize === size
                      ? 'bg-bronze text-champagne border-bronze shadow-xl'
                      : (isAvailable ? 'bg-white text-bronze border-bronze/10 hover:border-bronze hover:bg-bronze/5' : 'bg-transparent text-bronze/30 border-bronze/5 cursor-not-allowed')
                    }`}
                >
                  <span className={!isAvailable ? 'line-through opacity-50' : ''}>{size}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Express Delivery Add-On */}
      <div className="pt-2 pb-4 border-b border-bronze/10">
        <label className="flex items-start gap-4 cursor-pointer group w-fit">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              type="checkbox"
              checked={expressDelivery}
              onChange={(e) => setExpressDelivery(e.target.checked)}
              className="peer appearance-none w-4 h-4 border-2 border-bronze/20 rounded-[2px] checked:bg-gold checked:border-gold transition-all duration-200 cursor-pointer"
            />
            <FaCheck className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 w-2 h-2 pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-bronze group-hover:text-gold transition-colors">
              Express Delivery <span className="text-gold">(+$50)</span>
            </span>
            <span className="text-[9px] text-bronze/50 font-medium mt-1">Ships in 1-2 working days</span>
          </div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-stretch gap-4 pt-4">
        <AmountButtons
          amount={amount}
          increase={increase}
          decrease={decrease}
          max={availableStockLimit}
        />
        <button
          onClick={handleAcquire}
          disabled={availableStockLimit === 0 && Boolean(mainSize && (colors?.length > 0 ? mainColor : true))}
          className="flex-1 w-full flex items-center justify-center py-4 bg-bronze text-champagne text-[11px] font-black uppercase tracking-[0.2em] rounded-md hover:bg-gold hover:-translate-y-1 transition-all duration-500 active:scale-[0.98] shadow-2xl shadow-bronze/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bronze disabled:hover:translate-y-0"
        >
          {availableStockLimit === 0 && Boolean(mainSize && (colors?.length > 0 ? mainColor : true))
            ? 'Sold Out'
            : 'Add to Cart'}
        </button>
      </div>

    </div>
  );
};

export default AddToCart;
