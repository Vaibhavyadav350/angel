import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const AmountButtons = ({ increase, decrease, amount, max }) => {
  return (
    <div className="flex items-center border border-bronze/20 rounded-md bg-white">
      <button
        type="button"
        className="px-4 py-4 text-bronze/60 hover:text-bronze hover:bg-bronze/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={decrease}
        disabled={amount <= 1}
      >
        <FaMinus size={10} />
      </button>
      <h2 className="w-8 text-center text-sm font-bold text-bronze select-none">{amount}</h2>
      <button
        type="button"
        className="px-4 py-4 text-bronze/60 hover:text-bronze hover:bg-bronze/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={increase}
        disabled={amount >= max}
      >
        <FaPlus size={10} />
      </button>
    </div>
  );
};

export default AmountButtons;
