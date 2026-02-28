import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { useCartContext } from '../../context/cart_context';
import AmountButtons from '../AmountButtons/';

const AddToCart = ({ product }) => {
  const { addToCart } = useCartContext();

  // Hooks must be called before any early returns
  const { _id: id, stock = 0, colors = [], sizes = [] } = product || {};
  const [mainColor, setMainColor] = useState(colors && colors.length > 0 ? colors[0] : 'default');
  const [mainSize, setMainSize] = useState(sizes && sizes.length > 0 ? sizes[0] : 'default');
  const [amount, setAmount] = useState(1);

  // Early return after hooks
  if (!product || !product._id) {
    return null; // Don't render if product is invalid
  }

  const increase = () => {
    setAmount((oldAmount) => {
      let tempAmount = oldAmount + 1;
      if (tempAmount > stock) {
        tempAmount = stock;
      }
      return tempAmount;
    });
  };

  const decrease = () => {
    setAmount((oldAmount) => {
      let tempAmount = oldAmount - 1;
      if (tempAmount < 1) {
        tempAmount = 1;
      }
      return tempAmount;
    });
  };

  return (
    <div className="space-y-10">
      {colors && colors.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 block">Select Finish</span>
          <div className="flex flex-wrap gap-4">
            {colors.map((color, index) => {
              return (
                <button
                  key={index}
                  className={`size-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${mainColor === color ? 'border-gold scale-110 shadow-lg' : 'border-transparent hover:border-bronze/20'
                    }`}
                  style={{ background: color }}
                  onClick={() => {
                    setMainColor(colors[index]);
                  }}
                >
                  {mainColor === color && <FaCheck className={color === '#ffffff' || color === 'white' ? 'text-bronze' : 'text-white'} size={12} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes && sizes.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze/40 block">Select Silhouette</span>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setMainSize(size)}
                  className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${mainSize === size
                      ? 'bg-bronze text-champagne border-bronze shadow-xl'
                      : 'bg-white text-bronze border-bronze/5 hover:border-gold/30'
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
        <AmountButtons
          amount={amount}
          increase={increase}
          decrease={decrease}
        />
        <Link
          to='/cart'
          className="flex-1 w-full sm:w-auto py-5 bg-bronze text-champagne text-[11px] font-black uppercase tracking-[0.2em] rounded text-center hover:bg-gold transition-all duration-500 active:scale-[0.98] shadow-2xl shadow-bronze/10"
          onClick={(e) => {
            e.preventDefault();
            addToCart(id, mainColor || 'default', mainSize || 'default', amount, product);
            setTimeout(() => {
              window.location.href = '/cart';
            }, 100);
          }}
        >
          Acquire Artifact
        </Link>
      </div>
    </div>
  );
};

export default AddToCart;
